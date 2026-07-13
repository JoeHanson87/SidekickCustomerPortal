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
-- Client proofs table
-- Stores which proofs each client can access.
-- Each row represents a client having access to a specific proof.
-- ---------------------------------------------------------------------------
create table if not exists public.client_proofs (
  client_id    text not null,
  proof_id     text not null,
  created_at   timestamptz default now(),
  primary key (client_id, proof_id),
  foreign key (client_id) references public.clients(id) on delete cascade
);

-- Seed client_proofs with all proofs for existing clients
-- This ensures all demo clients have access to all proofs in their enabled products
insert into public.client_proofs (client_id, proof_id)
values
  -- Client 1 gets all proofs from enabled products
  ('1', 'business-cards'),
  ('1', 'letterheads'),
  ('1', 'compliment-slips'),
  ('1', 'booklets'),
  ('1', 'catalogs'),
  ('1', 'folders'),
  ('1', 'branded-tees'),
  ('1', 'branded-hoodies'),
  ('1', 'branded-caps'),
  ('1', 'branded-bags'),
  ('1', 'branded-mugs'),
  ('1', 'a3-fliers'),
  ('1', 'a4-fliers'),
  ('1', 'dL-fliers'),
  ('1', 'branded-pens'),
  ('1', 'branded-notebooks'),
  ('1', 'branded-stickers'),
  -- Client 2 gets all proofs from enabled products
  ('2', 'business-cards'),
  ('2', 'letterheads'),
  ('2', 'compliment-slips'),
  ('2', 'booklets'),
  ('2', 'catalogs'),
  ('2', 'folders'),
  ('2', 'branded-tees'),
  ('2', 'branded-hoodies'),
  ('2', 'branded-caps'),
  ('2', 'branded-bags'),
  ('2', 'branded-mugs'),
  ('2', 'a3-fliers'),
  ('2', 'a4-fliers'),
  ('2', 'dL-fliers'),
  ('2', 'branded-pens'),
  ('2', 'branded-notebooks'),
  ('2', 'branded-stickers'),
  -- Client 3 gets all proofs from enabled products
  ('3', 'business-cards'),
  ('3', 'letterheads'),
  ('3', 'compliment-slips'),
  ('3', 'booklets'),
  ('3', 'catalogs'),
  ('3', 'folders'),
  ('3', 'branded-tees'),
  ('3', 'branded-hoodies'),
  ('3', 'branded-caps'),
  ('3', 'branded-bags'),
  ('3', 'branded-mugs'),
  ('3', 'a3-fliers'),
  ('3', 'a4-fliers'),
  ('3', 'dL-fliers'),
  ('3', 'branded-pens'),
  ('3', 'branded-notebooks'),
  ('3', 'branded-stickers')
on conflict (client_id, proof_id) do nothing;

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
