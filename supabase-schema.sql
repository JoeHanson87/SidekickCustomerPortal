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
-- Products table
-- Stores product categories and their proofs.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id           text primary key,
  name         text not null,
  description  text not null,
  tagline      text not null,
  color_from   text not null,
  color_to     text not null,
  proofs       jsonb not null default '[]'::jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Seed with default product catalogue
insert into public.products (id, name, description, tagline, color_from, color_to, proofs)
values
  ('stationery', 'Stationery', 'Professional branded stationery for your business', 'Business Cards · Letterheads · Comp Slips', '#4F46E5', '#7C3AED', '[{"id":"business-cards","name":"Business Cards","description":"Premium double-sided business cards with your branding","specifications":["85mm × 55mm","Double-sided","400gsm silk laminated","Full colour"],"priceTiers":[{"quantity":100,"unitPrice":0.25,"total":25},{"quantity":250,"unitPrice":0.18,"total":45},{"quantity":500,"unitPrice":0.15,"total":75},{"quantity":1000,"unitPrice":0.12,"total":120}]},{"id":"letterheads","name":"Letterheads","description":"A4 branded letterheads for professional correspondence","specifications":["A4 (210mm × 297mm)","Single-sided","120gsm uncoated","Full colour"],"priceTiers":[{"quantity":100,"unitPrice":0.35,"total":35},{"quantity":250,"unitPrice":0.26,"total":65},{"quantity":500,"unitPrice":0.22,"total":110},{"quantity":1000,"unitPrice":0.185,"total":185}]},{"id":"comp-slips","name":"Compliment Slips","description":"Branded compliment slips for your correspondence","specifications":["210mm × 99mm (1/3 A4)","Single-sided","120gsm uncoated","Full colour"],"priceTiers":[{"quantity":100,"unitPrice":0.20,"total":20},{"quantity":250,"unitPrice":0.152,"total":38},{"quantity":500,"unitPrice":0.12,"total":60},{"quantity":1000,"unitPrice":0.098,"total":98}]}]'::jsonb),
  ('brochures', 'Brochures', 'High-quality printed brochures showcasing your brand', 'A5 · A4 · DL Tri-fold', '#0EA5E9', '#0284C7', '[{"id":"a5-brochure","name":"A5 Brochure","description":"Compact 4-page A5 brochure, perfect for promotions","specifications":["A5 (148mm × 210mm)","4 pages","150gsm gloss","Full colour both sides"],"priceTiers":[{"quantity":100,"unitPrice":0.85,"total":85},{"quantity":250,"unitPrice":0.70,"total":175},{"quantity":500,"unitPrice":0.59,"total":295},{"quantity":1000,"unitPrice":0.48,"total":480}]},{"id":"a4-brochure","name":"A4 Brochure","description":"Full-size 4-page A4 brochure for detailed presentations","specifications":["A4 (210mm × 297mm)","4 pages","150gsm gloss","Full colour both sides"],"priceTiers":[{"quantity":100,"unitPrice":1.10,"total":110},{"quantity":250,"unitPrice":0.90,"total":225},{"quantity":500,"unitPrice":0.77,"total":385},{"quantity":1000,"unitPrice":0.64,"total":640}]},{"id":"dl-brochure","name":"DL Tri-fold","description":"Slim DL tri-fold brochure, ideal for racks and mailers","specifications":["DL (99mm × 210mm)","Tri-fold","150gsm gloss","Full colour both sides"],"priceTiers":[{"quantity":100,"unitPrice":0.75,"total":75},{"quantity":250,"unitPrice":0.60,"total":150},{"quantity":500,"unitPrice":0.50,"total":250},{"quantity":1000,"unitPrice":0.42,"total":420}]}]'::jsonb),
  ('clothing', 'Clothing', 'Branded clothing for your team and promotions', 'T-Shirts · Polo Shirts · Hoodies', '#10B981', '#059669', '[{"id":"t-shirts","name":"T-Shirts","description":"Classic branded t-shirts, embroidered or printed","specifications":["100% cotton","Sizes S–3XL","Front chest logo","Choice of colours"],"priceTiers":[{"quantity":10,"unitPrice":12.00,"total":120},{"quantity":25,"unitPrice":10.60,"total":265},{"quantity":50,"unitPrice":9.60,"total":480},{"quantity":100,"unitPrice":8.80,"total":880}]},{"id":"polo-shirts","name":"Polo Shirts","description":"Smart polo shirts with embroidered branding","specifications":["65% polyester / 35% cotton","Sizes S–3XL","Left chest embroidery","Choice of colours"],"priceTiers":[{"quantity":10,"unitPrice":15.00,"total":150},{"quantity":25,"unitPrice":13.60,"total":340},{"quantity":50,"unitPrice":12.40,"total":620},{"quantity":100,"unitPrice":11.50,"total":1150}]},{"id":"hoodies","name":"Hoodies","description":"Premium hoodies with embroidered or printed branding","specifications":["80% cotton / 20% polyester","Sizes S–3XL","Front chest logo","Choice of colours"],"priceTiers":[{"quantity":10,"unitPrice":20.00,"total":200},{"quantity":25,"unitPrice":18.40,"total":460},{"quantity":50,"unitPrice":17.20,"total":860},{"quantity":100,"unitPrice":15.80,"total":1580}]}]'::jsonb),
  ('fliers', 'Fliers & Leaflets', 'Eye-catching fliers and leaflets for marketing campaigns', 'A5 Fliers · A4 Leaflets · DL Inserts', '#F59E0B', '#D97706', '[{"id":"a5-flier","name":"A5 Flier","description":"Single-sided A5 fliers, perfect for events and promotions","specifications":["A5 (148mm × 210mm)","Single-sided","130gsm silk","Full colour"],"priceTiers":[{"quantity":500,"unitPrice":0.09,"total":45},{"quantity":1000,"unitPrice":0.065,"total":65},{"quantity":2500,"unitPrice":0.048,"total":120},{"quantity":5000,"unitPrice":0.039,"total":195}]},{"id":"a4-leaflet","name":"A4 Leaflet","description":"Double-sided A4 leaflets for detailed information","specifications":["A4 (210mm × 297mm)","Double-sided","130gsm silk","Full colour"],"priceTiers":[{"quantity":500,"unitPrice":0.13,"total":65},{"quantity":1000,"unitPrice":0.095,"total":95},{"quantity":2500,"unitPrice":0.07,"total":175},{"quantity":5000,"unitPrice":0.056,"total":280}]},{"id":"dl-insert","name":"DL Insert","description":"DL size inserts for direct mail and display racks","specifications":["DL (99mm × 210mm)","Double-sided","130gsm silk","Full colour"],"priceTiers":[{"quantity":500,"unitPrice":0.09,"total":45},{"quantity":1000,"unitPrice":0.065,"total":65},{"quantity":2500,"unitPrice":0.05,"total":125},{"quantity":5000,"unitPrice":0.038,"total":190}]}]'::jsonb),
  ('promotional', 'Promotional Products', 'Branded promotional items to make a lasting impression', 'Mugs · Pens · Tote Bags', '#EC4899', '#BE185D', '[{"id":"mugs","name":"Branded Mugs","description":"Classic white mugs with full-wrap or panel printing","specifications":["330ml ceramic mug","Dishwasher safe","Full wrap print","White or coloured"],"priceTiers":[{"quantity":10,"unitPrice":6.00,"total":60},{"quantity":25,"unitPrice":5.20,"total":130},{"quantity":50,"unitPrice":4.80,"total":240},{"quantity":100,"unitPrice":4.20,"total":420}]},{"id":"pens","name":"Branded Pens","description":"Smooth-writing ballpoint pens with printed branding","specifications":["Twist-action ballpoint","Blue ink","Barrel print","Matt or gloss barrel"],"priceTiers":[{"quantity":25,"unitPrice":1.40,"total":35},{"quantity":50,"unitPrice":1.20,"total":60},{"quantity":100,"unitPrice":1.05,"total":105},{"quantity":250,"unitPrice":0.88,"total":220}]},{"id":"tote-bags","name":"Tote Bags","description":"Eco-friendly cotton tote bags with your logo","specifications":["Natural cotton","38cm × 42cm","Screen printed logo","Long handles"],"priceTiers":[{"quantity":25,"unitPrice":4.80,"total":120},{"quantity":50,"unitPrice":4.20,"total":210},{"quantity":100,"unitPrice":3.60,"total":360},{"quantity":250,"unitPrice":2.96,"total":740}]}]'::jsonb)
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
-- Client proof images table
-- Links specific proof images to specific clients (each client can have custom images)
-- ---------------------------------------------------------------------------
create table if not exists public.client_proof_images (
  client_id      text not null,
  proof_image_id text not null,
  created_at     timestamptz default now(),
  primary key (client_id, proof_image_id),
  foreign key (client_id) references public.clients(id) on delete cascade,
  foreign key (proof_image_id) references public.proof_images(id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- Client-specific proof images table
-- Stores proof images that are specific to each client (uploaded per client, per proof)
-- ---------------------------------------------------------------------------
create table if not exists public.client_specific_proof_images (
  id           text primary key,
  client_id    text not null,
  category_id  text not null,
  proof_id     text not null,
  image_url    text not null,
  storage_path text not null,
  uploaded_at  timestamptz default now(),
  foreign key (client_id) references public.clients(id) on delete cascade,
  unique (client_id, category_id, proof_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security — disable for simplicity (all access via service role key)
-- Or enable RLS and add policies that match your auth strategy.
-- ---------------------------------------------------------------------------
alter table public.clients                           disable row level security;
alter table public.products                          disable row level security;
alter table public.proof_images                      disable row level security;
alter table public.client_proof_images               disable row level security;
alter table public.client_specific_proof_images      disable row level security;

-- ---------------------------------------------------------------------------
-- Storage bucket for proof images
-- ---------------------------------------------------------------------------
-- Run this in your Supabase project:
--   Storage > New bucket > Name: "proof-images" > Public: ON
--
-- Or via the API:
--   insert into storage.buckets (id, name, public) values ('proof-images', 'proof-images', true);
