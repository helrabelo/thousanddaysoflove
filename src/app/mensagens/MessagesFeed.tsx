'use client';

/**
 * Messages Feed Component
 *
 * Interactive social feed with post composer and filtering
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { getApprovedPosts } from '@/lib/supabase/messages';
import type { GuestPost } from '@/types/wedding';
import type { GuestSession } from '@/lib/auth/guestAuth';
import PostComposer from '@/components/messages/PostComposer';
import PostCard from '@/components/messages/PostCard';

type PostTypeFilter = 'all' | 'text' | 'image' | 'video' | 'mixed';

export default function MessagesFeed() {
  const [posts, setPosts] = useState<GuestPost[]>([]);
  const [filter, setFilter] = useState<PostTypeFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [guestName, setGuestName] = useState<string>('');
  const [showComposer, setShowComposer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check guest session to determine authentication status
  useEffect(() => {
    checkGuestSession();
  }, []);

  const checkGuestSession = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();

      if (response.ok && data.success && data.session) {
        const session: GuestSession = data.session;
        setGuestName(session.guest?.name || 'Convidado');
        setIsAuthenticated(session.auth_method === 'invitation_code');
        setShowComposer(true);
      } else {
        // Fallback to session storage for anonymous guests
        const storedName = sessionStorage.getItem('guest_name');
        if (storedName) {
          setGuestName(storedName);
          setIsAuthenticated(false); // Anonymous guest
          setShowComposer(true);
        }
      }
    } catch (error) {
      console.error('Error checking guest session:', error);
      // Fallback to session storage
      const storedName = sessionStorage.getItem('guest_name');
      if (storedName) {
        setGuestName(storedName);
        setIsAuthenticated(false);
        setShowComposer(true);
      }
    }
  };

  // Load posts
  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
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
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  };

  const handlePostCreated = () => {
    // Show success message based on authentication status
    if (isAuthenticated) {
      alert('✅ Sua mensagem foi publicada imediatamente!');
      // Refresh to show the newly posted message
      handleRefresh();
    } else {
      alert('✨ Sua mensagem foi enviada! Aguarde alguns minutos para aprovação.');
    }
  };

  const handleGuestNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('guest_name') as string;

    if (name?.trim()) {
      sessionStorage.setItem('guest_name', name.trim());
      setGuestName(name.trim());
      setShowComposer(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Guest Name Input (if not set) */}
      {!guestName && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">
            Identifique-se para compartilhar
          </h3>
          <form onSubmit={handleGuestNameSubmit} className="flex gap-3">
            <input
              type="text"
              name="guest_name"
              placeholder="Seu nome"
              required
              className="flex-1 px-4 py-2 border border-[#E8E6E3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8A8A8] transition-all"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              Continuar
            </button>
          </form>
        </motion.div>
      )}

      {/* Post Composer */}
      <AnimatePresence>
        {showComposer && (
          <PostComposer
            guestName={guestName}
            isAuthenticated={isAuthenticated}
            onPostCreated={handlePostCreated}
          />
        )}
      </AnimatePresence>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#4A4A4A]" />
            <div className="flex gap-2">
              {([
                { value: 'all', label: 'Todos', emoji: '✨' },
                { value: 'text', label: 'Texto', emoji: '💭' },
                { value: 'image', label: 'Fotos', emoji: '📸' },
                { value: 'video', label: 'Vídeos', emoji: '🎥' },
              ] as const).map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                    filter === value
                      ? 'bg-[#2C2C2C] text-white'
                      : 'bg-[#F8F6F3] text-[#4A4A4A] hover:bg-[#E8E6E3]'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Post Count */}
        <div className="mt-3 pt-3 border-t border-[#E8E6E3]">
          <p className="text-sm text-[#4A4A4A]">
            {isLoading ? (
              'Carregando mensagens...'
            ) : (
              <>
                {posts.length} mensage{posts.length !== 1 ? 'ns' : 'm'}
                {filter !== 'all' && ` · Filtro: ${filter}`}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-[#A8A8A8] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">Carregando mensagens...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E8E6E3] p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-[#A8A8A8] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">
            Nenhuma mensagem ainda
          </h3>
          <p className="text-[#4A4A4A]">
            Seja o primeiro a compartilhar suas felicitações para o casal!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard
                  post={post}
                  currentGuestName={guestName || undefined}
                  showComments={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More (Placeholder for pagination) */}
      {posts.length >= 50 && !isLoading && (
        <div className="text-center py-6">
          <button
            type="button"
            className="px-6 py-3 bg-white border border-[#E8E6E3] text-[#2C2C2C] rounded-md hover:bg-[#F8F6F3] transition-colors"
          >
            Carregar mais mensagens
          </button>
        </div>
      )}
    </div>
  );
}
