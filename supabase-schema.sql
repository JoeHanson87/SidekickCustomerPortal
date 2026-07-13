-- Sidekick Customer Portal — Supabase Schema
-- Run this SQL in your Supabase project's SQL editor (Database > SQL editor).

-- ---------------------------------------------------------------------------
-- Clients table
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id           text primary key,
  email        text not null unique,
  password     text not null,
  company      text not null,
  name         text not null,
  enabled_products jsonb not null default '[]'::jsonb,
  custom_pricing   jsonb not null default '{}'::jsonb,
  created_at   timestamptz default now()
);

-- Seed with demo clients (optional — delete if you want to start fresh)
insert into public.clients (id, email, password, company, name, enabled_products, custom_pricing)
values
  ('1', 'hello@acmecorp.com',       'demo123', 'Acme Corporation',     'Sarah Thompson', '["stationery","brochures","clothing","fliers","promotional"]'::jsonb, '{}'::jsonb),
  ('2', 'admin@techstart.co.uk',    'demo123', 'TechStart Ltd',        'James Carter',   '["stationery","brochures","clothing","fliers","promotional"]'::jsonb, '{}'::jsonb),
  ('3', 'info@bloomdesign.com',     'demo123', 'Bloom Design Studio',  'Emma Wilson',    '["stationery","brochures","clothing","fliers","promotional"]'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Proof images table
-- Stores one image per (category_id, proof_id) pair.
-- ---------------------------------------------------------------------------
create table if not exists public.proof_images (
  id           text primary key,
  category_id  text not null,
  proof_id     text not null,
  image_url    text not null,
  storage_path text not null,
  uploaded_at  timestamptz default now(),
  unique (category_id, proof_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security — disable for simplicity (all access via service role key)
-- Or enable RLS and add policies that match your auth strategy.
-- ---------------------------------------------------------------------------
alter table public.clients      disable row level security;
alter table public.proof_images disable row level security;

-- ---------------------------------------------------------------------------
-- Storage bucket for proof images
-- ---------------------------------------------------------------------------
-- Run this in your Supabase project:
--   Storage > New bucket > Name: "proof-images" > Public: ON
--
-- Or via the API:
--   insert into storage.buckets (id, name, public) values ('proof-images', 'proof-images', true);
