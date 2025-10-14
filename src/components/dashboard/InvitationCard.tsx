'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  Users,
  Utensils,
} from 'lucide-react';
import QRCodeLib from 'qrcode';
import type { Invitation } from '@/types/wedding';

interface InvitationCardProps {
  invitation: Invitation;
}

export default function InvitationCard({ invitation }: InvitationCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  // Generate QR code on mount
  useEffect(() => {
    generateQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateQRCode = async () => {
    setQrLoading(true);
    try {
      const inviteUrl = `${window.location.origin}/convite/${invitation.code}`;
      const url = await QRCodeLib.toDataURL(inviteUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#2C2C2C',
          light: '#F8F6F3',
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setQrLoading(false);
    }
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/convite/${invitation.code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `convite-${invitation.code}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleShareWhatsApp = () => {
    const inviteUrl = `${window.location.origin}/convite/${invitation.code}`;
    const message = `Olá! Aqui está o convite para o casamento de Hel e Ylana: ${inviteUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8E6E3]">
      <h2 className="font-playfair text-2xl text-[#2C2C2C] mb-6 text-center">
        Seu Convite
      </h2>

      {/* Invitation Code */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 mb-6 text-center shadow-md"
      >
        <p className="font-crimson text-sm text-[#4A4A4A] mb-2">
          Código do Convite
        </p>
        <p className="font-mono text-3xl font-bold text-[#2C2C2C] tracking-wider">
          {invitation.code}
        </p>
      </motion.div>

      {/* QR Code */}
      <div className="bg-white rounded-xl p-4 mb-6 text-center shadow-md">
        {qrLoading ? (
          <div className="w-[200px] h-[200px] mx-auto bg-[#F8F6F3] rounded-lg flex items-center justify-center">
            <QrCode className="w-8 h-8 text-[#A8A8A8] animate-pulse" />
          </div>
        ) : qrCodeUrl ? (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={qrCodeUrl}
            alt="QR Code do convite"
            className="w-[200px] h-[200px] mx-auto rounded-lg"
          />
        ) : (
          <div className="w-[200px] h-[200px] mx-auto bg-[#F8F6F3] rounded-lg flex items-center justify-center">
            <QrCode className="w-8 h-8 text-[#A8A8A8]" />
          </div>
        )}
        <p className="font-crimson text-xs text-[#4A4A4A] mt-3">
          Escaneie para acessar seu convite
        </p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {/* Plus One */}
        {invitation.plus_one_allowed && (
          <div className="bg-[#F8F6F3] rounded-lg p-3 flex items-center gap-3">
            <Users className="w-5 h-5 text-[#A8A8A8] flex-shrink-0" />
            <div>
              <p className="font-crimson text-sm text-[#2C2C2C]">
                Acompanhante permitido
              </p>
              {invitation.plus_one_name && (
                <p className="font-crimson text-xs text-[#4A4A4A]">
                  {invitation.plus_one_name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Table Number */}
        {invitation.table_number && (
          <div className="bg-[#F8F6F3] rounded-lg p-3 flex items-center gap-3">
            <Utensils className="w-5 h-5 text-[#A8A8A8] flex-shrink-0" />
            <div>
              <p className="font-crimson text-sm text-[#2C2C2C]">
                Mesa {invitation.table_number}
              </p>
            </div>
          </div>
        )}

        {/* Custom Message */}
        {invitation.custom_message && (
          <div className="bg-[#F8F6F3] rounded-lg p-4">
            <p className="font-crimson text-sm text-[#2C2C2C] italic">
              &quot;{invitation.custom_message}&quot;
            </p>
            <p className="font-crimson text-xs text-[#4A4A4A] mt-2 text-right">
              — Hel & Ylana
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleCopyLink}
          className="w-full bg-white text-[#2C2C2C] font-crimson py-3 px-4 rounded-lg
                   hover:bg-[#F8F6F3] transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-[#2C2C2C]" />
              Link copiado!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copiar link do convite
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadQR}
            disabled={!qrCodeUrl}
            className="bg-white text-[#2C2C2C] font-crimson py-3 px-4 rounded-lg
                     hover:bg-[#F8F6F3] transition-colors flex items-center justify-center gap-2 shadow-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Baixar QR
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="bg-[#2C2C2C] text-white font-crimson py-3 px-4 rounded-lg
                     hover:bg-[#4A4A4A] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 className="w-5 h-5" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
