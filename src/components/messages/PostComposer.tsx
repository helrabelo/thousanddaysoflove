'use client';

/**
 * Post Composer Component
 *
 * Rich post composer with emoji picker and multi-file upload
 *
 * Features:
 * - Rich text input with character counter
 * - Emoji picker with common wedding emojis
 * - Multi-file upload (images + videos, up to 10 files)
 * - Preview uploaded media
 * - Post type detection (text/image/video/mixed)
 * - Loading states and error handling
 * - Mobile-first responsive design with proper touch targets
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile,
  Image as ImageIcon,
  Video,
  X,
  Send,
  Loader2,
} from 'lucide-react';
import type { GuestPost } from '@/types/wedding';

interface PostComposerProps {
  guestName: string;
  isAuthenticated?: boolean; // Whether guest is authenticated via invitation code
  onPostCreated?: (post: GuestPost, autoApproved: boolean) => void;
  onCancel?: () => void;
}

// Wedding emoji presets
const WEDDING_EMOJIS = [
  '❤️', '💕', '💖', '💗', '💝', '💞',
  '🥰', '😍', '🤩', '😘', '😊', '☺️',
  '🎉', '🎊', '🎈', '✨', '🌟', '⭐',
  '💐', '🌹', '🌺', '🌸', '🌻', '🌷',
  '👰', '🤵', '💒', '💍', '💏', '💑',
  '🎂', '🍰', '🥂', '🍾', '🎁', '📸',
];

export default function PostComposer({
  guestName,
  isAuthenticated = false,
  onPostCreated,
  onCancel,
}: PostComposerProps) {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CONTENT_LENGTH = 5000;
  const MAX_FILES = 10;

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (mediaFiles.length + files.length > MAX_FILES) {
      setError(`Máximo de ${MAX_FILES} arquivos permitidos`);
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    if (validFiles.length !== files.length) {
      setError('Apenas imagens e vídeos são permitidos');
    }

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setMediaFiles((prev) => [...prev, ...validFiles]);
    setMediaPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setError(null);
  };

  // Remove file
  const removeFile = (index: number) => {
    URL.revokeObjectURL(mediaPreviewUrls[index]); // Clean up
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Add emoji
  const addEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.substring(0, start) + emoji + content.substring(end);

    setContent(newContent);

    // Move cursor after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // Detect post type
  const detectPostType = (): 'text' | 'image' | 'video' | 'mixed' => {
    if (mediaFiles.length === 0) return 'text';

    const hasImages = mediaFiles.some((file) => file.type.startsWith('image/'));
    const hasVideos = mediaFiles.some((file) => file.type.startsWith('video/'));

    if (hasImages && hasVideos) return 'mixed';
    if (hasImages) return 'image';
    if (hasVideos) return 'video';
    return 'text';
  };

  // Upload files via API route (uses service role)
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    console.log('📤 Starting upload for', files.length, 'file(s)');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch('/api/messages/upload', {
      method: 'POST',
      credentials: 'include', // Include cookies for authentication
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Upload failed:', data);
      throw new Error(data.error || 'Erro ao fazer upload dos arquivos');
    }

    console.log('✅ Upload completed, received', data.urls.length, 'URL(s)');
    return data.urls;
  };

  // Submit post
  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Escreva uma mensagem (você pode adicionar fotos/vídeos também)');
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError(`Mensagem muito longa (máximo ${MAX_CONTENT_LENGTH} caracteres)`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload media files
      let mediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        mediaUrls = await uploadFiles(mediaFiles);
      }

      const payload: Record<string, unknown> = {
        guestName,
        content: content.trim(),
        postType: detectPostType(),
      };

      if (mediaUrls.length > 0) {
        payload.mediaUrls = mediaUrls;
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.success || !data?.post) {
        throw new Error(data?.error || 'Erro ao criar mensagem');
      }

      // Success!
      setContent('');
      setMediaFiles([]);
      mediaPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setMediaPreviewUrls([]);
      setShowEmojiPicker(false);

      onPostCreated?.(data.post as GuestPost, data.autoApproved === true);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_CONTENT_LENGTH - content.length;
  const isContentTooLong = remainingChars < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-[#E8E6E3] p-4 sm:p-6 shadow-sm"
    >
      {/* Guest Name */}
      <div className="mb-3 sm:mb-4">
        <p className="text-sm text-[#4A4A4A]">
          Mensagem de <span className="font-semibold text-[#2C2C2C]">{guestName}</span>
        </p>
      </div>

      {/* Textarea */}
      <div className="mb-3 sm:mb-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compartilhe suas felicitações, memórias ou desejos para o casal..."
          className="w-full min-h-[120px] p-3 border border-[#E8E6E3] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#A8A8A8] transition-all text-[#2C2C2C] text-base"
          disabled={isSubmitting}
        />

        {/* Character Counter */}
        <div className="flex justify-end mt-2">
          <span
            className={`text-xs sm:text-sm ${
              isContentTooLong
                ? 'text-red-500 font-semibold'
                : remainingChars < 100
                  ? 'text-[#A8A8A8]'
                  : 'text-[#E8E6E3]'
            }`}
          >
            {remainingChars} caracteres restantes
          </span>
        </div>
      </div>

      {/* Media Preview */}
      <AnimatePresence>
        {mediaPreviewUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 sm:mb-4 grid grid-cols-3 gap-2"
          >
            {mediaPreviewUrls.map((url, index) => {
              const file = mediaFiles[index];
              const isVideo = file?.type.startsWith('video/');

              return (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-md overflow-hidden border border-[#E8E6E3]"
                >
                  {isVideo ? (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Remove Button - Proper touch target */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={isSubmitting}
                    aria-label="Remover arquivo"
                    className="absolute top-1 right-1 min-w-[44px] min-h-[44px] p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-[#2C2C2C]" />
                  </button>

                  {/* Video Icon */}
                  {isVideo && (
                    <div className="absolute bottom-1 left-1 p-1.5 bg-black/50 rounded-full">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 sm:mb-4 p-3 rounded-md border border-[#E8E6E3]"
          >
            <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
              {WEDDING_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  disabled={isSubmitting}
                  aria-label={`Adicionar emoji ${emoji}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl hover:scale-125 transition-transform disabled:opacity-50"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-md"
          >
            <p className="text-xs sm:text-sm text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions - Mobile-first stacked layout */}
      <div className="space-y-3">
        {/* Top Row: Media & Emoji Buttons + File Count */}
        <div className="flex items-center justify-between">
          {/* Left: Media & Emoji Buttons - Proper touch targets */}
          <div className="flex items-center gap-1">
            {/* Photo/Video Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              disabled={isSubmitting || mediaFiles.length >= MAX_FILES}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || mediaFiles.length >= MAX_FILES}
              aria-label="Adicionar foto ou vídeo"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-[#F8F6F3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Adicionar foto/vídeo"
            >
              <ImageIcon className="w-5 h-5 text-[#4A4A4A]" />
            </button>

            {/* Emoji Picker Toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isSubmitting}
              aria-label="Adicionar emoji"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-[#F8F6F3] transition-colors disabled:opacity-50"
              title="Adicionar emoji"
            >
              <Smile className="w-5 h-5 text-[#4A4A4A]" />
            </button>
          </div>

          {/* File Count - Only show on mobile when files exist */}
          {mediaFiles.length > 0 && (
            <span className="text-xs sm:text-sm text-[#4A4A4A] font-medium">
              {mediaFiles.length}/{MAX_FILES}
            </span>
          )}
        </div>

        {/* Bottom Row: Cancel & Submit - Full width on mobile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              aria-label="Cancelar"
              className="flex-1 sm:flex-none min-h-[44px] px-4 sm:px-6 py-2.5 text-sm sm:text-base text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors disabled:opacity-50 border border-[#E8E6E3] rounded-md hover:bg-[#F8F6F3]"
            >
              Cancelar
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isContentTooLong || (!content.trim() && mediaFiles.length === 0)}
            aria-label={isSubmitting ? 'Enviando mensagem' : 'Enviar mensagem'}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-[#2C2C2C] text-white text-sm sm:text-base font-medium rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
                <span className="whitespace-nowrap">Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Enviar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Moderation Notice - Compact on mobile */}
      {!isAuthenticated && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 rounded-md border border-[#E8E6E3] bg-[#F8F6F3]">
          <p className="text-xs text-[#4A4A4A] text-center leading-relaxed">
            ✨ Sua mensagem será revisada antes de aparecer no feed
          </p>
        </div>
      )}
      {isAuthenticated && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 rounded-md border border-green-200">
          <p className="text-xs text-green-700 text-center leading-relaxed">
            ✅ Sua mensagem será publicada imediatamente
          </p>
        </div>
      )}
    </motion.div>
  );
}
