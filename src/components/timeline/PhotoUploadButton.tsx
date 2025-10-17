'use client'

import { Camera } from 'lucide-react'

interface PhotoUploadButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function PhotoUploadButton({ onClick, disabled }: PhotoUploadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full bg-[#F6D28B] px-4 py-2 font-semibold text-[#1C1A17] shadow-[0_10px_30px_rgba(246,210,139,0.4)] transition hover:bg-[#F7DFA9] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Camera className="h-4 w-4" />
      Enviar foto deste momento
    </button>
  )
}

export default PhotoUploadButton
