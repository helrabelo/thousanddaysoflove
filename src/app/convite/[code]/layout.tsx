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
      .from('simple_guests')
      .select('*')
      .eq('invitation_code', normalizedCode)
      .single();

    // Map simple_guests to Invitation interface
    if (data) {
      invitation = {
        id: data.id,
        code: data.invitation_code,
        guest_name: data.name,
        guest_email: data.email,
        guest_phone: data.phone,
        relationship_type: data.relationship_type,
        plus_one_allowed: data.plus_one_allowed || false,
        plus_one_name: data.plus_one_name,
        custom_message: data.custom_message,
        table_number: data.table_number,
        dietary_restrictions: data.notes,
        opened_at: data.opened_at,
        open_count: data.open_count || 0,
        rsvp_completed: data.rsvp_completed || false,
        gift_selected: data.gift_selected || false,
        photos_uploaded: data.photos_uploaded || false,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by
      } as Invitation;
    }
  } catch (error) {
    console.error('Error fetching invitation for metadata:', error);
  }

  // Personalized metadata if invitation found
  if (invitation) {
    const guestFirstName = invitation.guest_name.split(' ')[0];
    const title = `${guestFirstName}, você está convidado(a)! 💍`;
    const description = `Hel & Ylana se casam em 20 de Novembro de 2025 na Casa HY. Sua presença é fundamental! ❤️`;

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
