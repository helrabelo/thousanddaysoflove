/**
 * Messages Feed Page
 *
 * Public social feed where guests share messages, photos, and videos
 *
 * Features:
 * - Post composer for guests
 * - Social feed with approved posts
 * - Filter by post type (all/text/photos/videos)
 * - Infinite scroll (pagination)
 * - Real-time-like updates
 * - Guest name from session
 */

import { Suspense } from 'react';
import MessagesFeed from './MessagesFeed';
import Navigation from '@/components/ui/Navigation';

export const metadata = {
  title: 'Mensagens | Mil Dias de Amor',
  description: 'Compartilhe suas felicitações e mensagens para Hel & Ylana',
};

export default function MessagesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] mb-4">
            Mensagens dos Convidados
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Compartilhe suas felicitações, memórias e desejos para o casal.
            Suas mensagens trazem ainda mais alegria para este dia especial! ✨
          </p>
        </div>

        {/* Messages Feed */}
        <Suspense fallback={<LoadingSkeleton />}>
          <MessagesFeed />
        </Suspense>
      </div>
    </main>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Composer Skeleton */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6 animate-pulse">
        <div className="h-4 bg-[#F8F6F3] rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-[#F8F6F3] rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-[#F8F6F3] rounded-full"></div>
            <div className="w-8 h-8 bg-[#F8F6F3] rounded-full"></div>
          </div>
          <div className="h-10 bg-[#F8F6F3] rounded w-24"></div>
        </div>
      </div>

      {/* Post Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-[#E8E6E3] p-6 animate-pulse">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F8F6F3] rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-[#F8F6F3] rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-[#F8F6F3] rounded w-1/6"></div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-[#F8F6F3] rounded"></div>
            <div className="h-4 bg-[#F8F6F3] rounded w-5/6"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-[#F8F6F3] rounded w-16"></div>
            <div className="h-8 bg-[#F8F6F3] rounded w-16"></div>
            <div className="h-8 bg-[#F8F6F3] rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
