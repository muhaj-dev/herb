-- Storage bucket for admin-uploaded media (images & videos).
-- Public read so URLs work in <img>/<video> tags without signed URLs;
-- writes are restricted to authenticated admins via RLS below.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  104857600, -- 100 MB; covers short clips and large images
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set public            = excluded.public,
    file_size_limit   = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Public can read (matches the bucket's public flag for object URLs).
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'media');

-- Only authenticated admins (Super Admin / Editor / Contributor) can write/delete.
drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('Super Admin', 'Editor', 'Contributor')
        and p.status in ('Active', 'Away')
    )
  );

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'media'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('Super Admin', 'Editor', 'Contributor')
        and p.status in ('Active', 'Away')
    )
  );

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'media'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('Super Admin', 'Editor', 'Contributor')
        and p.status in ('Active', 'Away')
    )
  );
