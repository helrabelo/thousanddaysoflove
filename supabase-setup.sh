#!/bin/bash

# Mil Dias de Amor - Supabase Local Development Setup Script
# Brazilian Wedding Website - Complete Local Environment Setup

set -e

echo "🎊 Mil Dias de Amor - Supabase Local Development Setup"
echo "=================================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing via Homebrew..."
    brew install supabase/tap/supabase
else
    echo "✅ Supabase CLI found"
    echo "📋 Current version: $(supabase --version)"
fi

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
else
    echo "✅ Docker is running"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

# Start Supabase local development
echo ""
echo "🚀 Starting Supabase local development environment..."
echo "This will download Docker images and may take a few minutes..."
echo ""

supabase start

# Get the local environment details
echo ""
echo "🎯 Local Development Environment Ready!"
echo "======================================"
echo ""
echo "📊 Supabase Studio: http://127.0.0.1:54323"
echo "📧 Mail Testing (Mailpit): http://127.0.0.1:54324"
echo "🗄️  Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
echo "🔗 API URL: http://127.0.0.1:54321"
echo ""

# Generate TypeScript types
echo "📝 Generating TypeScript types from database schema..."
npm run db:generate

echo ""
echo "🎊 Setup Complete! Your Brazilian wedding website is ready for development."
echo ""
echo "📋 Next Steps:"
echo "   1. Run 'npm run dev' to start the Next.js development server"
echo "   2. Visit http://localhost:3000 to see your wedding website"
echo "   3. Visit http://127.0.0.1:54323 to manage the database in Supabase Studio"
echo ""
echo "💝 Development Commands:"
echo "   npm run dev              - Start Next.js development server"
echo "   npm run supabase:studio  - Open Supabase Studio"
echo "   npm run supabase:stop    - Stop local Supabase"
echo "   npm run supabase:reset   - Reset database with fresh seed data"
echo "   npm run mailpit          - Open email testing interface"
echo ""
echo "🇧🇷 Brazilian Configuration:"
echo "   • Timezone: America/Sao_Paulo"
echo "   • Locale: pt-BR"
echo "   • Currency: BRL (Brazilian Real)"
echo "   • Phone Format: +55 (11) 99999-9999"
echo ""
echo "Para Hel e Ylana - Que seus mil dias de amor se tornem para sempre! 💕"