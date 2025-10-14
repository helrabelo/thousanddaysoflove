# Archived Services

## enhanced-guests.ts
**Archived:** 2025-10-14
**Reason:** Replaced by simpler `simple_guests` system and personalized `invitations` feature (Phase 1-4 implementation)

This 850-line service implemented a sophisticated guest management system with:
- Email validation and automation
- Family group management
- WhatsApp integration for Brazilian guests
- Invitation code system
- RSVP analytics and tracking
- Reminder email sequences

**Why archived:**
- The old `guests` table system was overly complex for wedding needs
- New `simple_guests` + `invitations` tables provide cleaner architecture
- Phase 1-4 implementation uses simplified approach
- No active imports found in codebase

**Tables used by this service (now deprecated):**
- `guests` (complex guest table)
- `family_groups` (family grouping)
- `invitation_codes` (old invitation system)
- `email_logs` (email tracking)
- `rsvp_analytics` (analytics)

**Current system:**
- `simple_guests` - Simplified guest management
- `invitations` - Personalized invitations with progress tracking
- See `docs/GUEST_EXPERIENCE_ROADMAP.md` for current implementation

**Preserved for reference:** Contains useful patterns for Brazilian wedding features (phone validation, WhatsApp integration, Portuguese greetings)
