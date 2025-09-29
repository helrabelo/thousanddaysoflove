/**
 * QR Code Generation API Route
 *
 * Features:
 * 📱 Generate QR codes for invitation codes
 * 🎨 Custom styling with wedding theme
 * 📊 Track QR code generation for analytics
 * 🔒 Secure API with invitation code validation
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateQRCodeData } from '@/lib/utils/wedding'

interface QRCodeRequest {
  invitationCode: string
  size?: number
  includeWeddingBranding?: boolean
  format?: 'png' | 'svg' | 'jpeg'
}

export async function POST(request: NextRequest) {
  try {
    const body: QRCodeRequest = await request.json()
    const { invitationCode, size = 300, includeWeddingBranding = true, format = 'png' } = body

    // Validate invitation code exists
    const supabase = createServerClient()
    const { data: guest, error } = await supabase
      .from('guests')
      .select('id, name, invitation_code')
      .eq('invitation_code', invitationCode.toUpperCase())
      .single()

    if (error || !guest) {
      return NextResponse.json(
        { error: 'Código de convite inválido' },
        { status: 404 }
      )
    }

    // Generate QR code data
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thousandaysof.love'
    const qrCodeData = generateQRCodeData(invitationCode, baseUrl)

    // For now, return QR code URL using external service
    // TODO: Replace with local qrcode library for production
    const qrCodeUrl = generateQRCodeImageUrl(qrCodeData, size, includeWeddingBranding, format)

    // Track QR code generation
    await supabase
      .from('rsvp_analytics')
      .insert({
        guest_id: guest.id,
        event_type: 'qr_code_generated',
        event_data: {
          size,
          format,
          branding: includeWeddingBranding,
          timestamp: new Date().toISOString()
        },
        user_agent: request.headers.get('user-agent'),
        ip_address: getClientIP(request)
      })

    // Generate download filename
    const filename = `convite-${guest.name.replace(/\s+/g, '-').toLowerCase()}-${invitationCode.toLowerCase()}.${format}`

    return NextResponse.json({
      success: true,
      qrCodeUrl,
      downloadUrl: qrCodeUrl,
      filename,
      guestName: guest.name,
      invitationCode: guest.invitation_code,
      rsvpUrl: `${baseUrl}/rsvp?code=${invitationCode}`,
      metadata: {
        size,
        format,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('QR Code generation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationCode = searchParams.get('code')
    const size = parseInt(searchParams.get('size') || '300')
    const format = (searchParams.get('format') || 'png') as 'png' | 'svg' | 'jpeg'

    if (!invitationCode) {
      return NextResponse.json(
        { error: 'Código de convite é obrigatório' },
        { status: 400 }
      )
    }

    // Validate invitation code
    const supabase = createServerClient()
    const { data: guest, error } = await supabase
      .from('guests')
      .select('id, name, invitation_code')
      .eq('invitation_code', invitationCode.toUpperCase())
      .single()

    if (error || !guest) {
      return NextResponse.json(
        { error: 'Código de convite inválido' },
        { status: 404 }
      )
    }

    // Generate QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thousandaysof.love'
    const qrCodeData = generateQRCodeData(invitationCode, baseUrl)
    const qrCodeUrl = generateQRCodeImageUrl(qrCodeData, size, true, format)

    // Track QR code access
    await supabase
      .from('rsvp_analytics')
      .insert({
        guest_id: guest.id,
        event_type: 'qr_code_accessed',
        event_data: {
          method: 'GET',
          size,
          format,
          timestamp: new Date().toISOString()
        },
        user_agent: request.headers.get('user-agent'),
        ip_address: getClientIP(request)
      })

    return NextResponse.json({
      success: true,
      qrCodeUrl,
      guestName: guest.name,
      invitationCode: guest.invitation_code
    })

  } catch (error) {
    console.error('QR Code GET error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Helper function to generate QR code image URL
function generateQRCodeImageUrl(
  data: string,
  size: number,
  includeBranding: boolean,
  format: 'png' | 'svg' | 'jpeg'
): string {
  const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/'

  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: data,
    format: format,
    bgcolor: 'FFFFFF',
    color: 'BE185D', // Burgundy wedding color
    margin: '10',
    qzone: '1'
  })

  if (includeBranding) {
    // Add error correction for logo overlay (future enhancement)
    params.set('ecc', 'M')
  }

  return `${baseUrl}?${params.toString()}`
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return request.ip || 'unknown'
}

// Batch QR code generation endpoint
export async function PUT(request: NextRequest) {
  try {
    const body: { invitationCodes: string[] } = await request.json()
    const { invitationCodes } = body

    if (!invitationCodes || invitationCodes.length === 0) {
      return NextResponse.json(
        { error: 'Lista de códigos é obrigatória' },
        { status: 400 }
      )
    }

    if (invitationCodes.length > 50) {
      return NextResponse.json(
        { error: 'Máximo 50 códigos por lote' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thousandaysof.love'
    const results = []

    for (const code of invitationCodes) {
      try {
        // Validate invitation code
        const { data: guest, error } = await supabase
          .from('guests')
          .select('id, name, invitation_code')
          .eq('invitation_code', code.toUpperCase())
          .single()

        if (error || !guest) {
          results.push({
            invitationCode: code,
            success: false,
            error: 'Código inválido'
          })
          continue
        }

        // Generate QR code
        const qrCodeData = generateQRCodeData(code, baseUrl)
        const qrCodeUrl = generateQRCodeImageUrl(qrCodeData, 300, true, 'png')

        results.push({
          invitationCode: code,
          success: true,
          qrCodeUrl,
          guestName: guest.name,
          downloadFilename: `convite-${guest.name.replace(/\s+/g, '-').toLowerCase()}-${code.toLowerCase()}.png`
        })

        // Track batch generation
        await supabase
          .from('rsvp_analytics')
          .insert({
            guest_id: guest.id,
            event_type: 'qr_code_batch_generated',
            event_data: {
              batchSize: invitationCodes.length,
              timestamp: new Date().toISOString()
            },
            user_agent: request.headers.get('user-agent'),
            ip_address: getClientIP(request)
          })

      } catch (error) {
        results.push({
          invitationCode: code,
          success: false,
          error: 'Erro interno'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    })

  } catch (error) {
    console.error('Batch QR Code generation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}