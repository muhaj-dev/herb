export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Condition = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  icon_bg: string | null;
  badge_icon: string | null;
  image: string | null;
  safety_note: string | null;
  safety_link: string | null;
  category_id: string | null;
  remedy_count: number;
  created_at: string;
  updated_at: string;
};

export type Disease = {
  id: string;
  name: string;
  slug: string;
  scientific_name: string | null;
  category: string | null;
  description: string[];
  symptoms: string[];
  icon: string | null;
  hero_image: string | null;
  status: "Active" | "Draft" | "Archived";
  severity: number;
  severity_label: string | null;
  tags: string[];
  views_count: number;
  saves_count: number;
  is_featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Remedy = {
  id: string;
  name: string;
  scientific_name: string | null;
  slug: string;
  type: string | null;
  prep_time: string | null;
  description: string | null;
  short_description: string | null;
  image: string | null;
  dosage: string | null;
  duration: string | null;
  precautions: string | null;
  is_active: boolean;
  is_featured: boolean;
  ingredients: { name: string; quantity: string }[];
  preparation_steps: string | null;
  created_at: string;
  updated_at: string;
};

export type DiseaseRemedy = {
  disease_id: string;
  remedy_id: string;
  tag: string | null;
};

export type ConditionRemedy = {
  condition_id: string;
  remedy_id: string;
  display_order: number;
  icons: { icon: string; title: string }[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image: string | null;
  display_order: number;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  role: "Super Admin" | "Editor" | "Contributor" | "Viewer";
  status: "Active" | "Away" | "Inactive" | "Pending Invite";
  last_active_at: string | null;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string | null;
  action: string;
  target_name: string | null;
  target_type: string | null;
  icon: string | null;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  site_name: string;
  tagline: string | null;
  support_email: string | null;
  phone: string | null;
  emergency_contact: string | null;
  address: string | null;
  currency: string;
  timezone: string;
  updated_at: string;
};

// Supabase Database type for generic client
export type Database = {
  public: {
    Tables: {
      categories: { Row: Category; Insert: Partial<Category> & { name: string; slug: string }; Update: Partial<Category> };
      conditions: { Row: Condition; Insert: Partial<Condition> & { name: string; slug: string }; Update: Partial<Condition> };
      diseases: { Row: Disease; Insert: Partial<Disease> & { name: string; slug: string }; Update: Partial<Disease> };
      remedies: { Row: Remedy; Insert: Partial<Remedy> & { name: string; slug: string }; Update: Partial<Remedy> };
      disease_remedy: { Row: DiseaseRemedy; Insert: DiseaseRemedy; Update: Partial<DiseaseRemedy> };
      condition_remedy: { Row: ConditionRemedy; Insert: ConditionRemedy; Update: Partial<ConditionRemedy> };
      team_members: { Row: TeamMember; Insert: Partial<TeamMember> & { name: string }; Update: Partial<TeamMember> };
      profiles: { Row: Profile; Insert: Partial<Profile> & { name: string }; Update: Partial<Profile> };
      activity_log: { Row: ActivityLog; Insert: Partial<ActivityLog> & { action: string }; Update: Partial<ActivityLog> };
      site_settings: { Row: SiteSettings; Insert: Partial<SiteSettings>; Update: Partial<SiteSettings> };
    };
  };
};
