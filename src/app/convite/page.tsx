import { redirect } from 'next/navigation';
import { getCurrentGuestSession } from '@/lib/auth/guestAuth.server';
import ConvitePageClient from './ConvitePageClient';

export default async function ConvitePage() {
  // Check if user is authenticated
  const guestSession = await getCurrentGuestSession();

  // If authenticated, redirect to their personalized invite
  if (guestSession?.guest?.invitation_code) {
    redirect(`/convite/${guestSession.guest.invitation_code}`);
  }

  // Otherwise, render the client component
  return <ConvitePageClient />;
}
