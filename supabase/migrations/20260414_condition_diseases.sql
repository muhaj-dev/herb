-- Many-to-many join table linking conditions to diseases.
-- A condition (e.g. "Cardiovascular Health") can group many diseases
-- (e.g. "Hypertension", "High Cholesterol"); a disease can belong to
-- several conditions if relevant.




create table if not exists public.condition_diseases (
  condition_id uuid not null references public.conditions(id) on delete cascade,
  disease_id  uuid not null references public.diseases(id)   on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (condition_id, disease_id)
);

create index if not exists condition_diseases_disease_idx
  on public.condition_diseases (disease_id);

alter table public.condition_diseases enable row level security;

-- Public read; writes restricted to admin roles via profiles.role
create policy "condition_diseases_read"
  on public.condition_diseases for select
  using (true);

create policy "condition_diseases_write_admin"
  on public.condition_diseases for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('Super Admin', 'Editor', 'Contributor')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('Super Admin', 'Editor', 'Contributor')
    )
  );
