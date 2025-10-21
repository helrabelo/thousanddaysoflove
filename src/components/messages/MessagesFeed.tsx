// @ts-nocheck: Pending animation + icon typing cleanup
'use client';

/**
 * Messages Feed Component
 *
 * Interactive feed displaying approved guest posts with filtering
 *
 * Features:
 * - Filter by post type (all/text/photos/videos)
 * - Post composer for creating new posts
 * - Displays posts with PostCard component
 * - Guest name session management
 * - Real-time engagement with reactions and comments
 * - Mobile-first responsive design
 * - Elegant wedding aesthetic
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Image, Video, FileText } from 'lucide-react';
import { getApprovedPosts } from '@/lib/supabase/messages/client';
import { getGuestSessionCookie } from '@/lib/auth/guestAuth';
import type { GuestPost } from '@/types/wedding';
import PostComposer from './PostComposer';
import PostCard from './PostCard';

type PostFilter = 'all' | 'text' | 'image' | 'video';

export default function MessagesFeed() {
  const [posts, setPosts] = useState<GuestPost[]>([]);
  const [filter, setFilter] = useState<PostFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentGuestName, setCurrentGuestName] = useState<string>();

  // Load guest session
  useEffect(() => {
    const loadGuestSession = async () => {
      const sessionToken = getGuestSessionCookie();
      if (!sessionToken) {
        console.log('No guest session token found');
        return;
      }

      // Try to get guest name from localStorage first
      let guestName = localStorage.getItem('guest_name');

      if (!guestName) {
        console.log('No guest_name in localStorage, fetching from server...');
        // If not in localStorage, fetch from server using the session token
        try {
          const response = await fetch('/api/guest/session', {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.session?.guest?.name) {
              guestName = data.session.guest.name;
              // Save to localStorage for future use
              localStorage.setItem('guest_name', guestName);
              console.log('Guest name fetched from server:', guestName);
            }
          }
        } catch (error) {
          console.error('Error fetching guest session:', error);
        }
      }

      if (guestName) {
        setCurrentGuestName(guestName);
        console.log('Current guest name set:', guestName);
      }
    };

    loadGuestSession();
  }, []);

  // Load posts
  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getApprovedPosts({
        post_type: filter === 'all' ? undefined : filter,
        limit: 50,
      });
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Handle post creation
  const handlePostCreated = () => {
    loadPosts();
  };

  // Filter stats
  const postCounts = {
    all: posts.length,
    text: posts.filter((p) => p.post_type === 'text').length,
    image: posts.filter((p) => p.post_type === 'image').length,
    video: posts.filter((p) => p.post_type === 'video').length,
  };

  const filterButtons = [
    { value: 'all' as PostFilter, label: 'Todas', icon: MessageCircle, count: postCounts.all },
    { value: 'text' as PostFilter, label: 'Texto', icon: FileText, count: postCounts.text },
    { value: 'image' as PostFilter, label: 'Fotos', icon: Image, count: postCounts.image },
    { value: 'video' as PostFilter, label: 'Vídeos', icon: Video, count: postCounts.video },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Post Composer */}
      {currentGuestName && (
        <div className="mb-8">
          <PostComposer guestName={currentGuestName} onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ value, label, icon: Icon, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                filter === value
                  ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]'
                  : 'bg-white text-[#4A4A4A] border-[#E8E6E3] hover:bg-[#F8F6F3]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
              {count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  filter === value
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E8E6E3] text-[#4A4A4A]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#2C2C2C] border-t-transparent" />
          <p className="mt-4 text-[#4A4A4A]">Carregando mensagens...</p>
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-lg border border-[#E8E6E3]"
        >
          <div className="text-6xl mb-4">💌</div>
          <h3 className="font-playfair text-2xl text-[#2C2C2C] mb-2">
            Nenhuma mensagem ainda
          </h3>
          <p className="text-[#4A4A4A] mb-6">
            Seja o primeiro a compartilhar uma mensagem especial!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentGuestName={currentGuestName}
              showComments={true}
              onCommentAdded={loadPosts}
            />
          ))}
        </div>
      )}

      {/* Login Prompt for Non-Authenticated Users */}
      {!currentGuestName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-white rounded-lg border border-[#E8E6E3] text-center"
        >
          <div className="text-4xl mb-3">🔐</div>
          <h3 className="font-playfair text-xl text-[#2C2C2C] mb-2">
            Faça login para interagir
          </h3>
          <p className="text-[#4A4A4A] mb-4">
            Entre para curtir, comentar e compartilhar suas próprias mensagens
          </p>
          <a
            href="/dia-1000/login"
            className="inline-block px-6 py-3 bg-[#2C2C2C] text-white rounded-md hover:bg-[#1A1A1A] transition-colors"
          >
            Fazer Login
          </a>
        </motion.div>
      )}
    </div>
  );
}
