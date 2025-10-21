'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface PhotoUploadSectionProps {
  invitationCode: string;
}

type UploadPhase = 'before' | 'during' | 'after';

export default function PhotoUploadSection({ invitationCode }: PhotoUploadSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; previewUrl: string }>>([]);
  const [phase, setPhase] = useState<UploadPhase>('before');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newEntries = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setSelectedFiles((prev) => [...prev, ...newEntries]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return next;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      // Upload each file
      const uploadPromises = selectedFiles.map(async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('phase', phase);
        formData.append('invitation_code', invitationCode);
        if (title) formData.append('title', title);
        if (description) formData.append('caption', description);

        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao fazer upload');
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('media-uploaded', {
              detail: {
                photo: data.photo,
                timelineEventId: data.photo?.timeline_event_id ?? null,
              },
            })
          );
        }

        return data;
      });

      await Promise.all(uploadPromises);

      setUploadStatus({
        type: 'success',
        message: `${selectedFiles.length} ${selectedFiles.length === 1 ? 'foto enviada' : 'fotos enviadas'} com sucesso!`,
      });

      // Clear selection and form
      selectedFiles.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
      setSelectedFiles([]);
      setTitle('');
      setDescription('');
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Erro ao fazer upload',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase Selection */}
      <div>
        <label className="block font-playfair text-lg text-[#2C2C2C] mb-3">
          Quando foi tirada?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'before' as UploadPhase, label: 'Antes' },
            { value: 'during' as UploadPhase, label: 'Durante' },
            { value: 'after' as UploadPhase, label: 'Depois' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPhase(option.value)}
              className={`px-4 py-3 rounded-xl font-crimson text-sm transition-all duration-300 ${
                phase === option.value
                  ? 'bg-[#4A7C59] text-white shadow-lg'
                  : 'bg-white text-[#4A4A4A] border border-[#E8E6E3] hover:border-[#A8A8A8]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title and Description Fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="photo-title" className="block font-playfair text-lg text-[#2C2C2C] mb-2">
            Título da foto <span className="text-[#A8A8A8] text-sm font-crimson">(opcional)</span>
          </label>
          <input
            id="photo-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Churrasco na casa da vovó"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] font-crimson text-[#2C2C2C] placeholder-[#A8A8A8] focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 transition-all"
          />
        </div>

        <div>
          <label htmlFor="photo-description" className="block font-playfair text-lg text-[#2C2C2C] mb-2">
            Descrição <span className="text-[#A8A8A8] text-sm font-crimson">(opcional)</span>
          </label>
          <textarea
            id="photo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Conte a história por trás desse momento..."
            maxLength={500}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] font-crimson text-[#2C2C2C] placeholder-[#A8A8A8] focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 transition-all resize-none"
          />
          <p className="mt-1 text-xs text-[#A8A8A8] font-crimson">
            {description.length}/500 caracteres
          </p>
        </div>
      </div>

      {/* File Upload Area */}
      <div>
        <label
          htmlFor="file-upload"
          className="block w-full cursor-pointer"
        >
          <div className="border-2 border-dashed border-[#E8E6E3] rounded-2xl p-8 text-center hover:border-[#4A7C59] hover:bg-[#F8F6F3] transition-all duration-300">
            <Upload className="w-12 h-12 mx-auto mb-4 text-[#A8A8A8]" />
            <p className="font-playfair text-lg text-[#2C2C2C] mb-2">
              Clique para selecionar fotos
            </p>
            <p className="font-crimson text-sm text-[#A8A8A8]">
              Fotos e vídeos até 10MB
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="font-playfair text-sm text-[#2C2C2C]">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedFiles.map(({ file, previewUrl }, index) => (
              <div
                key={index}
                className="relative group rounded-xl overflow-hidden bg-[#F8F6F3] aspect-square"
              >
                {file.type.startsWith('image/') ? (
                  <Image
                    src={previewUrl}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 25vw, 50vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-[#A8A8A8]" />
                  </div>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upload Status */}
      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl ${
            uploadStatus.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="font-crimson text-sm">{uploadStatus.message}</p>
        </motion.div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#4A7C59] to-[#5A8C69] text-white rounded-xl font-playfair text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {uploading ? 'Enviando...' : `Enviar ${selectedFiles.length} ${selectedFiles.length === 1 ? 'foto' : 'fotos'}`}
        </button>
      )}
    </div>
  );
}
