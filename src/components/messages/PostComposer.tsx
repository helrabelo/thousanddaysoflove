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
import { createGuestPost } from '@/lib/supabase/messages';
import type { GuestPost } from '@/types/wedding';

interface PostComposerProps {
  guestName: string;
  isAuthenticated?: boolean; // Whether guest is authenticated via invitation code
  onPostCreated?: (post: GuestPost) => void;
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

  // Upload files to Supabase Storage (placeholder - implement based on your setup)
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    // TODO: Implement Supabase Storage upload
    // For now, return placeholder URLs
    // In production, upload to wedding-photos bucket or create a new bucket

    // Example implementation:
    // const supabase = createClient();
    // const uploadPromises = files.map(async (file) => {
    //   const fileExt = file.name.split('.').pop();
    //   const fileName = `${Math.random()}.${fileExt}`;
    //   const filePath = `posts/${fileName}`;
    //
    //   const { data, error } = await supabase.storage
    //     .from('wedding-posts')
    //     .upload(filePath, file);
    //
    //   if (error) throw error;
    //   return data.path;
    // });
    //
    // return await Promise.all(uploadPromises);

    return []; // Placeholder
  };

  // Submit post
  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      setError('Escreva uma mensagem ou adicione uma foto/vídeo');
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

      // Create post
      const post = await createGuestPost({
        guest_name: guestName,
        content: content.trim(),
        post_type: detectPostType(),
        media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
        isAuthenticated, // Pass authentication status for auto-approval
      });

      if (!post) {
        throw new Error('Erro ao criar mensagem');
      }

      // Success!
      setContent('');
      setMediaFiles([]);
      mediaPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setMediaPreviewUrls([]);
      setShowEmojiPicker(false);

      onPostCreated?.(post);
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
      className="bg-white rounded-lg border border-[#E8E6E3] p-6 shadow-sm"
    >
      {/* Guest Name */}
      <div className="mb-4">
        <p className="text-sm text-[#4A4A4A]">
          Mensagem de <span className="font-semibold text-[#2C2C2C]">{guestName}</span>
        </p>
      </div>

      {/* Textarea */}
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compartilhe suas felicitações, memórias ou desejos para o casal..."
          className="w-full min-h-[120px] p-3 border border-[#E8E6E3] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#A8A8A8] transition-all text-[#2C2C2C]"
          disabled={isSubmitting}
        />

        {/* Character Counter */}
        <div className="flex justify-end mt-2">
          <span
            className={`text-sm ${
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
            className="mb-4 grid grid-cols-3 gap-2"
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
                  className="relative aspect-square rounded-md overflow-hidden bg-[#F8F6F3] border border-[#E8E6E3]"
                >
                  {isVideo ? (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={isSubmitting}
                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4 text-[#2C2C2C]" />
                  </button>

                  {/* Video Icon */}
                  {isVideo && (
                    <div className="absolute bottom-1 left-1 p-1 bg-black/50 rounded-full">
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
            className="mb-4 p-3 bg-[#F8F6F3] rounded-md border border-[#E8E6E3]"
          >
            <div className="grid grid-cols-12 gap-2">
              {WEDDING_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  disabled={isSubmitting}
                  className="text-2xl hover:scale-125 transition-transform disabled:opacity-50"
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
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {/* Left: Media & Emoji Buttons */}
        <div className="flex items-center gap-2">
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
            className="p-2 rounded-full hover:bg-[#F8F6F3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Adicionar foto/vídeo"
          >
            <ImageIcon className="w-5 h-5 text-[#4A4A4A]" />
          </button>

          {/* Emoji Picker Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-[#F8F6F3] transition-colors disabled:opacity-50"
            title="Adicionar emoji"
          >
            <Smile className="w-5 h-5 text-[#4A4A4A]" />
          </button>

          {/* File Count */}
          {mediaFiles.length > 0 && (
            <span className="text-sm text-[#4A4A4A]">
              {mediaFiles.length}/{MAX_FILES} arquivo{mediaFiles.length !== 1 && 's'}
            </span>
          )}
        </div>

        {/* Right: Cancel & Submit */}
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isContentTooLong || (!content.trim() && mediaFiles.length === 0)}
            className="flex items-center gap-2 px-6 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Moderation Notice */}
      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-[#F8F6F3] rounded-md border border-[#E8E6E3]">
          <p className="text-xs text-[#4A4A4A] text-center">
            ✨ Sua mensagem será revisada antes de aparecer no feed. Aguarde alguns minutos!
          </p>
        </div>
      )}
      {isAuthenticated && (
        <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
          <p className="text-xs text-green-700 text-center">
            ✅ Como convidado autenticado, sua mensagem será publicada imediatamente!
          </p>
        </div>
      )}
    </motion.div>
  );
}
