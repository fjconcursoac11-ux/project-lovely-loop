-- Multi-career practice question bank, decoupled from any single student's own exam
-- history (that lives in question_bank, tied to Franc Denis's PF results). This table
-- holds real items from official Cebraspe exams across ALL police careers (PF, PRF,
-- PC-*, PM-*, DEPEN, Bombeiro), available to every student as practice material.
-- Every item is sourced from an official gabarito + prova PDF, never fabricated, and
-- legislation-based items are checked for currency (see currency_note) before insertion.

create table if not exists public.practice_questions (
  id uuid primary key default gen_random_uuid(),
  career text not null,
  contest_name text not null,
  contest_year text not null,
  exam_board text not null default 'CEBRASPE',
  item_number integer not null,
  discipline text not null,
  question_text text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text,
  is_annulled boolean not null default false,
  legal_reference text,
  currency_note text,
  source_url text,
  verified_at date not null,
  created_at timestamptz not null default now(),
  unique (career, contest_name, contest_year, item_number)
);

alter table public.practice_questions enable row level security;

create policy "Practice questions are publicly readable"
  on public.practice_questions for select
  to authenticated
  using (true);

create index if not exists practice_questions_career_idx on public.practice_questions (career, discipline);
