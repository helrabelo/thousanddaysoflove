'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import Image from 'next/image'
import PhotoReactions from './PhotoReactions'
import PhotoComments from './PhotoComments'
import { formatTimeAgo } from '@/lib/utils/format'

interface PhotoCardProps {
  photo: {
    id: string
    title: string | null
    caption: string | null
    storage_path: string
    guest_name: string
    upload_phase: 'before' | 'during' | 'after'
    reactions_count: number
    comment_count: number
    created_at: string
  }
  guestSessionId: string | null
  guestName: string
  onClick?: () => void
}

const PHASE_LABELS = {
  before: 'Antes do Casamento',
  during: 'Durante o Casamento',
  after: 'Depois do Casamento',
}

export default function PhotoCard({
  photo,
  guestSessionId,
  guestName,
  onClick,
}: PhotoCardProps) {
  // Build Supabase CDN URL
  const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wedding-photos/${photo.storage_path}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#E8E6E3]"
    >
      {/* Photo */}
      <div
        className="relative aspect-square cursor-pointer overflow-hidden bg-[#F8F6F3]"
        onClick={onClick}
      >
        <Image
          src={photoUrl}
          alt={photo.title || 'Foto do convidado'}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Phase Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
            style={{
              fontFamily: 'var(--font-crimson)',
              background: 'rgba(255, 255, 255, 0.9)',
              color: 'var(--primary-text)',
            }}
          >
            {PHASE_LABELS[photo.upload_phase]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        {photo.title && (
          <h3
            className="text-lg font-medium text-[#2C2C2C] line-clamp-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {photo.title}
          </h3>
        )}

        {/* Description */}
        {photo.caption && (
          <p
            className="text-sm text-[#4A4A4A] line-clamp-3"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            {photo.caption}
          </p>
        )}

        {/* Guest Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E8E6E3]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--accent)' }}
          >
            <User className="w-4 h-4" style={{ color: 'var(--secondary-text)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium text-[#2C2C2C] truncate"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {photo.guest_name}
            </p>
            <p
              className="text-xs text-[#A8A8A8]"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              {formatTimeAgo(photo.created_at)}
            </p>
          </div>
        </div>

        {/* Interactions */}
        <div className="flex items-center gap-2 pt-2">
          <PhotoReactions
            photoId={photo.id}
            guestSessionId={guestSessionId}
            guestName={guestName}
            initialCount={photo.reactions_count}
          />
          <PhotoComments
            photoId={photo.id}
            guestSessionId={guestSessionId}
            guestName={guestName}
            initialCount={photo.comment_count}
          />
        </div>
      </div>
    </motion.div>
  )
}
