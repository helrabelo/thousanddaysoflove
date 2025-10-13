#!/bin/bash
# Production Cleanup Script
# Prepares the Thousand Days of Love wedding website for production deployment

set -e  # Exit on error

echo "🧹 =========================================="
echo "   Production Cleanup Starting..."
echo "   =========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check for debug console.logs
echo "📝 Step 1: Checking for debug logs..."
DEBUG_LOGS=$(grep -r "console\.log\|console\.info\|console\.debug" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
if [ "$DEBUG_LOGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $DEBUG_LOGS debug console statements${NC}"
    echo "   Run: grep -r 'console\.' src --include='*.ts' --include='*.tsx' | grep -v 'console.error'"
else
    echo -e "${GREEN}✅ No debug logs found${NC}"
fi
echo ""

# 2. Check for TODO/FIXME comments
echo "📋 Step 2: Checking for TODO comments..."
TODO_COUNT=$(grep -r "TODO\|FIXME" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
if [ "$TODO_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $TODO_COUNT TODO/FIXME comments${NC}"
    echo "   Review: grep -r 'TODO\|FIXME' src --include='*.ts' --include='*.tsx'"
else
    echo -e "${GREEN}✅ No TODO comments found${NC}"
fi
echo ""

# 3. Check dependencies
echo "📦 Step 3: Checking dependencies..."
if command -v npx &> /dev/null; then
    echo "   Running depcheck..."
    npx depcheck --ignores="@types/*,eslint*,typescript,tailwindcss,@tailwindcss/*,playwright,@playwright/*,tsx,dotenv" 2>&1 | grep -E "Unused|Missing" || echo -e "${GREEN}✅ All dependencies are properly used${NC}"
else
    echo -e "${YELLOW}⚠️  npx not found, skipping depcheck${NC}"
fi
echo ""

# 4. Run linter
echo "🔍 Step 4: Running linter..."
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${YELLOW}⚠️  Linting warnings found${NC}"
    echo "   Run: npm run lint"
fi
echo ""

# 5. Type check
echo "✅ Step 5: Type checking..."
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${RED}❌ Type check failed${NC}"
    echo "   Run: npm run type-check"
    exit 1
fi
echo ""

# 6. Production build test
echo "🏗️  Step 6: Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Production build successful${NC}"
else
    echo -e "${RED}❌ Production build failed${NC}"
    echo "   Run: npm run build"
    exit 1
fi
echo ""

# 7. Check environment variables
echo "🔐 Step 7: Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local found${NC}"

    # Check for required variables
    REQUIRED_VARS=(
        "NEXT_PUBLIC_SANITY_PROJECT_ID"
        "NEXT_PUBLIC_SUPABASE_URL"
        "SUPABASE_SERVICE_ROLE_KEY"
        "ADMIN_PASSWORD"
        "GUEST_SHARED_PASSWORD"
    )

    MISSING_VARS=0
    for VAR in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "^$VAR=" .env.local; then
            echo -e "${RED}   ❌ Missing: $VAR${NC}"
            MISSING_VARS=$((MISSING_VARS + 1))
        fi
    done

    if [ $MISSING_VARS -eq 0 ]; then
        echo -e "${GREEN}   ✅ All required environment variables present${NC}"
    else
        echo -e "${YELLOW}   ⚠️  $MISSING_VARS required variables missing${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local not found (OK if using Vercel env vars)${NC}"
fi
echo ""

# 8. Security checks
echo "🔒 Step 8: Basic security checks..."
SECURITY_ISSUES=0

# Check for hardcoded secrets
if grep -r "sk_test\|pk_test\|SG\." src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "env\." > /dev/null; then
    echo -e "${RED}   ❌ Possible hardcoded secrets found in source code${NC}"
    SECURITY_ISSUES=$((SECURITY_ISSUES + 1))
fi

# Check admin password in .env.local
if [ -f ".env.local" ]; then
    if grep -q "ADMIN_PASSWORD=.*change_me\|ADMIN_PASSWORD=admin\|ADMIN_PASSWORD=password" .env.local; then
        echo -e "${RED}   ❌ Weak/default admin password detected${NC}"
        SECURITY_ISSUES=$((SECURITY_ISSUES + 1))
    fi
fi

if [ $SECURITY_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Basic security checks passed${NC}"
else
    echo -e "${YELLOW}⚠️  $SECURITY_ISSUES security warnings${NC}"
fi
echo ""

# Summary
echo "🎯 =========================================="
echo "   Cleanup Summary"
echo "   =========================================="
echo ""
echo "Debug logs:     $DEBUG_LOGS instances"
echo "TODO comments:  $TODO_COUNT instances"
echo "Build:          $([ -d ".next" ] && echo "✅ OK" || echo "❌ Failed")"
echo "Types:          ✅ OK"
echo ""

if [ "$DEBUG_LOGS" -gt 0 ] || [ "$TODO_COUNT" -gt 5 ]; then
    echo -e "${YELLOW}⚠️  RECOMMENDATION: Clean up debug logs and TODO comments before production${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review and remove console.log statements"
    echo "2. Address or remove TODO comments"
    echo "3. Test all critical flows (RSVP, payments, photos)"
    echo "4. Deploy to Vercel staging first"
    echo ""
fi

echo -e "${GREEN}✨ Production cleanup check complete!${NC}"
echo ""
echo "Ready for deployment? Run:"
echo "  vercel --prod"
echo ""
