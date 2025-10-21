import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import type { Invitation } from '@/types/wedding';

type InvitationLayoutProps = {
  children: ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const normalizedCode = code?.toUpperCase();

  // Fetch invitation data for personalized metadata (server-side)
  let invitation: Invitation | null = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('invitations')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    invitation = data as Invitation | null;
  } catch (error) {
    console.error('Error fetching invitation for metadata:', error);
  }

  // Personalized metadata if invitation found
  if (invitation) {
    const guestFirstName = invitation.guest_name.split(' ')[0];
    const title = `${guestFirstName}, você está convidado(a)! 💍`;
    const description = `Hel & Ylana se casam em 20 de Novembro de 2025 na Casa HY. ${invitation.plus_one_allowed ? 'Você pode trazer acompanhante! ❤️' : 'Sua presença é fundamental! ❤️'}`;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thousanddaysof.love';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${baseUrl}/convite/${normalizedCode}`,
        siteName: 'Casamento Hel & Ylana',
        locale: 'pt_BR',
        // TODO: Add OG image at /public/og-image-invitation.jpg (1200x630)
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
      // WhatsApp-specific metadata
      other: {
        'og:image:width': '1200',
        'og:image:height': '630',
      },
    };
  }

  // Default metadata if invitation not found
  return {
    title: 'Convite Personalizado - Hel & Ylana',
    description: 'Você está convidado(a) para o casamento de Hel & Ylana em 20 de Novembro de 2025!',
    openGraph: {
      title: 'Convite Personalizado - Hel & Ylana',
      description: 'Você está convidado(a) para o casamento de Hel & Ylana em 20 de Novembro de 2025!',
      type: 'website',
      url: 'https://thousanddaysof.love/convite',
      siteName: 'Casamento Hel & Ylana',
      locale: 'pt_BR',
    },
  };
}

export default function InvitationLayout({ children }: InvitationLayoutProps) {
  return <>{children}</>;
}
