'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, RefreshCw, Heart } from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import {
  getGuestSession,
  logoutGuest,
} from '@/lib/supabase/invitations';
import { getGuestDashboardData } from '@/lib/supabase/dashboard';
import type { GuestDashboardData } from '@/lib/supabase/dashboard';

// Components
import CountdownTimer from '@/components/dashboard/CountdownTimer';
import ProgressTracker from '@/components/dashboard/ProgressTracker';
import InvitationCard from '@/components/dashboard/InvitationCard';
import QuickActions from '@/components/dashboard/QuickActions';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

export default function GuestDashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] =
    useState<GuestDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();

    // Auto-refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      loadDashboard(true);
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, []);

  const loadDashboard = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);

    try {
      // Check if guest is logged in
      const session = await getGuestSession();

      if (!session) {
        // Redirect to login if no session
        router.push('/meu-convite/login');
        return;
      }

      // Fetch dashboard data
      const data = await getGuestDashboardData(session.code);

      if (!data) {
        setError('Erro ao carregar dados. Tente novamente.');
        return;
      }

      setDashboardData(data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Erro ao carregar dashboard. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboard(true);
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    logoutGuest();
    router.push('/meu-convite/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-4"
            >
              <Heart className="w-8 h-8 text-pink-600" />
            </motion.div>
            <p className="font-crimson text-lg text-[#4A4A4A] italic">
              Carregando seu dashboard...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4 pt-20">
          <div className="max-w-md text-center">
            <p className="font-crimson text-lg text-[#2C2C2C] mb-4">{error}</p>
            <button
              onClick={() => loadDashboard()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-crimson px-6 py-3 rounded-lg
                       hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#F8F6F3] pt-20">
        {/* Header */}
        <header className="bg-white border-b border-[#E8E6E3] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl text-[#2C2C2C]">
                Olá, {dashboardData.invitation.guest_name.split(' ')[0]}! 👋
              </h1>
              <p className="font-crimson text-sm text-[#4A4A4A] italic">
                Seu dashboard personalizado
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-[#F8F6F3] rounded-lg transition-colors"
                title="Atualizar"
              >
                <RefreshCw
                  className={`w-5 h-5 text-[#4A4A4A] ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg
                         hover:bg-red-100 transition-colors font-crimson text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Countdown Timer (full width, prominent) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CountdownTimer />
          </motion.div>

          {/* Progress Tracker + Invitation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <ProgressTracker progress={dashboardData.progress} />
            <InvitationCard invitation={dashboardData.invitation} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <QuickActions invitation={dashboardData.invitation} />
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ActivityFeed activities={dashboardData.recentActivity} />
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="font-playfair text-2xl text-[#2C2C2C] mb-6">
              Suas Estatísticas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Posts"
                value={dashboardData.stats.posts_count}
                icon="📝"
              />
              <StatCard
                label="Comentários"
                value={dashboardData.stats.comments_count}
                icon="💬"
              />
              <StatCard
                label="Reações"
                value={dashboardData.stats.reactions_count}
                icon="❤️"
              />
              <StatCard
                label="Fotos"
                value={dashboardData.stats.photos_count}
                icon="📸"
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[#E8E6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-crimson text-sm text-[#4A4A4A]">
            Casamento Hel & Ylana • 20 de Novembro, 2025
          </p>
          <p className="font-crimson text-xs text-[#A8A8A8] mt-2">
            Celebrando 1000 dias de amor 💕
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 text-center">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="font-playfair text-3xl font-bold text-[#2C2C2C]">
        {value}
      </p>
      <p className="font-crimson text-xs text-[#4A4A4A] mt-1">{label}</p>
    </div>
  );
}
