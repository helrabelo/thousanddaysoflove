#!/bin/bash

# Thousand Days of Love - Production Setup Script
# Run this script to prepare production deployment

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
echo -e "${PURPLE}💍 Mil Dias de Amor - Production Setup${NC}"
echo -e "${CYAN}====================================${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking production prerequisites...${NC}"

    # Check Supabase CLI
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}❌ Supabase CLI not found${NC}"
        echo -e "${YELLOW}Installing via Homebrew...${NC}"
        brew install supabase/tap/supabase
    else
        echo -e "${GREEN}✅ Supabase CLI found${NC}"
    fi

    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
        echo -e "${YELLOW}Install with: npm i -g vercel${NC}"
    else
        echo -e "${GREEN}✅ Vercel CLI found${NC}"
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

# Function to validate production build
validate_build() {
    echo -e "${BLUE}🏗️  Validating production build...${NC}"

    # Install dependencies
    echo -e "${CYAN}Installing dependencies...${NC}"
    npm ci

    # Run build
    echo -e "${CYAN}Building production bundle...${NC}"
    npm run build

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Production build successful${NC}"
    else
        echo -e "${RED}❌ Production build failed${NC}"
        exit 1
    fi

    echo ""
}

# Function to set up Supabase production
setup_supabase_production() {
    echo -e "${BLUE}🗄️  Setting up Supabase production...${NC}"

    # Check if project is already linked
    if [ ! -f ".supabase/config.toml" ]; then
        echo -e "${YELLOW}⚠️  Supabase project not linked${NC}"
        echo -e "${CYAN}Please run: supabase link --project-ref YOUR_PROJECT_REF${NC}"
        echo -e "${CYAN}Then re-run this script${NC}"
        return 1
    fi

    # Generate types for production
    echo -e "${CYAN}Generating TypeScript types...${NC}"
    supabase gen types typescript --linked > src/types/supabase.ts

    # Display migration status
    echo -e "${CYAN}Checking migration status...${NC}"
    supabase db diff --linked

    echo -e "${GREEN}✅ Supabase production ready${NC}"
    echo ""
}

# Function to prepare environment variables
prepare_env_vars() {
    echo -e "${BLUE}🔧 Environment variables checklist...${NC}"

    echo -e "${CYAN}Required production environment variables:${NC}"
    echo -e "  ${YELLOW}NEXT_PUBLIC_SUPABASE_URL${NC}"
    echo -e "  ${YELLOW}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
    echo -e "  ${YELLOW}SUPABASE_SERVICE_ROLE_KEY${NC}"
    echo -e "  ${YELLOW}SENDGRID_API_KEY${NC}"
    echo -e "  ${YELLOW}MERCADO_PAGO_ACCESS_TOKEN${NC}"
    echo -e "  ${YELLOW}MERCADO_PAGO_PUBLIC_KEY${NC}"
    echo -e "  ${YELLOW}NEXT_PUBLIC_SITE_URL${NC}"

    echo ""
    echo -e "${CYAN}📝 Template available in: .env.production${NC}"
    echo -e "${CYAN}📖 Full setup guide in: DEPLOYMENT.md${NC}"
    echo ""
}

# Function to show deployment instructions
show_deployment_instructions() {
    echo -e "${PURPLE}🚀 Ready for deployment!${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo -e "  ${GREEN}1.${NC} Configure domain DNS for thousandaysof.love"
    echo -e "  ${GREEN}2.${NC} Set up Supabase production project"
    echo -e "  ${GREEN}3.${NC} Configure Vercel environment variables"
    echo -e "  ${GREEN}4.${NC} Deploy via GitHub or Vercel CLI"
    echo ""
    echo -e "${CYAN}Quick deployment commands:${NC}"
    echo -e "  ${YELLOW}git add . && git commit -m \"feat: production ready\"${NC}"
    echo -e "  ${YELLOW}git push origin main${NC}"
    echo -e "  ${YELLOW}vercel --prod${NC}"
    echo ""
}

# Main execution
main() {
    check_prerequisites
    validate_build
    setup_supabase_production
    prepare_env_vars
    show_deployment_instructions

    echo -e "${PURPLE}💕 Para Hel e Ylana - Mil dias de amor se tornando para sempre!${NC}"
    echo -e "${GREEN}🎊 Wedding website ready for November 11th, 2025!${NC}"
}

# Run main function
main "$@"