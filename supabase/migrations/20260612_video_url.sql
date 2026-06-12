-- Add an optional video link to diseases and remedies.
-- Stores any external URL (e.g. YouTube / Vimeo / a video page) shown
-- to users under the image as a "Watch video" button.
alter table public.diseases add column if not exists video_url text;
alter table public.remedies add column if not exists video_url text;
