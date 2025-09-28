#!/bin/bash

# Mil Dias de Amor - Supabase Sync Script
# Manage local ↔ production database synchronization

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Wedding-themed header
echo -e "${PURPLE}💍 Mil Dias de Amor - Database Sync${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Function to display help
show_help() {
    echo -e "${YELLOW}Usage: $0 [COMMAND]${NC}"
    echo ""
    echo -e "${CYAN}Commands:${NC}"
    echo -e "  ${GREEN}setup${NC}           Set up local development environment"
    echo -e "  ${GREEN}start${NC}           Start local Supabase services"
    echo -e "  ${GREEN}stop${NC}            Stop local Supabase services"
    echo -e "  ${GREEN}reset${NC}           Reset local database with fresh seed data"
    echo -e "  ${GREEN}generate${NC}        Generate TypeScript types from schema"
    echo -e "  ${GREEN}migrate${NC}         Apply new migrations to local database"
    echo -e "  ${GREEN}pull${NC}            Pull schema changes from production (CAREFUL!)"
    echo -e "  ${GREEN}push${NC}            Push local migrations to production (CAREFUL!)"
    echo -e "  ${GREEN}status${NC}          Show status of all services"
    echo -e "  ${GREEN}studio${NC}          Open Supabase Studio"
    echo -e "  ${GREEN}mailpit${NC}         Open Mailpit email testing"
    echo -e "  ${GREEN}backup${NC}          Create backup of production data"
    echo ""
    echo -e "${YELLOW}Brazilian Wedding Features:${NC}"
    echo -e "  ${CYAN}• PIX payment integration${NC}"
    echo -e "  ${CYAN}• Portuguese email templates${NC}"
    echo -e "  ${CYAN}• Brazilian phone validation${NC}"
    echo -e "  ${CYAN}• BRL currency formatting${NC}"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

    # Check Supabase CLI
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}❌ Supabase CLI not found${NC}"
        echo -e "${YELLOW}Installing via Homebrew...${NC}"
        brew install supabase/tap/supabase
    else
        echo -e "${GREEN}✅ Supabase CLI found${NC}"
    fi

    # Check Docker
    if ! docker ps > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running${NC}"
        echo -e "${YELLOW}Please start Docker and try again${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ Docker is running${NC}"
    fi

    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "supabase" ]; then
        echo -e "${RED}❌ Not in wedding website project directory${NC}"
        echo -e "${YELLOW}Please run this script from the project root${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ In correct project directory${NC}"
    fi

    echo ""
}

# Function to set up local environment
setup_local() {
    echo -e "${PURPLE}🎊 Setting up local development environment...${NC}"

    check_prerequisites

    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        echo -e "${BLUE}📝 Creating .env.local from template...${NC}"
        cp .env.local.example .env.local
        echo -e "${GREEN}✅ .env.local created${NC}"
    else
        echo -e "${GREEN}✅ .env.local already exists${NC}"
    fi

    # Start Supabase
    echo -e "${BLUE}🚀 Starting Supabase local environment...${NC}"
    supabase start

    # Generate types
    echo -e "${BLUE}📝 Generating TypeScript types...${NC}"
    npm run db:generate

    echo ""
    echo -e "${GREEN}🎉 Setup complete!${NC}"
    echo -e "${CYAN}Wedding website ready for development at http://localhost:3000${NC}"
    echo ""
}

# Function to start services
start_services() {
    echo -e "${BLUE}🚀 Starting Supabase services...${NC}"
    check_prerequisites
    supabase start
    echo -e "${GREEN}✅ Services started${NC}"
    show_status
}

# Function to stop services
stop_services() {
    echo -e "${BLUE}⏹️  Stopping Supabase services...${NC}"
    supabase stop
    echo -e "${GREEN}✅ Services stopped${NC}"
}

