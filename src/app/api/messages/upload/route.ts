/**
 * Message Media Upload API
 *
 * POST /api/messages/upload → Upload media files for guest posts
 *
 * This route uses service role to bypass RLS and securely upload files
 * to the wedding-posts bucket.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Máximo de 10 arquivos permitidos' },
        { status: 400 }
      )
    }

    // Validate files
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de arquivo não permitido: ${file.type}` },
          { status: 400 }
        )
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Arquivo ${file.name} excede o tamanho máximo de 50MB` },
          { status: 400 }
        )
      }
    }

    const supabase = createAdminClient()
    const uploadedUrls: string[] = []

    console.log('📤 Starting upload for', files.length, 'file(s)')

    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const fileName = `${timestamp}-${random}-${index}.${fileExt}`
      const filePath = `posts/${fileName}`

      console.log(`  Uploading ${index + 1}/${files.length}: ${file.name} → ${filePath}`)

      // Convert File to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data, error } = await supabase.storage
        .from('wedding-posts')
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error(`  ❌ Upload failed for ${file.name}:`, error)
        return NextResponse.json(
          { error: `Erro ao fazer upload de ${file.name}: ${error.message}` },
          { status: 500 }
        )
      }

      console.log(`  ✅ Upload successful: ${data.path}`)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('wedding-posts')
        .getPublicUrl(filePath)

      uploadedUrls.push(urlData.publicUrl)
      console.log(`  🔗 Public URL: ${urlData.publicUrl}`)
    }

    console.log(`✅ All ${files.length} file(s) uploaded successfully`)

    return NextResponse.json(
      {
        success: true,
        urls: uploadedUrls,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erro interno ao fazer upload' },
      { status: 500 }
    )
  }
}
