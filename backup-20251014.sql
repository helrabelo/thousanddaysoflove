


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."cleanup_expired_sessions"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM public.guest_sessions
    WHERE expires_at < NOW()
    RETURNING id
  )
  SELECT count(*) INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_sessions"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."cleanup_expired_sessions"() IS 'Run this periodically (e.g., daily) to clean up expired sessions: SELECT cleanup_expired_sessions();';



CREATE OR REPLACE FUNCTION "public"."create_family_group"("p_family_name" "text", "p_max_family_size" integer DEFAULT 4) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_group_id UUID;
    new_invitation_code TEXT;
BEGIN
    -- Generate unique invitation code
    new_invitation_code := generate_brazilian_invitation_code();

    -- Insert family group
    INSERT INTO public.family_groups (
        family_name,
        invitation_code,
        max_family_size
    ) VALUES (
        p_family_name,
        new_invitation_code,
        p_max_family_size
    ) RETURNING id INTO new_group_id;

    RETURN new_group_id;
END;
$$;


ALTER FUNCTION "public"."create_family_group"("p_family_name" "text", "p_max_family_size" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_guest_session"("p_guest_id" "uuid", "p_session_token" "text", "p_auth_method" "text", "p_duration_hours" integer DEFAULT 72, "p_user_agent" "text" DEFAULT NULL::"text", "p_ip_address" "inet" DEFAULT NULL::"inet") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
     DECLARE
       session_id UUID;
     BEGIN
       INSERT INTO public.guest_sessions (
         guest_id,
         session_token,
         auth_method,
         expires_at,
         user_agent,
         ip_address
       ) VALUES (
         p_guest_id,
         p_session_token,
         p_auth_method,
         NOW() + (p_duration_hours || ' hours')::INTERVAL,
         p_user_agent,
         p_ip_address
       ) RETURNING id INTO session_id;

       -- Update guest last_login
       UPDATE public.simple_guests
       SET last_login = NOW()
       WHERE id = p_guest_id;

       RETURN session_id;
     END;
     $$;


ALTER FUNCTION "public"."create_guest_session"("p_guest_id" "uuid", "p_session_token" "text", "p_auth_method" "text", "p_duration_hours" integer, "p_user_agent" "text", "p_ip_address" "inet") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_guest_session"("p_guest_id" "uuid", "p_session_token" "text", "p_auth_method" "text", "p_duration_hours" integer, "p_user_agent" "text", "p_ip_address" "inet") IS 'Create new authenticated guest session';



CREATE OR REPLACE FUNCTION "public"."create_guest_with_invitation"("p_name" "text") RETURNS TABLE("id" "uuid", "name" "text", "invitation_code" "text", "attending" boolean, "account_created" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
     DECLARE
       new_guest_id UUID;
       new_invitation_code TEXT;
     BEGIN
       -- Generate unique invitation code
       new_invitation_code := generate_guest_invitation_code();

       -- Insert new guest
       INSERT INTO public.simple_guests (name, invitation_code, attending, account_created)
       VALUES (p_name, new_invitation_code, true, true)
       RETURNING simple_guests.id INTO new_guest_id;

       -- Return guest details
       RETURN QUERY
       SELECT
         g.id,
         g.name,
         g.invitation_code,
         g.attending,
         g.account_created
       FROM public.simple_guests g
       WHERE g.id = new_guest_id;
     END;
     $$;


ALTER FUNCTION "public"."create_guest_with_invitation"("p_name" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_guest_with_invitation"("p_name" "text") IS 'Create a new guest with auto-generated invitation 
     code (used by shared password auth)';



CREATE OR REPLACE FUNCTION "public"."generate_brazilian_invitation_code"("code_prefix" "text" DEFAULT 'HY25'::"text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate code with Brazilian wedding format: HY25-XXXX
        new_code := code_prefix || '-' || upper(substring(md5(random()::text), 1, 4));

        -- Check if code exists in guests or family_groups or invitation_codes
        SELECT EXISTS (
            SELECT 1 FROM public.guests WHERE invitation_code = new_code
            UNION ALL
            SELECT 1 FROM public.family_groups WHERE invitation_code = new_code
            UNION ALL
            SELECT 1 FROM public.invitation_codes WHERE code = new_code
        ) INTO code_exists;

        -- Exit loop if code is unique
        EXIT WHEN NOT code_exists;
    END LOOP;

    RETURN new_code;
END;
$$;


ALTER FUNCTION "public"."generate_brazilian_invitation_code"("code_prefix" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_guest_invitation_code"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-character alphanumeric code (e.g., HY1000, AMOR25, etc.)
    code := upper(substring(md5(random()::text) from 1 for 6));

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.simple_guests WHERE invitation_code = code) INTO exists;

    -- If unique, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."generate_guest_invitation_code"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_invitation_code"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excluding confusing chars
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;

    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.guests WHERE invitation_code = result) LOOP
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
    END LOOP;

    RETURN result;
END;
$$;


ALTER FUNCTION "public"."generate_invitation_code"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."generate_invitation_code"() IS 'Gera código único de convite de 8 caracteres';



CREATE OR REPLACE FUNCTION "public"."generate_storage_path"("p_guest_id" "uuid", "p_upload_phase" "text", "p_filename" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
  -- Format: {guest_id}/{upload_phase}/{timestamp}_{filename}
  RETURN p_guest_id::TEXT || '/' || p_upload_phase || '/' ||
         extract(epoch from now())::bigint::text || '_' || p_filename;
END;
$$;


ALTER FUNCTION "public"."generate_storage_path"("p_guest_id" "uuid", "p_upload_phase" "text", "p_filename" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."generate_storage_path"("p_guest_id" "uuid", "p_upload_phase" "text", "p_filename" "text") IS 'Generate consistent storage path for guest uploads';



CREATE OR REPLACE FUNCTION "public"."get_admin_dashboard_data"() RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RETURN json_build_object('error', 'Unauthorized');
    END IF;

    SELECT json_build_object(
        'rsvp_stats', (SELECT row_to_json(r) FROM rsvp_stats r),
        'gift_stats', (
            SELECT json_agg(row_to_json(g))
            FROM gift_stats g
        ),
        'recent_rsvps', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'name', name,
                    'email', email,
                    'attending', attending,
                    'plus_one', plus_one,
                    'rsvp_date', rsvp_date
                )
            )
            FROM (
                SELECT id, name, email, attending, plus_one, rsvp_date
                FROM public.guests
                WHERE rsvp_date IS NOT NULL
                ORDER BY rsvp_date DESC
                LIMIT 10
            ) recent
        ),
        'recent_payments', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'amount', p.amount,
                    'status', p.status,
                    'payment_method', p.payment_method,
                    'gift_name', g.name,
                    'guest_name', gu.name,
                    'created_at', p.created_at
                )
            )
            FROM (
                SELECT p.*, g.name as gift_name, gu.name as guest_name
                FROM public.payments p
                JOIN public.gifts g ON p.gift_id = g.id
                LEFT JOIN public.guests gu ON p.guest_id = gu.id
                ORDER BY p.created_at DESC
                LIMIT 10
            ) p
        )
    ) INTO result;

    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_admin_dashboard_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_gift_availability"("gift_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    gift_info RECORD;
    availability JSON;
BEGIN
    SELECT
        quantity_desired,
        quantity_purchased,
        is_available,
        price
    INTO gift_info
    FROM public.gifts
    WHERE id = gift_id;

    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Gift not found');
    END IF;

    availability := json_build_object(
        'available', gift_info.is_available AND (gift_info.quantity_purchased < gift_info.quantity_desired),
        'quantity_remaining', GREATEST(0, gift_info.quantity_desired - gift_info.quantity_purchased),
        'quantity_desired', gift_info.quantity_desired,
        'quantity_purchased', gift_info.quantity_purchased,
        'price', gift_info.price,
        'is_active', gift_info.is_available
    );

    RETURN availability;
END;
$$;


