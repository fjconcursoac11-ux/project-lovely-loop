-- Legislation reference arsenal: verified-at-source legal content for the study platform.
-- Every row is checked directly against planalto.gov.br before insertion (never against
-- secondhand summaries), tagged with the career/edital it comes from, and carries a
-- mnemonic + a common exam-board trap to help retention, per the project's standing rule:
-- never surface revoked/annulled/outdated legislation.

create table if not exists public.legislation_reference (
  id uuid primary key default gen_random_uuid(),
  career text not null default 'PF',
  contest_name text not null,
  contest_year text,
  category text not null,
  law_number text not null,
  law_title text not null,
  summary text not null,
  latest_update text,
  update_source_url text,
  mnemonic text,
  exam_trap text,
  status text not null default 'vigente' check (status in ('vigente', 'revogada', 'parcialmente_revogada')),
  replaces_law text,
  display_order integer not null default 0,
  verified_at date not null,
  created_at timestamptz not null default now()
);

alter table public.legislation_reference enable row level security;

create policy "Legislation reference is publicly readable"
  on public.legislation_reference for select
  to authenticated
  using (true);

create index if not exists legislation_reference_career_idx on public.legislation_reference (career, category, display_order);
