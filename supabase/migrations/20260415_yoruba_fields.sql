-- Add Yoruba-language fields across the platform.
-- App is focused on Yoruba medical tradition; these are the core cultural fields.
-- Defaults are empty strings so the migration works on existing rows; application-layer
-- validation enforces non-empty values on all new/updated records.

alter table public.diseases
  add column if not exists yoruba_name text not null default '',
  add column if not exists yoruba_description text not null default '';

alter table public.remedies
  add column if not exists yoruba_name text not null default '',
  add column if not exists yoruba_description text not null default '';

alter table public.conditions
  add column if not exists yoruba_name text not null default '',
  add column if not exists yoruba_description text not null default '';

alter table public.categories
  add column if not exists yoruba_name text not null default '';
