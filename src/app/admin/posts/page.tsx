'use client';

/**
 * Admin Posts Moderation Dashboard
 *
 * Comprehensive moderation interface for guest posts
 *
 * Features:
 * - View all posts (pending/approved/rejected)
 * - Approve/reject with keyboard shortcuts (A/R)
 * - Batch operations
 * - Filter by status and post type
 * - Pin/unpin special moments
 * - Real-time statistics
 * - Mobile-optimized
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Search,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import type { GuestPost } from '@/types/wedding';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<GuestPost[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);

  // Load posts when filter changes
  useEffect(() => {
    loadPosts();
  }, [filter]);

  // Load stats
  useEffect(() => {
    loadStats();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const selectedPost = posts.find(p => selectedPosts.has(p.id));
      if (!selectedPost || selectedPost.status !== 'pending') return;

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleModerate(selectedPost.id, 'approve');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        const reason = prompt('Motivo da rejeição (opcional):');
        handleModerate(selectedPost.id, 'reject', reason || undefined);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [posts, selectedPosts]);

  const loadPosts = async () => {
    setIsLoading(true);

    try {
      const statusFilter = filter === 'all' ? '' : filter;
      const response = await fetch(`/api/admin/posts?status=${statusFilter}`);

      if (!response.ok) {
        throw new Error('Failed to load posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/posts?action=stats');

      if (!response.ok) {
        throw new Error('Failed to load stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadPosts(), loadStats()]);
    setIsRefreshing(false);
  };

  const handleModerate = async (
    postId: string,
    action: 'approve' | 'reject',
    reason?: string
  ) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Failed to moderate post');
      }

      setSelectedPosts(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      await Promise.all([loadPosts(), loadStats()]);
    } catch (error) {
      console.error('Error moderating post:', error);
      alert('Erro ao moderar mensagem');
    }
  };

  const handleBatchModerate = async (action: 'approve' | 'reject') => {
    if (selectedPosts.size === 0) return;

    const confirmed = confirm(
      `Deseja ${action === 'approve' ? 'aprovar' : 'rejeitar'} ${selectedPosts.size} mensagens?`
    );

    if (!confirmed) return;

    try {
      const payload: {
        action: 'approve' | 'reject';
        postIds: string[];
        reason?: string;
      } = {
        action,
        postIds: Array.from(selectedPosts),
      };

      const response = await fetch('/api/admin/posts/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Failed to batch moderate posts');
      }

      setSelectedPosts(new Set());
      await Promise.all([loadPosts(), loadStats()]);
    } catch (error) {
      console.error('Error batch moderating:', error);
      alert('Erro ao moderar mensagens em lote');
    }
  };

  const toggleSelection = (postId: string) => {
    setSelectedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const filteredPosts = posts.filter(post =>
    searchQuery
      ? post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.guest_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-serif text-[#2C2C2C]">
              Moderação de Mensagens
            </h1>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg border border-[#E8E6E3] p-4">
                <p className="text-sm text-[#4A4A4A] mb-1">Total</p>
                <p className="text-2xl font-semibold text-[#2C2C2C]">{stats.total}</p>
              </div>
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                <p className="text-sm text-amber-700 mb-1">Pendentes</p>
                <p className="text-2xl font-semibold text-amber-900">{stats.pending}</p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-700 mb-1">Aprovadas</p>
                <p className="text-2xl font-semibold text-green-900">{stats.approved}</p>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <p className="text-sm text-red-700 mb-1">Rejeitadas</p>
                <p className="text-2xl font-semibold text-red-900">{stats.rejected}</p>
              </div>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-700 mb-1">Curtidas</p>
                <p className="text-2xl font-semibold text-blue-900">{stats.total_likes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border border-[#E8E6E3] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A8A8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por conteúdo ou nome..."
                  className="w-full pl-10 pr-4 py-2 border border-[#E8E6E3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8A8A8]"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${
                    filter === status
                      ? 'bg-[#2C2C2C] text-white'
                      : 'bg-[#F8F6F3] text-[#4A4A4A] hover:bg-[#E8E6E3]'
                  }`}
                >
                  {status === 'all' && 'Todas'}
                  {status === 'pending' && 'Pendentes'}
                  {status === 'approved' && 'Aprovadas'}
                  {status === 'rejected' && 'Rejeitadas'}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Actions */}
          {selectedPosts.size > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E8E6E3]">
              <span className="text-sm text-[#4A4A4A]">
                {selectedPosts.size} selecionada{selectedPosts.size !== 1 && 's'}
              </span>
              <button
                type="button"
                onClick={() => handleBatchModerate('approve')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Aprovar Todas
              </button>
              <button
                type="button"
                onClick={() => handleBatchModerate('reject')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Rejeitar Todas
              </button>
              <button
                type="button"
                onClick={() => setSelectedPosts(new Set())}
                className="text-sm text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors"
              >
                Limpar seleção
              </button>
            </div>
          )}
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-[#A8A8A8] animate-spin mx-auto mb-4" />
            <p className="text-[#4A4A4A]">Carregando mensagens...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E6E3] p-12 text-center">
            <AlertCircle className="w-12 h-12 text-[#A8A8A8] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">
              Nenhuma mensagem encontrada
            </h3>
            <p className="text-[#4A4A4A]">
              {searchQuery
                ? 'Tente ajustar os filtros de busca'
                : 'Não há mensagens neste status'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostModerationCard
                key={post.id}
                post={post}
                isSelected={selectedPosts.has(post.id)}
                onToggleSelect={() => toggleSelection(post.id)}
                onModerate={handleModerate}
              />
            ))}
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 bg-white rounded-lg border border-[#E8E6E3] p-4">
          <h3 className="text-sm font-semibold text-[#2C2C2C] mb-2">
            Atalhos de Teclado
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#4A4A4A]">
            <div><kbd className="px-2 py-1 bg-[#F8F6F3] rounded">A</kbd> = Aprovar</div>
            <div><kbd className="px-2 py-1 bg-[#F8F6F3] rounded">R</kbd> = Rejeitar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Post Moderation Card Component
interface PostModerationCardProps {
  post: GuestPost;
  isSelected: boolean;
  onToggleSelect: () => void;
  onModerate: (postId: string, action: 'approve' | 'reject', reason?: string) => void;
}

function PostModerationCard({
  post,
  isSelected,
  onToggleSelect,
  onModerate,
}: PostModerationCardProps) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    onModerate(post.id, 'reject', rejectReason || undefined);
    setShowRejectInput(false);
    setRejectReason('');
  };

  const statusColors = {
    pending: 'bg-amber-50 border-amber-200 text-amber-700',
    approved: 'bg-green-50 border-green-200 text-green-700',
    rejected: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border-2 transition-all ${
        isSelected ? 'border-[#2C2C2C] shadow-md' : 'border-[#E8E6E3]'
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="mt-1 w-4 h-4 rounded border-[#E8E6E3]"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-[#2C2C2C]">{post.guest_name}</h3>
                <p className="text-sm text-[#A8A8A8]">
                  {new Date(post.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[post.status]}`}>
                {post.status === 'pending' && 'Pendente'}
                {post.status === 'approved' && 'Aprovada'}
                {post.status === 'rejected' && 'Rejeitada'}
              </span>
            </div>

            {/* Content */}
            <p className="text-[#2C2C2C] whitespace-pre-wrap mb-4">{post.content}</p>

            {/* Media Preview */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {post.media_urls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-md bg-[#F8F6F3] border border-[#E8E6E3]" />
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-[#4A4A4A] mb-4">
              <span>❤️ {post.likes_count}</span>
              <span>💬 {post.comments_count}</span>
              <span>{post.post_type === 'text' ? '💭' : post.post_type === 'image' ? '📸' : '🎥'} {post.post_type}</span>
            </div>

            {/* Actions */}
            {post.status === 'pending' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onModerate(post.id, 'approve')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Aprovar
                </button>

                <button
                  type="button"
                  onClick={() => setShowRejectInput(!showRejectInput)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Rejeitar
                </button>
              </div>
            )}

            {/* Reject Input */}
            <AnimatePresence>
              {showRejectInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-red-50 rounded-md border border-red-200"
                >
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Motivo da rejeição (opcional)"
                    className="w-full px-3 py-2 border border-red-300 rounded-md mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Confirmar Rejeição
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="px-4 py-2 text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Moderation Info */}
            {post.moderated_at && (
              <div className="mt-4 p-3 bg-[#F8F6F3] rounded-md text-sm text-[#4A4A4A]">
                <p>
                  <strong>Moderado por:</strong> {post.moderated_by}
                </p>
                <p>
                  <strong>Data:</strong> {new Date(post.moderated_at).toLocaleString('pt-BR')}
                </p>
                {post.moderation_reason && (
                  <p>
                    <strong>Motivo:</strong> {post.moderation_reason}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