# Function to reset database
reset_database() {
    echo -e "${YELLOW}⚠️  This will reset your local database with fresh seed data${NC}"
    echo -e "${YELLOW}Are you sure? (y/N):${NC}"
    read -r response

    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🔄 Resetting database...${NC}"
        supabase db reset
        echo -e "${GREEN}✅ Database reset with Brazilian wedding sample data${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function to generate types
generate_types() {
    echo -e "${BLUE}📝 Generating TypeScript types from database schema...${NC}"
    npm run db:generate
    echo -e "${GREEN}✅ Types generated in src/types/supabase.ts${NC}"
}

# Function to apply migrations
apply_migrations() {
    echo -e "${BLUE}📦 Applying migrations to local database...${NC}"
    supabase db push
    echo -e "${GREEN}✅ Migrations applied${NC}"
}

# Function to pull from production
pull_from_production() {
    echo -e "${RED}⚠️  WARNING: This will overwrite your local schema with production${NC}"
    echo -e "${YELLOW}Are you absolutely sure? (type 'yes' to confirm):${NC}"
    read -r response

    if [[ "$response" == "yes" ]]; then
        echo -e "${BLUE}⬇️  Pulling schema from production...${NC}"
        supabase db pull --linked
        echo -e "${GREEN}✅ Schema pulled from production${NC}"
        generate_types
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function to push to production
push_to_production() {
    echo -e "${RED}⚠️  WARNING: This will apply local migrations to PRODUCTION${NC}"
    echo -e "${RED}This affects the live wedding website!${NC}"
    echo -e "${YELLOW}Are you absolutely sure? (type 'PUSH_TO_PRODUCTION' to confirm):${NC}"
    read -r response

    if [[ "$response" == "PUSH_TO_PRODUCTION" ]]; then
        echo -e "${BLUE}⬆️  Pushing migrations to production...${NC}"
        supabase db push --linked
        echo -e "${GREEN}✅ Migrations pushed to production${NC}"
        echo -e "${CYAN}🎊 Production wedding website updated!${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Service Status:${NC}"
    echo ""
    supabase status
    echo ""
    echo -e "${CYAN}🌐 Quick Links:${NC}"
    echo -e "  Wedding Website: ${GREEN}http://localhost:3000${NC}"
    echo -e "  Supabase Studio: ${GREEN}http://127.0.0.1:54323${NC}"
    echo -e "  Email Testing:   ${GREEN}http://127.0.0.1:54324${NC}"
    echo ""
}

# Function to open studio
open_studio() {
    echo -e "${BLUE}🎨 Opening Supabase Studio...${NC}"
    if command -v open &> /dev/null; then
        open http://127.0.0.1:54323
    else
        echo -e "${CYAN}Visit: http://127.0.0.1:54323${NC}"
    fi
}

# Function to open mailpit
open_mailpit() {
    echo -e "${BLUE}📧 Opening Mailpit email testing...${NC}"
    if command -v open &> /dev/null; then
        open http://127.0.0.1:54324
    else
        echo -e "${CYAN}Visit: http://127.0.0.1:54324${NC}"
    fi
}

# Function to backup production
backup_production() {
    echo -e "${BLUE}💾 Creating production backup...${NC}"

    BACKUP_DIR="$PROJECT_DIR/backups"
    mkdir -p "$BACKUP_DIR"

    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/wedding_backup_$TIMESTAMP.sql"

    echo -e "${YELLOW}This feature requires production database access${NC}"
    echo -e "${YELLOW}Please implement backup strategy based on your hosting setup${NC}"

    # Placeholder for backup implementation
    # supabase db dump --linked > "$BACKUP_FILE"

    echo -e "${GREEN}✅ Backup would be saved to: $BACKUP_FILE${NC}"
}

# Main script logic
case "${1:-help}" in
    "setup")
        setup_local
        ;;
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "reset")
        reset_database
        ;;
    "generate")
        generate_types
        ;;
    "migrate")
        apply_migrations
        ;;
    "pull")
        pull_from_production
        ;;
    "push")
        push_to_production
        ;;
    "status")
        show_status
        ;;
    "studio")
        open_studio
        ;;
    "mailpit")
        open_mailpit
        ;;
    "backup")
        backup_production
        ;;
    "help"|*)
        show_help
        ;;
esac

echo ""
echo -e "${PURPLE}💕 Para Hel e Ylana - Mil dias de amor se tornando para sempre!${NC}"