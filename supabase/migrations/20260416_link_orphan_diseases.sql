-- One-time helper: link any disease that isn't in the condition_diseases junction
-- to a default "fallback" condition. You then reassign them properly from the
-- admin UI (each disease now edits its condition list).
--
-- Before running: set :default_slug to the slug of an existing condition
-- that orphan diseases should be parked under. Example:
--
--   update public.conditions set slug = 'general-health' where slug = 'general-health';
--
-- Run this block in the Supabase SQL Editor.

do $$
declare
  fallback_id uuid;
begin
  -- Change this slug to the condition you want to use as the "unsorted bin".
  select id into fallback_id
  from public.conditions
  where slug = 'general-health'
  limit 1;

  if fallback_id is null then
    raise exception
      'No fallback condition found. Create a condition first (e.g. "General Health"), then rerun with its slug.';
  end if;

  insert into public.condition_diseases (condition_id, disease_id)
  select fallback_id, d.id
  from public.diseases d
  where not exists (
    select 1 from public.condition_diseases cd
    where cd.disease_id = d.id
  );
end $$;