ALTER FUNCTION "public"."get_gift_availability"("gift_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_guest_rsvp_stats"() RETURNS TABLE("total_guests" integer, "confirmed_guests" integer, "declined_guests" integer, "pending_guests" integer, "total_with_plus_ones" integer, "confirmation_rate" numeric, "family_groups_count" integer, "individual_guests_count" integer, "invitations_sent" integer, "invitations_opened" integer, "reminder_emails_sent" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_guests,
        COUNT(CASE WHEN g.attending = true THEN 1 END)::INTEGER as confirmed_guests,
        COUNT(CASE WHEN g.attending = false THEN 1 END)::INTEGER as declined_guests,
        COUNT(CASE WHEN g.attending IS NULL THEN 1 END)::INTEGER as pending_guests,
        (COUNT(CASE WHEN g.attending = true THEN 1 END) +
         COUNT(CASE WHEN g.attending = true AND g.plus_one = true THEN 1 END))::INTEGER as total_with_plus_ones,
        CASE
            WHEN COUNT(*) > 0 THEN
                ROUND((COUNT(CASE WHEN g.attending IS NOT NULL THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
            ELSE 0
        END as confirmation_rate,
        COUNT(DISTINCT g.family_group_id)::INTEGER as family_groups_count,
        COUNT(CASE WHEN g.guest_type = 'individual' THEN 1 END)::INTEGER as individual_guests_count,
        COUNT(CASE WHEN g.invitation_sent_date IS NOT NULL THEN 1 END)::INTEGER as invitations_sent,
        COUNT(CASE WHEN g.invitation_opened_date IS NOT NULL THEN 1 END)::INTEGER as invitations_opened,
        SUM(g.rsvp_reminder_count)::INTEGER as reminder_emails_sent
    FROM public.guests g;
END;
$$;


ALTER FUNCTION "public"."get_guest_rsvp_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_photo_public_url"("p_storage_path" "text", "p_bucket" "text" DEFAULT 'wedding-photos'::"text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
  supabase_url TEXT;
BEGIN
  -- Get Supabase URL from environment (this will be set in the app)
  -- Format: https://{project_ref}.supabase.co/storage/v1/object/public/{bucket}/{path}
  -- This is a placeholder - actual URL construction happens in app code
  RETURN 'storage/' || p_bucket || '/' || p_storage_path;
END;
$$;


ALTER FUNCTION "public"."get_photo_public_url"("p_storage_path" "text", "p_bucket" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_photo_public_url"("p_storage_path" "text", "p_bucket" "text") IS 'Get public URL for storage path (used in app layer)';



CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'email' = 'hel@thousanddaysoflove.com' OR
        auth.jwt() ->> 'role' = 'admin' OR
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_admin"() IS 'Verifica se o usuário atual é administrador do casamento';



CREATE OR REPLACE FUNCTION "public"."migrate_photos_to_storage"() RETURNS TABLE("photo_id" "uuid", "old_path" "text", "new_storage_path" "text", "migration_status" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- This function is a placeholder for migration tracking
  -- Actual file migration happens in application code
  RETURN QUERY
  SELECT
    id as photo_id,
    storage_path as old_path,
    storage_path as new_storage_path,
    'pending'::TEXT as migration_status
  FROM public.guest_photos
  WHERE storage_path IS NOT NULL;
END;
$$;


ALTER FUNCTION "public"."migrate_photos_to_storage"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."migrate_photos_to_storage"() IS 'Helper function to track photo migration status';



CREATE OR REPLACE FUNCTION "public"."refresh_gallery_stats"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.gallery_stats;
END;
$$;


ALTER FUNCTION "public"."refresh_gallery_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_invitation_code"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.invitation_code IS NULL OR NEW.invitation_code = '' THEN
        NEW.invitation_code := generate_invitation_code();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_invitation_code"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_rsvp_event"("p_guest_id" "uuid", "p_event_type" "text", "p_event_data" "jsonb" DEFAULT '{}'::"jsonb", "p_user_agent" "text" DEFAULT NULL::"text", "p_ip_address" "text" DEFAULT NULL::"text", "p_referrer" "text" DEFAULT NULL::"text", "p_session_id" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_event_id UUID;
BEGIN
    INSERT INTO public.rsvp_analytics (
        guest_id,
        event_type,
        event_data,
        user_agent,
        ip_address,
        referrer,
        session_id
    ) VALUES (
        p_guest_id,
        p_event_type,
        p_event_data,
        p_user_agent,
        p_ip_address::INET,
        p_referrer,
        p_session_id
    ) RETURNING id INTO new_event_id;

    RETURN new_event_id;
END;
$$;


ALTER FUNCTION "public"."track_rsvp_event"("p_guest_id" "uuid", "p_event_type" "text", "p_event_data" "jsonb", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text", "p_session_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_message_like_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guest_messages
    SET like_count = like_count + 1
    WHERE id = NEW.message_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guest_messages
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.message_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_message_like_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_photo_comment_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.photo_id IS NOT NULL THEN
    UPDATE public.guest_photos
    SET comment_count = comment_count + 1
    WHERE id = NEW.photo_id;
  ELSIF TG_OP = 'DELETE' AND OLD.photo_id IS NOT NULL THEN
    UPDATE public.guest_photos
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_photo_comment_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_photo_like_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guest_photos
    SET like_count = like_count + 1
    WHERE id = NEW.photo_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guest_photos
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_photo_like_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_post_comments_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guest_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guest_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_post_comments_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_post_likes_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guest_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guest_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_post_likes_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_shared_password"("new_password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.wedding_auth_config
  SET
    shared_password_hash = extensions.crypt(new_password, extensions.gen_salt('bf')),
    updated_at = NOW();

  RETURN true;
END;
$$;


ALTER FUNCTION "public"."update_shared_password"("new_password" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_shared_password"("new_password" "text") IS 'Update the shared password (admin only)';



CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_brazilian_phone"("phone_number" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    -- Brazilian phone validation: +55 (XX) 9XXXX-XXXX or similar formats
    RETURN phone_number IS NULL OR
           phone_number ~ '^\+55\s?\(?\d{2}\)?\s?9?\d{4,5}-?\d{4}$';
END;
$_$;


ALTER FUNCTION "public"."validate_brazilian_phone"("phone_number" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."validate_brazilian_phone"("phone_number" "text") IS 'Valida formato de telefone brasileiro';



CREATE OR REPLACE FUNCTION "public"."verify_shared_password"("input_password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
     DECLARE
       stored_hash TEXT;
       config_enabled BOOLEAN;
     BEGIN
       SELECT shared_password_hash, shared_password_enabled
       INTO stored_hash, config_enabled
       FROM public.wedding_auth_config
       LIMIT 1;

       IF NOT config_enabled THEN
         RETURN false;
       END IF;

       RETURN stored_hash = extensions.crypt(input_password, stored_hash);
     END;
     $$;


ALTER FUNCTION "public"."verify_shared_password"("input_password" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."verify_shared_password"("input_password" "text") IS 'Verify guest-provided password against shared password';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."activity_feed" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "activity_type" "text" NOT NULL,
    "guest_id" "uuid",
    "guest_name" "text" NOT NULL,
    "target_type" "text",
    "target_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "activity_feed_activity_type_check" CHECK (("activity_type" = ANY (ARRAY['photo_uploaded'::"text", 'message_posted'::"text", 'photo_liked'::"text", 'message_liked'::"text", 'photo_commented'::"text", 'guest_rsvp'::"text"]))),
    CONSTRAINT "activity_feed_target_type_check" CHECK (("target_type" = ANY (ARRAY['photo'::"text", 'message'::"text", 'rsvp'::"text"])))
);


ALTER TABLE "public"."activity_feed" OWNER TO "postgres";


COMMENT ON TABLE "public"."activity_feed" IS 'Real-time activity feed for wedding day live updates';



COMMENT ON COLUMN "public"."activity_feed"."metadata" IS 'JSONB data with activity-specific information';



CREATE TABLE IF NOT EXISTS "public"."email_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_id" "uuid" NOT NULL,
    "email_type" character varying(50) NOT NULL,
    "subject" character varying(255) NOT NULL,
    "template_name" character varying(100),
    "sent_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "delivery_status" character varying(20) DEFAULT 'sent'::character varying,
    "sendgrid_message_id" character varying(255),
    "error_message" "text",
    "opened_date" timestamp with time zone,
    "clicked_date" timestamp with time zone,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "email_logs_delivery_status_check" CHECK ((("delivery_status")::"text" = ANY ((ARRAY['sent'::character varying, 'delivered'::character varying, 'bounced'::character varying, 'failed'::character varying, 'opened'::character varying, 'clicked'::character varying])::"text"[])))
);


ALTER TABLE "public"."email_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."email_logs" IS 'Log de emails enviados para rastreamento de entrega';



COMMENT ON COLUMN "public"."email_logs"."email_type" IS 'Tipo de email: convite, lembrete, confirmação, agradecimento';



CREATE TABLE IF NOT EXISTS "public"."family_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "family_name" character varying(255) NOT NULL,
    "family_head_guest_id" "uuid",
    "invitation_code" character varying(10) NOT NULL,
    "max_family_size" integer DEFAULT 4,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."family_groups" OWNER TO "postgres";


COMMENT ON TABLE "public"."family_groups" IS 'Grupos familiares para convites em família';



CREATE TABLE IF NOT EXISTS "public"."guest_photos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_id" "uuid",
    "guest_name" "text" NOT NULL,
    "title" "text",
    "caption" "text",
    "upload_phase" "text" NOT NULL,
    "uploaded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "moderation_status" "text" DEFAULT 'pending'::"text",
    "moderated_at" timestamp with time zone,
    "moderated_by" "text",
    "rejection_reason" "text",
    "view_count" integer DEFAULT 0,
    "like_count" integer DEFAULT 0,
    "comment_count" integer DEFAULT 0,
    "is_featured" boolean DEFAULT false,
    "is_deleted" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "original_filename" "text",
    "file_size_bytes" integer,
    "storage_path" "text",
    "thumbnail_path" "text",
    "mime_type" "text",
    "width" integer,
    "height" integer,
    "storage_bucket" "text" DEFAULT 'wedding-photos'::"text" NOT NULL,
    "optimized_path" "text",
    "is_video" boolean DEFAULT false NOT NULL,
    "video_duration_seconds" integer,
    "video_thumbnail_path" "text",
    CONSTRAINT "guest_photos_caption_check" CHECK (("char_length"("caption") <= 500)),
    CONSTRAINT "guest_photos_comment_count_check" CHECK (("comment_count" >= 0)),
    CONSTRAINT "guest_photos_like_count_check" CHECK (("like_count" >= 0)),
    CONSTRAINT "guest_photos_mime_type_check" CHECK (("mime_type" = ANY (ARRAY['image/jpeg'::"text", 'image/png'::"text", 'image/webp'::"text", 'image/heic'::"text", 'image/heif'::"text", 'video/mp4'::"text", 'video/quicktime'::"text", 'video/webm'::"text"]))),
    CONSTRAINT "guest_photos_moderation_status_check" CHECK (("moderation_status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"]))),
    CONSTRAINT "guest_photos_upload_phase_check" CHECK (("upload_phase" = ANY (ARRAY['before'::"text", 'during'::"text", 'after'::"text"]))),
    CONSTRAINT "guest_photos_view_count_check" CHECK (("view_count" >= 0))
);


ALTER TABLE "public"."guest_photos" OWNER TO "postgres";


COMMENT ON TABLE "public"."guest_photos" IS 'Guest-uploaded photos with moderation and engagement metrics';



COMMENT ON COLUMN "public"."guest_photos"."upload_phase" IS 'When photo was taken: before/during/after wedding';



COMMENT ON COLUMN "public"."guest_photos"."moderation_status" IS 'Content moderation status';



COMMENT ON COLUMN "public"."guest_photos"."storage_path" IS 'Supabase Storage path: {guest_id}/{upload_phase}/{filename}';



COMMENT ON COLUMN "public"."guest_photos"."storage_bucket" IS 'Supabase Storage bucket name (default: wedding-photos)';



COMMENT ON COLUMN "public"."guest_photos"."optimized_path" IS 'WebP optimized version storage path';



COMMENT ON COLUMN "public"."guest_photos"."is_video" IS 'Whether this is a video (true) or photo (false)';



COMMENT ON COLUMN "public"."guest_photos"."video_duration_seconds" IS 'Video duration in seconds (null for photos)';



COMMENT ON COLUMN "public"."guest_photos"."video_thumbnail_path" IS 'Generated video thumbnail storage path';



CREATE MATERIALIZED VIEW "public"."gallery_stats" AS
 SELECT "upload_phase",
    "count"(*) AS "photo_count",
    "sum"("like_count") AS "total_likes",
    "sum"("comment_count") AS "total_comments",
    ("avg"("like_count"))::numeric(10,2) AS "avg_likes_per_photo",
    "max"("uploaded_at") AS "last_upload"
   FROM "public"."guest_photos"
  WHERE (("moderation_status" = 'approved'::"text") AND ("is_deleted" = false))
  GROUP BY "upload_phase"
  WITH NO DATA;


ALTER MATERIALIZED VIEW "public"."gallery_stats" OWNER TO "postgres";


COMMENT ON MATERIALIZED VIEW "public"."gallery_stats" IS 'Aggregated gallery statistics refreshed periodically';



CREATE TABLE IF NOT EXISTS "public"."gifts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "image_url" "text",
    "registry_url" "text",
    "quantity_desired" integer DEFAULT 1 NOT NULL,
    "quantity_purchased" integer DEFAULT 0 NOT NULL,
    "is_available" boolean DEFAULT true NOT NULL,
    "category" character varying(100) NOT NULL,
    "priority" character varying(10) DEFAULT 'medium'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "check_quantity_purchased" CHECK (("quantity_purchased" <= "quantity_desired")),
    CONSTRAINT "gifts_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::"text"[])))
);


ALTER TABLE "public"."gifts" OWNER TO "postgres";


COMMENT ON TABLE "public"."gifts" IS 'Lista de presentes contém itens típicos de casamento brasileiro com preços em BRL';



COMMENT ON COLUMN "public"."gifts"."price" IS 'Preço em Real Brasileiro (BRL) com centavos';



CREATE OR REPLACE VIEW "public"."gift_stats" AS
 SELECT "category",
    "count"(*) AS "total_gifts",
    "sum"("quantity_desired") AS "total_quantity_desired",
    "sum"("quantity_purchased") AS "total_quantity_purchased",
    "sum"(("price" * ("quantity_purchased")::numeric)) AS "total_value_purchased",
    "sum"(("price" * ("quantity_desired")::numeric)) AS "total_value_desired",
    "round"(((("sum"("quantity_purchased"))::numeric / (NULLIF("sum"("quantity_desired"), 0))::numeric) * (100)::numeric), 2) AS "completion_percentage"
   FROM "public"."gifts"
  GROUP BY "category"
  ORDER BY ("round"(((("sum"("quantity_purchased"))::numeric / (NULLIF("sum"("quantity_desired"), 0))::numeric) * (100)::numeric), 2)) DESC;


ALTER VIEW "public"."gift_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guest_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_id" "uuid",
    "guest_name" "text" NOT NULL,
    "message" "text" NOT NULL,
    "message_type" "text" DEFAULT 'guestbook'::"text",
    "parent_message_id" "uuid",
    "photo_id" "uuid",
    "moderation_status" "text" DEFAULT 'pending'::"text",
    "moderated_at" timestamp with time zone,
    "moderated_by" "text",
    "rejection_reason" "text",
    "like_count" integer DEFAULT 0,
    "is_pinned" boolean DEFAULT false,
    "is_deleted" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "guest_messages_like_count_check" CHECK (("like_count" >= 0)),
    CONSTRAINT "guest_messages_message_check" CHECK ((("char_length"("message") >= 1) AND ("char_length"("message") <= 1000))),
    CONSTRAINT "guest_messages_message_type_check" CHECK (("message_type" = ANY (ARRAY['guestbook'::"text", 'photo_comment'::"text", 'well_wishes'::"text"]))),
    CONSTRAINT "guest_messages_moderation_status_check" CHECK (("moderation_status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."guest_messages" OWNER TO "postgres";


COMMENT ON TABLE "public"."guest_messages" IS 'Guest book messages and photo comments with moderation';



COMMENT ON COLUMN "public"."guest_messages"."message_type" IS 'Type of message: guestbook entry, photo comment, or well wishes';



CREATE TABLE IF NOT EXISTS "public"."guest_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_id" "uuid" NOT NULL,
    "session_token" "text" NOT NULL,
    "auth_method" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "is_active" boolean DEFAULT true,
    "user_agent" "text",
    "ip_address" "inet",
    "uploads_count" integer DEFAULT 0,
    "messages_count" integer DEFAULT 0,
    "last_activity_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "guest_sessions_auth_method_check" CHECK (("auth_method" = ANY (ARRAY['invitation_code'::"text", 'shared_password'::"text", 'both'::"text"])))
);


ALTER TABLE "public"."guest_sessions" OWNER TO "postgres";


COMMENT ON TABLE "public"."guest_sessions" IS 'Active guest sessions with authentication tracking';



CREATE TABLE IF NOT EXISTS "public"."simple_guests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "phone" "text",
    "email" "text",
    "attending" boolean,
    "plus_ones" integer DEFAULT 0,
    "notes" "text",
    "confirmed_at" timestamp with time zone,
    "confirmed_by" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "dietary_restrictions" "text",
    "song_requests" "text",
    "special_message" "text",
    "invitation_code" "text" NOT NULL,
    "account_created" boolean DEFAULT false,
    "last_login" timestamp with time zone
);


ALTER TABLE "public"."simple_guests" OWNER TO "postgres";


COMMENT ON COLUMN "public"."simple_guests"."dietary_restrictions" IS 'Dietary restrictions or food allergies';



COMMENT ON COLUMN "public"."simple_guests"."song_requests" IS 'Song requests for the wedding playlist';



COMMENT ON COLUMN "public"."simple_guests"."special_message" IS 'Special message or wishes for the couple';



COMMENT ON COLUMN "public"."simple_guests"."invitation_code" IS 'Unique invitation code for guest authentication (e.g., HY1000)';



COMMENT ON COLUMN "public"."simple_guests"."account_created" IS 'Whether guest has created their account using invitation code';



COMMENT ON COLUMN "public"."simple_guests"."last_login" IS 'Last time guest logged in to the platform';



CREATE OR REPLACE VIEW "public"."guest_auth_status" AS
 SELECT "g"."id",
    "g"."name",
    "g"."invitation_code",
    "g"."account_created",
    "g"."last_login",
    "g"."attending",
    "count"(DISTINCT "s"."id") AS "active_sessions_count",
    "count"(DISTINCT "p"."id") AS "photos_uploaded",
    "count"(DISTINCT "m"."id") AS "messages_posted",
    COALESCE("sum"("p"."file_size_bytes"), (0)::bigint) AS "total_storage_bytes"
   FROM ((("public"."simple_guests" "g"
     LEFT JOIN "public"."guest_sessions" "s" ON ((("g"."id" = "s"."guest_id") AND ("s"."is_active" = true) AND ("s"."expires_at" > "now"()))))
     LEFT JOIN "public"."guest_photos" "p" ON ((("g"."id" = "p"."guest_id") AND ("p"."moderation_status" = 'approved'::"text"))))
     LEFT JOIN "public"."guest_messages" "m" ON ((("g"."id" = "m"."guest_id") AND ("m"."moderation_status" = 'approved'::"text"))))
  GROUP BY "g"."id", "g"."name", "g"."invitation_code", "g"."account_created", "g"."last_login", "g"."attending"
  ORDER BY "g"."last_login" DESC NULLS LAST;


ALTER VIEW "public"."guest_auth_status" OWNER TO "postgres";


COMMENT ON VIEW "public"."guest_auth_status" IS 'Overview of guest authentication and activity with storage usage';



CREATE TABLE IF NOT EXISTS "public"."guest_posts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "guest_session_id" "uuid",
    "guest_name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "post_type" "text" NOT NULL,
    "media_urls" "text"[],
    "status" "text" DEFAULT 'pending'::"text",
    "moderation_reason" "text",
    "moderated_at" timestamp with time zone,
    "moderated_by" "text",
    "likes_count" integer DEFAULT 0,
    "comments_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "guest_posts_post_type_check" CHECK (("post_type" = ANY (ARRAY['text'::"text", 'image'::"text", 'video'::"text", 'mixed'::"text"]))),
    CONSTRAINT "guest_posts_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."guest_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(320) NOT NULL,
    "phone" character varying(20),
    "attending" boolean,
    "dietary_restrictions" "text",
    "plus_one" boolean DEFAULT false,
    "plus_one_name" character varying(255),
    "invitation_code" character varying(10) NOT NULL,
    "rsvp_date" timestamp with time zone,
    "special_requests" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "family_group_id" "uuid",
    "invited_by" character varying(255),
    "invitation_sent_date" timestamp with time zone,
    "invitation_opened_date" timestamp with time zone,
    "rsvp_reminder_count" integer DEFAULT 0,
    "communication_preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "guest_type" character varying(20) DEFAULT 'individual'::character varying,
    "qr_code_url" "text",
    "last_email_sent_date" timestamp with time zone,
    "email_delivery_status" character varying(20) DEFAULT 'pending'::character varying,
    CONSTRAINT "check_plus_one_name" CHECK ((("plus_one" = false) OR ("plus_one" IS NULL) OR (("plus_one" = true) AND ("plus_one_name" IS NOT NULL) AND (TRIM(BOTH FROM "plus_one_name") <> ''::"text")))),
    CONSTRAINT "check_rsvp_date_when_decided" CHECK ((("attending" IS NULL) OR (("attending" IS NOT NULL) AND ("rsvp_date" IS NOT NULL)))),
    CONSTRAINT "guests_email_delivery_status_check" CHECK ((("email_delivery_status")::"text" = ANY ((ARRAY['pending'::character varying, 'sent'::character varying, 'delivered'::character varying, 'bounced'::character varying, 'failed'::character varying])::"text"[]))),
    CONSTRAINT "guests_guest_type_check" CHECK ((("guest_type")::"text" = ANY ((ARRAY['individual'::character varying, 'family_head'::character varying, 'family_member'::character varying])::"text"[]))),
    CONSTRAINT "valid_brazilian_phone" CHECK ("public"."validate_brazilian_phone"(("phone")::"text"))
);


ALTER TABLE "public"."guests" OWNER TO "postgres";


COMMENT ON TABLE "public"."guests" IS 'Dados de exemplo incluem formatos de telefone brasileiros e nomes brasileiros';



COMMENT ON COLUMN "public"."guests"."phone" IS 'Telefone brasileiro no formato +55 (11) 99999-9999';



COMMENT ON COLUMN "public"."guests"."invitation_code" IS 'Código único de convite de 10 caracteres';



COMMENT ON COLUMN "public"."guests"."family_group_id" IS 'ID do grupo familiar (se aplicável)';



COMMENT ON COLUMN "public"."guests"."communication_preferences" IS 'Preferências de comunicação em JSON';



COMMENT ON COLUMN "public"."guests"."guest_type" IS 'Tipo: individual, chefe de família, ou membro de família';



CREATE TABLE IF NOT EXISTS "public"."invitation_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" character varying(10) NOT NULL,
    "code_type" character varying(20) DEFAULT 'individual'::character varying,
    "guest_id" "uuid",
    "family_group_id" "uuid",
    "is_used" boolean DEFAULT false,
    "usage_count" integer DEFAULT 0,
    "max_usage" integer DEFAULT 1,
    "generated_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expiry_date" timestamp with time zone,
    "qr_code_data" "text",
    "qr_code_image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "check_code_assignment" CHECK (((("guest_id" IS NOT NULL) AND ("family_group_id" IS NULL)) OR (("guest_id" IS NULL) AND ("family_group_id" IS NOT NULL)))),
    CONSTRAINT "invitation_codes_code_type_check" CHECK ((("code_type")::"text" = ANY ((ARRAY['individual'::character varying, 'family'::character varying, 'plus_one'::character varying])::"text"[])))
);


ALTER TABLE "public"."invitation_codes" OWNER TO "postgres";


COMMENT ON TABLE "public"."invitation_codes" IS 'Códigos de convite avançados com QR codes e analytics';



COMMENT ON COLUMN "public"."invitation_codes"."qr_code_data" IS 'Dados do QR code para acesso rápido via celular';



CREATE TABLE IF NOT EXISTS "public"."invitations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "code" "text" NOT NULL,
    "guest_name" "text" NOT NULL,
    "guest_email" "text",
    "relationship_type" "text",
    "plus_one_allowed" boolean DEFAULT false,
    "custom_message" "text",
    "opened_at" timestamp with time zone,
    "open_count" integer DEFAULT 0,
    "rsvp_completed" boolean DEFAULT false,
    "gift_selected" boolean DEFAULT false,
    "photos_uploaded" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "invitations_relationship_type_check" CHECK (("relationship_type" = ANY (ARRAY['family'::"text", 'friend'::"text", 'colleague'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."message_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "message_id" "uuid" NOT NULL,
    "guest_id" "uuid",
    "guest_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."message_likes" OWNER TO "postgres";


COMMENT ON TABLE "public"."message_likes" IS 'Track which guests liked which messages';



CREATE TABLE IF NOT EXISTS "public"."moderation_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "priority" integer DEFAULT 0,
    "spam_score" numeric(3,2),
    "inappropriate_score" numeric(3,2),
    "flagged_reasons" "text"[],
    "reviewed_by" "text",
    "reviewed_at" timestamp with time zone,
    "review_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "moderation_queue_content_type_check" CHECK (("content_type" = ANY (ARRAY['photo'::"text", 'message'::"text"]))),
    CONSTRAINT "moderation_queue_inappropriate_score_check" CHECK ((("inappropriate_score" >= (0)::numeric) AND ("inappropriate_score" <= (1)::numeric))),
    CONSTRAINT "moderation_queue_spam_score_check" CHECK ((("spam_score" >= (0)::numeric) AND ("spam_score" <= (1)::numeric))),
    CONSTRAINT "moderation_queue_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_review'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."moderation_queue" OWNER TO "postgres";


COMMENT ON TABLE "public"."moderation_queue" IS 'Content moderation queue with auto-flagging and manual review';



COMMENT ON COLUMN "public"."moderation_queue"."priority" IS 'Higher priority items reviewed first';



CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gift_id" "uuid" NOT NULL,
    "guest_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "payment_method" character varying(20) NOT NULL,
    "mercado_pago_payment_id" character varying(255),
    "message" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "check_positive_amount" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "payments_payment_method_check" CHECK ((("payment_method")::"text" = ANY ((ARRAY['pix'::character varying, 'credit_card'::character varying, 'bank_transfer'::character varying])::"text"[]))),
    CONSTRAINT "payments_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying])::"text"[])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


COMMENT ON TABLE "public"."payments" IS 'Pagamentos de exemplo mostram diferentes métodos (PIX, cartão) populares no Brasil';



COMMENT ON COLUMN "public"."payments"."payment_method" IS 'Método de pagamento: PIX, cartão de crédito ou transferência bancária';



CREATE TABLE IF NOT EXISTS "public"."photo_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "photo_id" "uuid" NOT NULL,
    "guest_id" "uuid",
    "guest_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."photo_likes" OWNER TO "postgres";


COMMENT ON TABLE "public"."photo_likes" IS 'Track which guests liked which photos';



CREATE TABLE IF NOT EXISTS "public"."pinned_posts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "post_id" "uuid",
    "pinned_by" "text" NOT NULL,
    "pinned_at" timestamp with time zone DEFAULT "now"(),
    "display_order" integer DEFAULT 0
);


ALTER TABLE "public"."pinned_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_comments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "post_id" "uuid",
    "parent_comment_id" "uuid",
    "guest_session_id" "uuid",
    "guest_name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."post_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_reactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "post_id" "uuid",
    "guest_session_id" "uuid",
    "guest_name" "text",
    "reaction_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "post_reactions_reaction_type_check" CHECK (("reaction_type" = ANY (ARRAY['heart'::"text", 'clap'::"text", 'laugh'::"text", 'celebrate'::"text", 'love'::"text"])))
);


ALTER TABLE "public"."post_reactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rsvp_analytics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_id" "uuid",
    "event_type" character varying(50) NOT NULL,
    "event_data" "jsonb" DEFAULT '{}'::"jsonb",
    "user_agent" "text",
    "ip_address" "inet",
    "referrer" "text",
    "session_id" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rsvp_analytics" OWNER TO "postgres";


COMMENT ON TABLE "public"."rsvp_analytics" IS 'Analytics de engajamento dos convidados';



CREATE OR REPLACE VIEW "public"."rsvp_stats" AS
 SELECT "count"(*) AS "total_guests",
    "count"(*) FILTER (WHERE ("attending" = true)) AS "confirmed_attending",
    "count"(*) FILTER (WHERE ("attending" = false)) AS "confirmed_not_attending",
    "count"(*) FILTER (WHERE ("attending" IS NULL)) AS "pending_responses",
    "count"(*) FILTER (WHERE (("attending" = true) AND ("plus_one" = true))) AS "plus_ones",
    ("count"(*) FILTER (WHERE ("attending" = true)) + "count"(*) FILTER (WHERE (("attending" = true) AND ("plus_one" = true)))) AS "total_attendees",
    "round"(((("count"(*) FILTER (WHERE ("attending" IS NOT NULL)))::numeric / (NULLIF("count"(*), 0))::numeric) * (100)::numeric), 2) AS "response_rate"
   FROM "public"."guests";


ALTER VIEW "public"."rsvp_stats" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."storage_statistics" AS
 SELECT "storage_bucket",
    "upload_phase",
    "is_video",
    "count"(*) AS "file_count",
    "sum"("file_size_bytes") AS "total_bytes",
    ("avg"("file_size_bytes"))::bigint AS "avg_bytes",
    "min"("file_size_bytes") AS "min_bytes",
    "max"("file_size_bytes") AS "max_bytes",
    "count"(*) FILTER (WHERE ("moderation_status" = 'approved'::"text")) AS "approved_count",
    "count"(*) FILTER (WHERE ("moderation_status" = 'pending'::"text")) AS "pending_count",
    "count"(*) FILTER (WHERE ("moderation_status" = 'rejected'::"text")) AS "rejected_count"
   FROM "public"."guest_photos"
  WHERE ("is_deleted" = false)
  GROUP BY "storage_bucket", "upload_phase", "is_video"
  ORDER BY "storage_bucket", "upload_phase", "is_video";


ALTER VIEW "public"."storage_statistics" OWNER TO "postgres";


COMMENT ON VIEW "public"."storage_statistics" IS 'Storage usage statistics by bucket, phase, and media type';



CREATE TABLE IF NOT EXISTS "public"."upload_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_id" "uuid" NOT NULL,
    "session_token" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "uploads_count" integer DEFAULT 0,
    "uploads_size_bytes" bigint DEFAULT 0,
    "user_agent" "text",
    "ip_address" "inet",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_upload_at" timestamp with time zone,
    CONSTRAINT "upload_sessions_uploads_count_check" CHECK (("uploads_count" >= 0)),
    CONSTRAINT "upload_sessions_uploads_size_bytes_check" CHECK (("uploads_size_bytes" >= 0))
);


ALTER TABLE "public"."upload_sessions" OWNER TO "postgres";


COMMENT ON TABLE "public"."upload_sessions" IS 'Guest upload sessions for authentication and rate limiting';



CREATE TABLE IF NOT EXISTS "public"."wedding_auth_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "shared_password_hash" "text" NOT NULL,
    "shared_password_enabled" boolean DEFAULT true,
    "require_invitation_code" boolean DEFAULT true,
    "allow_password_only" boolean DEFAULT false,
    "session_duration_hours" integer DEFAULT 72,
    "max_uploads_per_guest" integer DEFAULT 50,
    "photo_upload_enabled" boolean DEFAULT true,
    "video_upload_enabled" boolean DEFAULT true,
    "message_board_enabled" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."wedding_auth_config" OWNER TO "postgres";


COMMENT ON TABLE "public"."wedding_auth_config" IS 'Authentication configuration for wedding guest access';



CREATE TABLE IF NOT EXISTS "public"."wedding_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wedding_date" "date" NOT NULL,
    "rsvp_deadline" "date" NOT NULL,
    "venue_name" character varying(255) NOT NULL,
    "venue_address" "text" NOT NULL,
    "ceremony_time" time without time zone NOT NULL,
    "reception_time" time without time zone NOT NULL,
    "dress_code" character varying(100),
    "max_guests" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."wedding_config" OWNER TO "postgres";


COMMENT ON TABLE "public"."wedding_config" IS 'Configurações do casamento (data, local, horários, etc.)';



CREATE TABLE IF NOT EXISTS "public"."wedding_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "wedding_date" "date" NOT NULL,
    "wedding_time" time without time zone NOT NULL,
    "wedding_timezone" character varying(50) DEFAULT 'America/Sao_Paulo'::character varying,
    "bride_name" character varying(100) NOT NULL,
    "groom_name" character varying(100) NOT NULL,
    "venue_name" character varying(200) NOT NULL,
    "venue_address" character varying(300) NOT NULL,
    "venue_city" character varying(100) NOT NULL,
    "venue_state" character varying(50) NOT NULL,
    "venue_zip" character varying(20),
    "venue_country" character varying(100) DEFAULT 'Brasil'::character varying,
    "venue_lat" numeric(10,8),
    "venue_lng" numeric(11,8),
    "google_maps_place_id" character varying(200),
    "reception_time" time without time zone,
    "dress_code" character varying(100),
    "dress_code_description" "text",
    "rsvp_deadline" "date",
    "guest_limit" integer,
    "is_published" boolean DEFAULT false
);


ALTER TABLE "public"."wedding_settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."wedding_settings" IS 'Single-row configuration table for wedding event details managed via /admin/wedding-settings';



COMMENT ON COLUMN "public"."wedding_settings"."wedding_date" IS 'Wedding ceremony date';



COMMENT ON COLUMN "public"."wedding_settings"."wedding_time" IS 'Wedding ceremony start time';



COMMENT ON COLUMN "public"."wedding_settings"."venue_lat" IS 'Latitude for Google Maps integration';



COMMENT ON COLUMN "public"."wedding_settings"."venue_lng" IS 'Longitude for Google Maps integration';



COMMENT ON COLUMN "public"."wedding_settings"."dress_code" IS 'Dress code title (e.g., "Traje Esporte Fino")';



ALTER TABLE ONLY "public"."activity_feed"
    ADD CONSTRAINT "activity_feed_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_logs"
    ADD CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."family_groups"
    ADD CONSTRAINT "family_groups_invitation_code_key" UNIQUE ("invitation_code");



ALTER TABLE ONLY "public"."family_groups"
    ADD CONSTRAINT "family_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gifts"
    ADD CONSTRAINT "gifts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_messages"
    ADD CONSTRAINT "guest_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_photos"
    ADD CONSTRAINT "guest_photos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_posts"
    ADD CONSTRAINT "guest_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_sessions"
    ADD CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_sessions"
    ADD CONSTRAINT "guest_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "guests_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "guests_invitation_code_key" UNIQUE ("invitation_code");



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "guests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitation_codes"
    ADD CONSTRAINT "invitation_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."invitation_codes"
    ADD CONSTRAINT "invitation_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."message_likes"
    ADD CONSTRAINT "message_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moderation_queue"
    ADD CONSTRAINT "moderation_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."photo_likes"
    ADD CONSTRAINT "photo_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pinned_posts"
    ADD CONSTRAINT "pinned_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pinned_posts"
    ADD CONSTRAINT "pinned_posts_post_id_key" UNIQUE ("post_id");



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_post_id_guest_session_id_key" UNIQUE ("post_id", "guest_session_id");



ALTER TABLE ONLY "public"."rsvp_analytics"
    ADD CONSTRAINT "rsvp_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."simple_guests"
    ADD CONSTRAINT "simple_guests_invitation_code_key" UNIQUE ("invitation_code");



ALTER TABLE ONLY "public"."simple_guests"
    ADD CONSTRAINT "simple_guests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."upload_sessions"
    ADD CONSTRAINT "upload_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."upload_sessions"
    ADD CONSTRAINT "upload_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."wedding_auth_config"
    ADD CONSTRAINT "wedding_auth_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wedding_config"
    ADD CONSTRAINT "wedding_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wedding_settings"
    ADD CONSTRAINT "wedding_settings_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_activity_feed_created_at" ON "public"."activity_feed" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_activity_feed_guest_id" ON "public"."activity_feed" USING "btree" ("guest_id");



CREATE INDEX "idx_activity_feed_metadata" ON "public"."activity_feed" USING "gin" ("metadata");



CREATE INDEX "idx_activity_feed_public" ON "public"."activity_feed" USING "btree" ("is_public", "created_at" DESC) WHERE ("is_public" = true);



CREATE INDEX "idx_activity_feed_type" ON "public"."activity_feed" USING "btree" ("activity_type");



CREATE INDEX "idx_email_logs_delivery_status" ON "public"."email_logs" USING "btree" ("delivery_status");



CREATE INDEX "idx_email_logs_email_type" ON "public"."email_logs" USING "btree" ("email_type");



CREATE INDEX "idx_email_logs_guest_id" ON "public"."email_logs" USING "btree" ("guest_id");



CREATE INDEX "idx_email_logs_sent_date" ON "public"."email_logs" USING "btree" ("sent_date");



CREATE INDEX "idx_family_groups_family_name" ON "public"."family_groups" USING "btree" ("family_name");



CREATE INDEX "idx_family_groups_invitation_code" ON "public"."family_groups" USING "btree" ("invitation_code");



CREATE INDEX "idx_gallery_stats_phase" ON "public"."gallery_stats" USING "btree" ("upload_phase");



CREATE INDEX "idx_gifts_category" ON "public"."gifts" USING "btree" ("category");



CREATE INDEX "idx_gifts_is_available" ON "public"."gifts" USING "btree" ("is_available");



CREATE INDEX "idx_gifts_price" ON "public"."gifts" USING "btree" ("price");



CREATE INDEX "idx_gifts_priority" ON "public"."gifts" USING "btree" ("priority");



CREATE INDEX "idx_guest_messages_active" ON "public"."guest_messages" USING "btree" ("moderation_status", "is_deleted") WHERE (("moderation_status" = 'approved'::"text") AND ("is_deleted" = false));



CREATE INDEX "idx_guest_messages_created_at" ON "public"."guest_messages" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_guest_messages_guest_id" ON "public"."guest_messages" USING "btree" ("guest_id");



CREATE INDEX "idx_guest_messages_moderation_status" ON "public"."guest_messages" USING "btree" ("moderation_status");



CREATE INDEX "idx_guest_messages_parent_id" ON "public"."guest_messages" USING "btree" ("parent_message_id");



CREATE INDEX "idx_guest_messages_photo_id" ON "public"."guest_messages" USING "btree" ("photo_id");



CREATE INDEX "idx_guest_messages_pinned" ON "public"."guest_messages" USING "btree" ("is_pinned", "created_at" DESC) WHERE ("is_pinned" = true);



CREATE INDEX "idx_guest_messages_search" ON "public"."guest_messages" USING "gin" ("to_tsvector"('"portuguese"'::"regconfig", "message"));



CREATE INDEX "idx_guest_photos_active" ON "public"."guest_photos" USING "btree" ("moderation_status", "is_deleted") WHERE (("moderation_status" = 'approved'::"text") AND ("is_deleted" = false));



CREATE INDEX "idx_guest_photos_approved_during" ON "public"."guest_photos" USING "btree" ("uploaded_at" DESC) WHERE (("moderation_status" = 'approved'::"text") AND ("upload_phase" = 'during'::"text") AND ("is_deleted" = false));



CREATE INDEX "idx_guest_photos_caption_search" ON "public"."guest_photos" USING "gin" ("to_tsvector"('"portuguese"'::"regconfig", COALESCE("caption", ''::"text")));



CREATE INDEX "idx_guest_photos_featured" ON "public"."guest_photos" USING "btree" ("is_featured") WHERE ("is_featured" = true);



CREATE INDEX "idx_guest_photos_guest_id" ON "public"."guest_photos" USING "btree" ("guest_id");



CREATE INDEX "idx_guest_photos_is_video" ON "public"."guest_photos" USING "btree" ("is_video");



CREATE INDEX "idx_guest_photos_moderation_status" ON "public"."guest_photos" USING "btree" ("moderation_status");



CREATE INDEX "idx_guest_photos_storage_bucket" ON "public"."guest_photos" USING "btree" ("storage_bucket");



CREATE INDEX "idx_guest_photos_storage_path" ON "public"."guest_photos" USING "btree" ("storage_path");



CREATE INDEX "idx_guest_photos_upload_phase" ON "public"."guest_photos" USING "btree" ("upload_phase");



CREATE INDEX "idx_guest_photos_uploaded_at" ON "public"."guest_photos" USING "btree" ("uploaded_at" DESC);



CREATE INDEX "idx_guest_posts_created_at" ON "public"."guest_posts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_guest_posts_status" ON "public"."guest_posts" USING "btree" ("status");



CREATE INDEX "idx_guest_sessions_active" ON "public"."guest_sessions" USING "btree" ("is_active", "expires_at") WHERE ("is_active" = true);



CREATE INDEX "idx_guest_sessions_expires_at" ON "public"."guest_sessions" USING "btree" ("expires_at");



CREATE INDEX "idx_guest_sessions_guest_id" ON "public"."guest_sessions" USING "btree" ("guest_id");



CREATE INDEX "idx_guest_sessions_token" ON "public"."guest_sessions" USING "btree" ("session_token");



CREATE INDEX "idx_guests_attending" ON "public"."guests" USING "btree" ("attending");



CREATE INDEX "idx_guests_email" ON "public"."guests" USING "btree" ("email");



CREATE INDEX "idx_guests_email_delivery_status" ON "public"."guests" USING "btree" ("email_delivery_status");



CREATE INDEX "idx_guests_family_group_id" ON "public"."guests" USING "btree" ("family_group_id");



CREATE INDEX "idx_guests_guest_type" ON "public"."guests" USING "btree" ("guest_type");



CREATE INDEX "idx_guests_invitation_code" ON "public"."guests" USING "btree" ("invitation_code");



CREATE INDEX "idx_guests_invitation_sent_date" ON "public"."guests" USING "btree" ("invitation_sent_date");



CREATE INDEX "idx_guests_rsvp_date" ON "public"."guests" USING "btree" ("rsvp_date");



CREATE INDEX "idx_invitation_codes_code" ON "public"."invitation_codes" USING "btree" ("code");



CREATE INDEX "idx_invitation_codes_family_group_id" ON "public"."invitation_codes" USING "btree" ("family_group_id");



CREATE INDEX "idx_invitation_codes_guest_id" ON "public"."invitation_codes" USING "btree" ("guest_id");



CREATE INDEX "idx_invitation_codes_is_used" ON "public"."invitation_codes" USING "btree" ("is_used");



CREATE INDEX "idx_invitations_code" ON "public"."invitations" USING "btree" ("code");



CREATE INDEX "idx_invitations_guest_name" ON "public"."invitations" USING "btree" ("guest_name");



CREATE INDEX "idx_message_likes_guest_id" ON "public"."message_likes" USING "btree" ("guest_id");



CREATE INDEX "idx_message_likes_message_id" ON "public"."message_likes" USING "btree" ("message_id");



CREATE UNIQUE INDEX "idx_message_likes_unique" ON "public"."message_likes" USING "btree" ("message_id", "guest_id");



CREATE INDEX "idx_moderation_queue_content" ON "public"."moderation_queue" USING "btree" ("content_type", "content_id");



CREATE INDEX "idx_moderation_queue_priority" ON "public"."moderation_queue" USING "btree" ("priority" DESC, "created_at");



CREATE INDEX "idx_moderation_queue_status" ON "public"."moderation_queue" USING "btree" ("status");



CREATE INDEX "idx_payments_gift_id" ON "public"."payments" USING "btree" ("gift_id");



CREATE INDEX "idx_payments_guest_id" ON "public"."payments" USING "btree" ("guest_id");



CREATE INDEX "idx_payments_mercado_pago_payment_id" ON "public"."payments" USING "btree" ("mercado_pago_payment_id");



CREATE INDEX "idx_payments_payment_method" ON "public"."payments" USING "btree" ("payment_method");



CREATE INDEX "idx_payments_status" ON "public"."payments" USING "btree" ("status");



CREATE INDEX "idx_photo_likes_guest_id" ON "public"."photo_likes" USING "btree" ("guest_id");



CREATE INDEX "idx_photo_likes_photo_id" ON "public"."photo_likes" USING "btree" ("photo_id");



CREATE UNIQUE INDEX "idx_photo_likes_unique" ON "public"."photo_likes" USING "btree" ("photo_id", "guest_id");



CREATE INDEX "idx_pinned_posts_display_order" ON "public"."pinned_posts" USING "btree" ("display_order");



CREATE INDEX "idx_post_comments_created_at" ON "public"."post_comments" USING "btree" ("created_at");



CREATE INDEX "idx_post_comments_post_id" ON "public"."post_comments" USING "btree" ("post_id");



CREATE INDEX "idx_post_reactions_post_id" ON "public"."post_reactions" USING "btree" ("post_id");



CREATE INDEX "idx_rsvp_analytics_created_at" ON "public"."rsvp_analytics" USING "btree" ("created_at");



CREATE INDEX "idx_rsvp_analytics_event_type" ON "public"."rsvp_analytics" USING "btree" ("event_type");



CREATE INDEX "idx_rsvp_analytics_guest_id" ON "public"."rsvp_analytics" USING "btree" ("guest_id");



CREATE INDEX "idx_simple_guests_invitation_code" ON "public"."simple_guests" USING "btree" ("invitation_code");



CREATE INDEX "idx_simple_guests_name" ON "public"."simple_guests" USING "gin" ("to_tsvector"('"portuguese"'::"regconfig", "name"));



CREATE INDEX "idx_upload_sessions_expires_at" ON "public"."upload_sessions" USING "btree" ("expires_at");



CREATE INDEX "idx_upload_sessions_guest_id" ON "public"."upload_sessions" USING "btree" ("guest_id");



CREATE INDEX "idx_upload_sessions_token" ON "public"."upload_sessions" USING "btree" ("session_token");



CREATE UNIQUE INDEX "idx_wedding_auth_config_singleton" ON "public"."wedding_auth_config" USING "btree" ((true));



CREATE INDEX "idx_wedding_settings_published" ON "public"."wedding_settings" USING "btree" ("is_published");



CREATE OR REPLACE TRIGGER "ensure_invitation_code" BEFORE INSERT ON "public"."guests" FOR EACH ROW EXECUTE FUNCTION "public"."set_invitation_code"();



CREATE OR REPLACE TRIGGER "update_comments_count_on_comment" AFTER INSERT OR DELETE ON "public"."post_comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_post_comments_count"();



CREATE OR REPLACE TRIGGER "update_family_groups_updated_at" BEFORE UPDATE ON "public"."family_groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_gifts_updated_at" BEFORE UPDATE ON "public"."gifts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_guest_messages_updated_at" BEFORE UPDATE ON "public"."guest_messages" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_guest_photos_updated_at" BEFORE UPDATE ON "public"."guest_photos" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_guest_posts_updated_at" BEFORE UPDATE ON "public"."guest_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_guests_updated_at" BEFORE UPDATE ON "public"."guests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_invitations_updated_at" BEFORE UPDATE ON "public"."invitations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_likes_count_on_reaction" AFTER INSERT OR DELETE ON "public"."post_reactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_post_likes_count"();



CREATE OR REPLACE TRIGGER "update_message_like_count_trigger" AFTER INSERT OR DELETE ON "public"."message_likes" FOR EACH ROW EXECUTE FUNCTION "public"."update_message_like_count"();



CREATE OR REPLACE TRIGGER "update_moderation_queue_updated_at" BEFORE UPDATE ON "public"."moderation_queue" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payments_updated_at" BEFORE UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_photo_comment_count_trigger" AFTER INSERT OR DELETE ON "public"."guest_messages" FOR EACH ROW EXECUTE FUNCTION "public"."update_photo_comment_count"();



CREATE OR REPLACE TRIGGER "update_photo_like_count_trigger" AFTER INSERT OR DELETE ON "public"."photo_likes" FOR EACH ROW EXECUTE FUNCTION "public"."update_photo_like_count"();



CREATE OR REPLACE TRIGGER "update_post_comments_updated_at" BEFORE UPDATE ON "public"."post_comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_wedding_config_updated_at" BEFORE UPDATE ON "public"."wedding_config" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."activity_feed"
    ADD CONSTRAINT "activity_feed_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."simple_guests"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."email_logs"
    ADD CONSTRAINT "email_logs_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."family_groups"
    ADD CONSTRAINT "family_groups_family_head_guest_id_fkey" FOREIGN KEY ("family_head_guest_id") REFERENCES "public"."guests"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "fk_guests_family_group" FOREIGN KEY ("family_group_id") REFERENCES "public"."family_groups"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."guest_messages"
    ADD CONSTRAINT "guest_messages_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."simple_guests"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."guest_messages"
    ADD CONSTRAINT "guest_messages_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "public"."guest_messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_messages"
    ADD CONSTRAINT "guest_messages_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "public"."guest_photos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_photos"
    ADD CONSTRAINT "guest_photos_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."simple_guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_sessions"
    ADD CONSTRAINT "guest_sessions_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."simple_guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitation_codes"
    ADD CONSTRAINT "invitation_codes_family_group_id_fkey" FOREIGN KEY ("family_group_id") REFERENCES "public"."family_groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitation_codes"
    ADD CONSTRAINT "invitation_codes_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."message_likes"
    ADD CONSTRAINT "message_likes_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."simple_guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."message_likes"
    ADD CONSTRAINT "message_likes_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."guest_messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_gift_id_fkey" FOREIGN KEY ("gift_id") REFERENCES "public"."gifts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."photo_likes"
    ADD CONSTRAINT "photo_likes_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."simple_guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."photo_likes"
    ADD CONSTRAINT "photo_likes_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "public"."guest_photos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pinned_posts"
    ADD CONSTRAINT "pinned_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."guest_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."post_comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."guest_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."guest_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsvp_analytics"
    ADD CONSTRAINT "rsvp_analytics_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."upload_sessions"
    ADD CONSTRAINT "upload_sessions_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."simple_guests"("id") ON DELETE CASCADE;



CREATE POLICY "Allow RSVP creation" ON "public"."guests" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow RSVP lookup" ON "public"."guests" FOR SELECT USING (true);



CREATE POLICY "Allow anonymous post creation" ON "public"."guest_posts" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow payment status updates" ON "public"."payments" FOR UPDATE USING (true);



CREATE POLICY "Allow viewing posts" ON "public"."guest_posts" FOR SELECT USING (true);



CREATE POLICY "Anyone can RSVP" ON "public"."simple_guests" FOR UPDATE USING (true);



CREATE POLICY "Anyone can create activities" ON "public"."activity_feed" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create sessions" ON "public"."guest_sessions" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create sessions" ON "public"."upload_sessions" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can delete messages" ON "public"."guest_messages" FOR DELETE USING (true);



CREATE POLICY "Anyone can delete their own photos" ON "public"."guest_photos" FOR DELETE USING (true);



CREATE POLICY "Anyone can insert guests" ON "public"."simple_guests" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can insert photos" ON "public"."guest_photos" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can like messages" ON "public"."message_likes" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can like photos" ON "public"."photo_likes" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can post messages" ON "public"."guest_messages" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can read invitations" ON "public"."invitations" FOR SELECT USING (true);



CREATE POLICY "Anyone can read invitations by code" ON "public"."invitations" FOR SELECT USING (true);



CREATE POLICY "Anyone can read published wedding settings" ON "public"."wedding_settings" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Anyone can search guests" ON "public"."simple_guests" FOR SELECT USING (true);



CREATE POLICY "Anyone can unlike messages" ON "public"."message_likes" FOR DELETE USING (true);



CREATE POLICY "Anyone can unlike photos" ON "public"."photo_likes" FOR DELETE USING (true);



CREATE POLICY "Anyone can update messages" ON "public"."guest_messages" FOR UPDATE USING (true);



CREATE POLICY "Anyone can update photos" ON "public"."guest_photos" FOR UPDATE USING (true);



CREATE POLICY "Anyone can update sessions" ON "public"."upload_sessions" FOR UPDATE USING (true);



CREATE POLICY "Anyone can view approved messages" ON "public"."guest_messages" FOR SELECT USING ((("moderation_status" = 'approved'::"text") AND ("is_deleted" = false)));



CREATE POLICY "Anyone can view approved photos" ON "public"."guest_photos" FOR SELECT USING ((("moderation_status" = 'approved'::"text") AND ("is_deleted" = false)));



CREATE POLICY "Anyone can view auth config" ON "public"."wedding_auth_config" FOR SELECT USING (true);



CREATE POLICY "Anyone can view comments on approved posts" ON "public"."post_comments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."guest_posts"
  WHERE (("guest_posts"."id" = "post_comments"."post_id") AND ("guest_posts"."status" = 'approved'::"text")))));



CREATE POLICY "Anyone can view likes" ON "public"."photo_likes" FOR SELECT USING (true);



CREATE POLICY "Anyone can view message likes" ON "public"."message_likes" FOR SELECT USING (true);



CREATE POLICY "Anyone can view pinned posts" ON "public"."pinned_posts" FOR SELECT USING (true);



CREATE POLICY "Anyone can view public activities" ON "public"."activity_feed" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Anyone can view reactions" ON "public"."post_reactions" FOR SELECT USING (true);



CREATE POLICY "Anyone can view sessions" ON "public"."upload_sessions" FOR SELECT USING (true);



CREATE POLICY "Authenticated guests can upload photos" ON "public"."guest_photos" FOR INSERT WITH CHECK (("guest_id" IN ( SELECT "guest_sessions"."guest_id"
   FROM "public"."guest_sessions"
  WHERE (("guest_sessions"."is_active" = true) AND ("guest_sessions"."expires_at" > "now"())))));



CREATE POLICY "Authenticated users can update wedding settings" ON "public"."wedding_settings" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable all for moderation queue" ON "public"."moderation_queue" USING (true);



CREATE POLICY "Everyone can read gifts" ON "public"."gifts" FOR SELECT USING (true);



COMMENT ON POLICY "Everyone can read gifts" ON "public"."gifts" IS 'Lista de presentes é pública para todos os visitantes';



CREATE POLICY "Everyone can read wedding config" ON "public"."wedding_config" FOR SELECT USING (true);



CREATE POLICY "Guests can create comments" ON "public"."post_comments" FOR INSERT WITH CHECK (true);



CREATE POLICY "Guests can delete own photos" ON "public"."guest_photos" FOR DELETE USING (("guest_id" IN ( SELECT "guest_sessions"."guest_id"
   FROM "public"."guest_sessions"
  WHERE (("guest_sessions"."is_active" = true) AND ("guest_sessions"."expires_at" > "now"())))));



CREATE POLICY "Guests can delete own sessions" ON "public"."guest_sessions" FOR DELETE USING (true);



CREATE POLICY "Guests can manage their own reactions" ON "public"."post_reactions" USING (true);



CREATE POLICY "Guests can read own data" ON "public"."guests" FOR SELECT USING (((("auth"."jwt"() ->> 'email'::"text") = ("email")::"text") OR (("auth"."jwt"() ->> 'invitation_code'::"text") = ("invitation_code")::"text")));



COMMENT ON POLICY "Guests can read own data" ON "public"."guests" IS 'Permite que convidados vejam seus próprios dados';



CREATE POLICY "Guests can update own RSVP" ON "public"."guests" FOR UPDATE USING (((("auth"."jwt"() ->> 'email'::"text") = ("email")::"text") OR (("auth"."jwt"() ->> 'invitation_code'::"text") = ("invitation_code")::"text")));



CREATE POLICY "Guests can update own photos" ON "public"."guest_photos" FOR UPDATE USING (("guest_id" IN ( SELECT "guest_sessions"."guest_id"
   FROM "public"."guest_sessions"
  WHERE (("guest_sessions"."is_active" = true) AND ("guest_sessions"."expires_at" > "now"())))));



CREATE POLICY "Guests can update own sessions" ON "public"."guest_sessions" FOR UPDATE USING (true);



CREATE POLICY "Guests can view own sessions" ON "public"."guest_sessions" FOR SELECT USING (true);



CREATE POLICY "Only admin can delete payments" ON "public"."payments" FOR DELETE USING (((("auth"."jwt"() ->> 'email'::"text") = 'hel@thousanddaysoflove.com'::"text") OR (("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Only admin can modify gifts" ON "public"."gifts" USING (((("auth"."jwt"() ->> 'email'::"text") = 'hel@thousanddaysoflove.com'::"text") OR (("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Only admin can modify wedding config" ON "public"."wedding_config" USING (((("auth"."jwt"() ->> 'email'::"text") = 'hel@thousanddaysoflove.com'::"text") OR (("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Only admins can update auth config" ON "public"."wedding_auth_config" FOR UPDATE USING (false);



CREATE POLICY "Service role can delete posts" ON "public"."guest_posts" FOR DELETE TO "service_role" USING (true);



CREATE POLICY "Service role can manage all comments" ON "public"."post_comments" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage invitations" ON "public"."invitations" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage pinned posts" ON "public"."pinned_posts" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can update posts" ON "public"."guest_posts" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Users can create payments" ON "public"."payments" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can read payment status" ON "public"."payments" FOR SELECT USING (true);



ALTER TABLE "public"."activity_feed" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gifts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_photos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."message_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."moderation_queue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."photo_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pinned_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_reactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."simple_guests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."upload_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wedding_auth_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wedding_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wedding_settings" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."activity_feed";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."guest_messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."guest_photos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."message_likes";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."photo_likes";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_family_group"("p_family_name" "text", "p_max_family_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."create_family_group"("p_family_name" "text", "p_max_family_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_family_group"("p_family_name" "text", "p_max_family_size" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."create_guest_session"("p_guest_id" "uuid", "p_session_token" "text", "p_auth_method" "text", "p_duration_hours" integer, "p_user_agent" "text", "p_ip_address" "inet") TO "anon";
GRANT ALL ON FUNCTION "public"."create_guest_session"("p_guest_id" "uuid", "p_session_token" "text", "p_auth_method" "text", "p_duration_hours" integer, "p_user_agent" "text", "p_ip_address" "inet") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_guest_session"("p_guest_id" "uuid", "p_session_token" "text", "p_auth_method" "text", "p_duration_hours" integer, "p_user_agent" "text", "p_ip_address" "inet") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_guest_with_invitation"("p_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_guest_with_invitation"("p_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_guest_with_invitation"("p_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_brazilian_invitation_code"("code_prefix" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_brazilian_invitation_code"("code_prefix" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_brazilian_invitation_code"("code_prefix" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_guest_invitation_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_guest_invitation_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_guest_invitation_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_invitation_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_invitation_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_invitation_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_storage_path"("p_guest_id" "uuid", "p_upload_phase" "text", "p_filename" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_storage_path"("p_guest_id" "uuid", "p_upload_phase" "text", "p_filename" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_storage_path"("p_guest_id" "uuid", "p_upload_phase" "text", "p_filename" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_admin_dashboard_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_admin_dashboard_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_admin_dashboard_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_gift_availability"("gift_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_gift_availability"("gift_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_gift_availability"("gift_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_guest_rsvp_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_guest_rsvp_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_guest_rsvp_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_photo_public_url"("p_storage_path" "text", "p_bucket" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_photo_public_url"("p_storage_path" "text", "p_bucket" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_photo_public_url"("p_storage_path" "text", "p_bucket" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_photos_to_storage"() TO "anon";
GRANT ALL ON FUNCTION "public"."migrate_photos_to_storage"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."migrate_photos_to_storage"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_gallery_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_gallery_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_gallery_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_invitation_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_invitation_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_invitation_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."track_rsvp_event"("p_guest_id" "uuid", "p_event_type" "text", "p_event_data" "jsonb", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text", "p_session_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."track_rsvp_event"("p_guest_id" "uuid", "p_event_type" "text", "p_event_data" "jsonb", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text", "p_session_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_rsvp_event"("p_guest_id" "uuid", "p_event_type" "text", "p_event_data" "jsonb", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text", "p_session_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_message_like_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_message_like_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_message_like_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_photo_comment_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_photo_comment_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_photo_comment_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_photo_like_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_photo_like_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_photo_like_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_post_comments_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_post_comments_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_post_comments_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_post_likes_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_post_likes_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_post_likes_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_shared_password"("new_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_shared_password"("new_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_shared_password"("new_password" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_brazilian_phone"("phone_number" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_brazilian_phone"("phone_number" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_brazilian_phone"("phone_number" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_shared_password"("input_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_shared_password"("input_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_shared_password"("input_password" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."activity_feed" TO "anon";
GRANT ALL ON TABLE "public"."activity_feed" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_feed" TO "service_role";



GRANT ALL ON TABLE "public"."email_logs" TO "anon";
GRANT ALL ON TABLE "public"."email_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."email_logs" TO "service_role";



GRANT ALL ON TABLE "public"."family_groups" TO "anon";
GRANT ALL ON TABLE "public"."family_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."family_groups" TO "service_role";



GRANT ALL ON TABLE "public"."guest_photos" TO "anon";
GRANT ALL ON TABLE "public"."guest_photos" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_photos" TO "service_role";



GRANT ALL ON TABLE "public"."gallery_stats" TO "anon";
GRANT ALL ON TABLE "public"."gallery_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."gallery_stats" TO "service_role";



GRANT ALL ON TABLE "public"."gifts" TO "anon";
GRANT ALL ON TABLE "public"."gifts" TO "authenticated";
GRANT ALL ON TABLE "public"."gifts" TO "service_role";



GRANT ALL ON TABLE "public"."gift_stats" TO "anon";
GRANT ALL ON TABLE "public"."gift_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."gift_stats" TO "service_role";



GRANT ALL ON TABLE "public"."guest_messages" TO "anon";
GRANT ALL ON TABLE "public"."guest_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_messages" TO "service_role";



GRANT ALL ON TABLE "public"."guest_sessions" TO "anon";
GRANT ALL ON TABLE "public"."guest_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."simple_guests" TO "anon";
GRANT ALL ON TABLE "public"."simple_guests" TO "authenticated";
GRANT ALL ON TABLE "public"."simple_guests" TO "service_role";



GRANT ALL ON TABLE "public"."guest_auth_status" TO "anon";
GRANT ALL ON TABLE "public"."guest_auth_status" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_auth_status" TO "service_role";



GRANT ALL ON TABLE "public"."guest_posts" TO "anon";
GRANT ALL ON TABLE "public"."guest_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_posts" TO "service_role";



GRANT ALL ON TABLE "public"."guests" TO "anon";
GRANT ALL ON TABLE "public"."guests" TO "authenticated";
GRANT ALL ON TABLE "public"."guests" TO "service_role";



GRANT ALL ON TABLE "public"."invitation_codes" TO "anon";
GRANT ALL ON TABLE "public"."invitation_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."invitation_codes" TO "service_role";



GRANT ALL ON TABLE "public"."invitations" TO "anon";
GRANT ALL ON TABLE "public"."invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."invitations" TO "service_role";



GRANT ALL ON TABLE "public"."message_likes" TO "anon";
GRANT ALL ON TABLE "public"."message_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."message_likes" TO "service_role";



GRANT ALL ON TABLE "public"."moderation_queue" TO "anon";
GRANT ALL ON TABLE "public"."moderation_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."moderation_queue" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."photo_likes" TO "anon";
GRANT ALL ON TABLE "public"."photo_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."photo_likes" TO "service_role";



GRANT ALL ON TABLE "public"."pinned_posts" TO "anon";
GRANT ALL ON TABLE "public"."pinned_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."pinned_posts" TO "service_role";



GRANT ALL ON TABLE "public"."post_comments" TO "anon";
GRANT ALL ON TABLE "public"."post_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."post_comments" TO "service_role";



GRANT ALL ON TABLE "public"."post_reactions" TO "anon";
GRANT ALL ON TABLE "public"."post_reactions" TO "authenticated";
GRANT ALL ON TABLE "public"."post_reactions" TO "service_role";



GRANT ALL ON TABLE "public"."rsvp_analytics" TO "anon";
GRANT ALL ON TABLE "public"."rsvp_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."rsvp_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."rsvp_stats" TO "anon";
GRANT ALL ON TABLE "public"."rsvp_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."rsvp_stats" TO "service_role";



GRANT ALL ON TABLE "public"."storage_statistics" TO "anon";
GRANT ALL ON TABLE "public"."storage_statistics" TO "authenticated";
GRANT ALL ON TABLE "public"."storage_statistics" TO "service_role";



GRANT ALL ON TABLE "public"."upload_sessions" TO "anon";
GRANT ALL ON TABLE "public"."upload_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."upload_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."wedding_auth_config" TO "anon";
GRANT ALL ON TABLE "public"."wedding_auth_config" TO "authenticated";
GRANT ALL ON TABLE "public"."wedding_auth_config" TO "service_role";



GRANT ALL ON TABLE "public"."wedding_config" TO "anon";
GRANT ALL ON TABLE "public"."wedding_config" TO "authenticated";
GRANT ALL ON TABLE "public"."wedding_config" TO "service_role";



GRANT ALL ON TABLE "public"."wedding_settings" TO "anon";
GRANT ALL ON TABLE "public"."wedding_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."wedding_settings" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
