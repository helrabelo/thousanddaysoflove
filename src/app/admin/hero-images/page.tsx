'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Image as ImageIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'

interface HeroImage {
  key: string
  label: string
  description: string
  currentUrl: string
  size: string
}

export default function AdminHeroImages() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroPosterUrl, setHeroPosterUrl] = useState('')
  const [heroCoupleUrl, setHeroCoupleUrl] = useState('')

  useEffect(() => {
    loadHeroImages()
  }, [])

  const loadHeroImages = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['hero_poster_url', 'hero_couple_url'])

      if (error) throw error

      const posterSetting = data?.find(s => s.setting_key === 'hero_poster_url')
      const coupleSetting = data?.find(s => s.setting_key === 'hero_couple_url')

      setHeroPosterUrl(posterSetting?.setting_value || '')
      setHeroCoupleUrl(coupleSetting?.setting_value || '')

      setHeroImages([
        {
          key: 'hero_poster_url',
          label: 'Hero Video Poster',
          description: 'Imagem de poster do vídeo hero (1920x1080)',
          currentUrl: posterSetting?.setting_value || '',
          size: '1920x1080'
        },
        {
          key: 'hero_couple_url',
          label: 'Hero Fallback Image',
          description: 'Imagem fallback para usuários com reduced motion (1920x1080)',
          currentUrl: coupleSetting?.setting_value || '',
          size: '1920x1080'
        }
      ])
    } catch (error) {
      console.error('Error loading hero images:', error)
      alert('Erro ao carregar imagens hero')
    } finally {
      setLoading(false)
    }
  }

  const saveHeroImages = async () => {
    setSaving(true)
    try {
      const supabase = createClient()

      // Update hero_poster_url
      await supabase
        .from('site_settings')
        .update({ setting_value: heroPosterUrl })
        .eq('setting_key', 'hero_poster_url')

      // Update hero_couple_url
      await supabase
        .from('site_settings')
        .update({ setting_value: heroCoupleUrl })
        .eq('setting_key', 'hero_couple_url')

      alert('Imagens hero salvas com sucesso!')
      await loadHeroImages()
    } catch (error) {
      console.error('Error saving hero images:', error)
      alert('Erro ao salvar imagens hero')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <p className="text-burgundy-700">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-burgundy-700 hover:text-blush-600 inline-block mb-4">
            ← Voltar ao Admin
          </Link>
          <h1 className="text-4xl font-playfair font-bold text-burgundy-800">
            Gerenciar Imagens Hero
          </h1>
          <p className="text-burgundy-600 mt-2">
            Configure as imagens que aparecem no banner principal da homepage
          </p>
        </div>

        {/* Hero Poster Image */}
        <Card className="glass p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-burgundy-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-burgundy-800">Hero Video Poster</h3>
              <p className="text-sm text-burgundy-600">
                Imagem de poster do vídeo hero (1920x1080)
              </p>
            </div>
          </div>

          <ImageUpload
            currentImageUrl={heroPosterUrl}
            onImageUploaded={setHeroPosterUrl}
            folder="hero"
          />

          {heroPosterUrl && (
            <div className="mt-4">
              <p className="text-xs text-burgundy-600 mb-2">Preview:</p>
              <img
                src={heroPosterUrl}
                alt="Hero Poster Preview"
                className="w-full h-auto rounded-lg border border-burgundy-200"
              />
            </div>
          )}
        </Card>

        {/* Hero Couple Image */}
        <Card className="glass p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-burgundy-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-burgundy-800">Hero Fallback Image</h3>
              <p className="text-sm text-burgundy-600">
                Imagem fallback para reduced motion (1920x1080)
              </p>
            </div>
          </div>

          <ImageUpload
            currentImageUrl={heroCoupleUrl}
            onImageUploaded={setHeroCoupleUrl}
            folder="hero"
          />

          {heroCoupleUrl && (
            <div className="mt-4">
              <p className="text-xs text-burgundy-600 mb-2">Preview:</p>
              <img
                src={heroCoupleUrl}
                alt="Hero Couple Preview"
                className="w-full h-auto rounded-lg border border-burgundy-200"
              />
            </div>
          )}
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={saveHeroImages}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              'Salvando...'
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>

        {/* Info Card */}
        <Card className="glass p-4 mt-6 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Dicas</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tamanho recomendado: 1920x1080 pixels (16:9)</li>
            <li>• Formato: JPG ou PNG</li>
            <li>• Tamanho máximo: 5MB</li>
            <li>• Hero Poster: Aparece quando o vídeo está carregando</li>
            <li>• Hero Fallback: Aparece para usuários com reduced motion habilitado</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
