-- ============================================================
-- DIGITAL AGENCY — Supabase SQL Schema (v2)
-- Run: DROP everything below, then execute in SQL Editor
-- ============================================================

-- ── CLEANUP OLD SCHEMA ──────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS service_applications CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES (extends Supabase auth.users)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
                  COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 2. SERVICES (all service types: web, mobile, proxy, courses, ui_ux)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  category      TEXT NOT NULL,          -- web_static | web_dynamic | web_fullstack | web_ecommerce | mobile_app | java_proxy | courses | ui_ux
  price_start   NUMERIC DEFAULT 0,
  price_end     NUMERIC DEFAULT 0,
  duration      TEXT,
  image_url     TEXT,
  icon_name     TEXT,                   -- Ionicons glyph name
  features      TEXT[] DEFAULT '{}',    -- bullet-point features
  tech_stack    TEXT[] DEFAULT '{}',    -- technology tags
  is_special    BOOLEAN DEFAULT false,  -- special gradient card
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 3. RECENT WORKS (portfolio items shown on home)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recent_works (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  category      TEXT NOT NULL,
  image_url     TEXT,
  description   TEXT,
  color_hex     TEXT DEFAULT '#004CD2',
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 4. TESTIMONIALS (client reviews)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  role          TEXT,
  avatar_url    TEXT,
  text          TEXT NOT NULL,
  rating        INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 5. COURSES (educational offerings)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL,        -- ui_ux | web_dev | mobile_app | specialized
  price           NUMERIC DEFAULT 0,
  duration        TEXT,
  students_count  TEXT,
  image_url       TEXT,
  icon_name       TEXT,
  grad_color_1    TEXT DEFAULT '#E8E0FF',
  grad_color_2    TEXT DEFAULT '#F0ECFF',
  is_special      BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 6. ROW-LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_works   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses        ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update only their own
CREATE POLICY "profiles_read_own"   ON profiles FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE  USING (auth.uid() = id);

-- Public content: everyone reads
CREATE POLICY "services_read_all"       ON services      FOR SELECT USING (true);
CREATE POLICY "recent_works_read_all"   ON recent_works  FOR SELECT USING (true);
CREATE POLICY "testimonials_read_all"   ON testimonials  FOR SELECT USING (true);
CREATE POLICY "courses_read_all"        ON courses       FOR SELECT USING (true);

-- ────────────────────────────────────────────────────────────
-- 7. SEED DATA
-- ────────────────────────────────────────────────────────────

-- Services
INSERT INTO services (title, description, category, price_start, price_end, duration, icon_name, image_url, features, tech_stack, is_special, sort_order) VALUES
  ('Landing Page & Portfolio',
   'Clean, fast static pages built for impact. Perfect for personal brands, portfolios, and launch pages.',
   'web_static', 14999, 24999, '5-7 Days', 'layers-outline',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDCaVWIxJdFOoOQWtk_o-NwxpH6KJSOXdVt0DKWVzGDUNxwYIX0EnYLGb-BYvS0vGrvcqVl7_izOUiEdLdgmU5vFRvuSEtQWI2IfZ7MW1K6pehW6DukSm0UzOvCgF8mY-BdUy39746Fzu6WQrYqeCCqZnRgn4PA2HNro2SzYYoO2Mc2ctTM3qN62l335-BWoNrlkztb4K1cwE5KDb_TDH67DHmjNzkERv7jYD5AGTTwQfVGHNrxDg11i-3c1dQsBnvhPqx02YqspH4',
   ARRAY['SEO-optimized', 'Mobile responsive', 'Fast loading', 'Custom design'],
   ARRAY['HTML/CSS', 'Tailwind', 'Next.js'], false, 1),

  ('Dynamic CMS Website',
   'Headless CMS-powered sites with instant content updates, blog integration, and admin dashboards.',
   'web_dynamic', 29999, 49999, '2-3 Weeks', 'server-outline',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuB45TuwA4-5bRXKDdXIgrL6N6OeObNi5nazGfJ35nXX4rYLgoENXqUucJD-uaxvHnCczoRYT8mHsr-jDlebJSfJvLQ2o-ApeTY_8_bqPTdVXAR2Gh6m8diWMojBkpNHZHjwF8yg6NdjeCqeAgYYBuckelP8ymVLcFgywicddXtDdsRx1vIZu8_6pVqypF9rgPzXA7iz27N2ZOMMnFsFZmWKwp9Ae3mspI6-hX3ZhmRxdwrrOX8lGHA6PEyIYU7auECW5qtoKHq_REk',
   ARRAY['Headless CMS', 'Admin dashboard', 'Blog integration', 'API endpoints'],
   ARRAY['React', 'Strapi', 'PostgreSQL'], false, 2),

  ('Full-Stack Web Application',
   'Scalable, high-performance web apps with custom backends, APIs, authentication, and real-time features.',
   'web_fullstack', 59999, 99999, '4-6 Weeks', 'code-slash-outline',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuB8Eqshq5ZPUDf6wnvTzmAWUVyvs8Dwq4SaBz9aeMG9huMvZRxww8fSeM22wgyvKM9A5-bJKXInfSjOKbQl0gE-3wWlDG-KX0sUbPTLemMGPTO0dDWo3AHLdi0qGrmEhBb-lSP2anWMcIUKBF6fpb06r7W3KnVnaMWnHL-iO_nc0qgU-vljJnGPD4VcptLX4jUhdw5nzI_h8fWWIpUXt-HbHnj1v3SVr7KMd-6sMjy4BEFjEP6jFvKcP67VXFxAT9_fO_VLML0Og6w',
   ARRAY['Custom backend', 'Auth system', 'Real-time features', 'Cloud deployment'],
   ARRAY['Node.js', 'React', 'PostgreSQL', 'AWS'], false, 3),

  ('E-Commerce Storefront',
   'Complete online stores with payment gateways, inventory management, and custom admin panels.',
   'web_ecommerce', 79999, 149999, '6-8 Weeks', 'cart-outline',
   NULL,
   ARRAY['Payment gateway', 'Inventory management', 'Order tracking', 'Admin panel'],
   ARRAY['Next.js', 'Stripe', 'Supabase', 'Tailwind'], true, 4),

  ('Mobile App Development',
   'Custom iOS & Android apps built with React Native / Expo. Full-cycle from design to deployment.',
   'mobile_app', 49999, 199999, '4-12 Weeks', 'phone-portrait-outline',
   NULL,
   ARRAY['Cross-platform', 'Native performance', 'Push notifications', 'App Store deployment'],
   ARRAY['React Native', 'Expo', 'Supabase', 'TypeScript'], false, 5),

  ('Java Proxy Interviews',
   'Secure your career milestone with discrete technical advocacy. Our experts represent your technical capabilities with precision globally.',
   'java_proxy', 15000, 35000, 'Per session', 'mic-outline',
   NULL,
   ARRAY['Confidential support', 'Expert representation', 'Technical depth', 'Global coverage'],
   ARRAY['Java', 'Spring Boot', 'Microservices', 'System Design'], false, 6),

  ('UI/UX Design',
   'Pixel-perfect interfaces with Figma prototypes, user research, and design systems.',
   'ui_ux', 9999, 49999, '1-4 Weeks', 'color-palette-outline',
   NULL,
   ARRAY['User research', 'Wireframing', 'Prototyping', 'Design systems'],
   ARRAY['Figma', 'Framer', 'Adobe XD'], false, 7);

-- Recent Works
INSERT INTO recent_works (title, category, description, color_hex, image_url, sort_order) VALUES
  ('Lumina Health',  'UI/UX Design',     'Health & wellness platform redesign',    '#7C3AED', NULL, 1),
  ('Etheric Labs',   'Web Development',  'SaaS dashboard and API architecture',    '#06B6D4', NULL, 2),
  ('Synthetix AI',   'Product Strategy', 'AI-powered analytics product launch',    '#F59E0B', NULL, 3);

-- Testimonials
INSERT INTO testimonials (name, role, text, rating, sort_order) VALUES
  ('Arjun Mehta',    'CTO, Lumina Health',    'Exceptional delivery. The team transformed our vision into a polished, scalable product in record time.', 5, 1),
  ('Priya Sharma',   'Founder, Etheric Labs', 'Their full-stack expertise is unmatched. Our platform handles 10x the traffic with zero downtime.',        5, 2),
  ('Rahul Verma',    'PM, Synthetix AI',      'From strategy to launch, every milestone was hit on time. A truly visionary team to work with.',          5, 3);

-- Courses
INSERT INTO courses (title, description, category, price, duration, students_count, icon_name, grad_color_1, grad_color_2, is_special, sort_order) VALUES
  ('Professional Product Design',
   'Master the end-to-end process of high-end digital product design from wireframing to prototyping.',
   'ui_ux', 499, '12 Weeks', '450+', 'color-palette-outline',
   '#E8E0FF', '#F0ECFF', false, 1),

  ('Modern Full-Stack Mastery',
   'Learn to build scalable, high-performance web applications using the latest industry frameworks.',
   'web_dev', 699, '16 Weeks', '320+', 'code-slash-outline',
   '#E0F0FF', '#ECF4FF', false, 2),

  ('Native iOS & Android Dev',
   'Create seamless, fluid mobile experiences using industry-standard cross-platform tools.',
   'mobile_app', 549, '10 Weeks', '210+', 'phone-portrait-outline',
   '#E0FFE8', '#ECFFF0', false, 3),

  ('Interview Success Blueprint',
   'Exclusive coaching on high-stakes interviews, soft skills, and technical presentation for senior roles.',
   'specialized', 299, '1-on-1', NULL, 'mic-outline',
   '#1B63FF', '#004CD2', true, 4);
