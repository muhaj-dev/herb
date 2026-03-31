-- =============================================
-- HerbalWisdom Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Conditions (public browsing)
CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  icon_bg TEXT,
  badge_icon TEXT,
  image TEXT,
  safety_note TEXT,
  safety_link TEXT,
  category_id UUID REFERENCES categories(id),
  remedy_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Diseases (admin managed)
CREATE TABLE diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  scientific_name TEXT,
  category TEXT,
  description TEXT[] DEFAULT '{}',
  symptoms TEXT[] DEFAULT '{}',
  icon TEXT,
  hero_image TEXT,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Active','Draft','Archived')),
  severity INT DEFAULT 0 CHECK (severity BETWEEN 0 AND 100),
  severity_label TEXT,
  tags TEXT[] DEFAULT '{}',
  views_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Remedies
CREATE TABLE remedies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  slug TEXT NOT NULL UNIQUE,
  type TEXT,
  prep_time TEXT,
  description TEXT,
  short_description TEXT,
  image TEXT,
  dosage TEXT,
  duration TEXT,
  precautions TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  ingredients JSONB DEFAULT '[]',
  preparation_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Junction: Disease <-> Remedy
CREATE TABLE disease_remedy (
  disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
  remedy_id UUID REFERENCES remedies(id) ON DELETE CASCADE,
  tag TEXT,
  PRIMARY KEY (disease_id, remedy_id)
);

-- Junction: Condition <-> Remedy
CREATE TABLE condition_remedy (
  condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE,
  remedy_id UUID REFERENCES remedies(id) ON DELETE CASCADE,
  display_order INT DEFAULT 0,
  icons JSONB DEFAULT '[]',
  PRIMARY KEY (condition_id, remedy_id)
);

-- Team Members (about page)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'Viewer' CHECK (role IN ('Super Admin','Editor','Contributor','Viewer')),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active','Away','Inactive','Pending Invite')),
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_name TEXT,
  target_type TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings (singleton)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'HerbalWisdom',
  tagline TEXT DEFAULT 'Ancient Remedies, Modern Wellness',
  support_email TEXT,
  phone TEXT,
  emergency_contact TEXT,
  address TEXT,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/Los_Angeles',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- =============================================
-- RLS Policies (open for now — no auth)
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_remedy ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_remedy ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON conditions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON diseases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON remedies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON disease_remedy FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON condition_remedy FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON conditions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON diseases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON remedies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
