'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { loginWithInvitationCode } from '@/lib/supabase/invitations';

/**
 * Direct Dashboard Access with Invitation Code
 *
 * URL: /meu-convite/FAMILY001
 * Auto-logs in the guest and redirects to dashboard
 */
export default function DirectDashboardAccessPage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;

  useEffect(() => {
    async function autoLogin() {
      if (!code) {
        router.push('/meu-convite/login');
        return;
      }

      try {
        // Attempt auto-login with the provided code
        const invitation = await loginWithInvitationCode(code);

        if (!invitation) {
          // Invalid code - redirect to login with error
          router.push('/meu-convite/login?error=invalid_code');
          return;
        }

        // Success! Redirect to dashboard
        router.push('/meu-convite');
      } catch (error) {
        console.error('Auto-login error:', error);
        router.push('/meu-convite/login?error=login_failed');
      }
    }

    autoLogin();
  }, [code, router]);

  // Loading state while auto-login happens
  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-flex items-center justify-center w-16 h-16 bg-[#E8E6E3] rounded-full mb-4"
        >
          <Heart className="w-8 h-8 text-[#A8A8A8]" />
        </motion.div>
        <p className="font-crimson text-lg text-[#4A4A4A] italic">
          Acessando seu convite...
        </p>
        <p className="font-crimson text-sm text-[#A8A8A8] mt-2">
          Código: {code}
        </p>
      </motion.div>
    </div>
  );
}
