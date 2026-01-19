create extension if not exists pgcrypto;

create table if not exists admin_users (
  user_id uuid primary key,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists customer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  room_type text,
  summary text,
  details text,
  featured boolean not null default false,
  project_date date,
  testimonial text,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  storage_path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new',
  customer_name text not null,
  customer_email text,
  customer_phone text,
  address text,
  city text,
  county text,
  job_type text not null,
  job_details jsonb not null default '{}'::jsonb,
  preferred_times jsonb not null default '[]'::jsonb,
  estimated_low numeric,
  estimated_high numeric,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  preferred_contact text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  status text not null default 'requested',
  address text,
  city text,
  county text,
  job_type text not null,
  job_details jsonb not null default '{}'::jsonb,
  preferred_times jsonb not null default '[]'::jsonb,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  estimated_low numeric,
  estimated_high numeric,
  payment_method text not null default 'cash_app_or_cash',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists order_uploads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  user_id uuid not null,
  storage_path text not null,
  file_kind text not null,
  created_at timestamptz not null default now()
);

create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  user_id uuid not null,
  category text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  user_id uuid not null,
  rating int not null,
  display_name text not null,
  body text not null,
  status text not null default 'pending',
  verified boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists tip_intents (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  user_id uuid not null,
  amount numeric,
  method text not null,
  status text not null default 'recorded',
  created_at timestamptz not null default now()
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  unique (endpoint)
);

alter table admin_users enable row level security;
alter table customer_profiles enable row level security;
alter table site_content enable row level security;
alter table portfolio_projects enable row level security;
alter table portfolio_images enable row level security;
alter table quote_requests enable row level security;
alter table contact_messages enable row level security;
alter table orders enable row level security;
alter table order_uploads enable row level security;
alter table support_tickets enable row level security;
alter table reviews enable row level security;
alter table tip_intents enable row level security;
alter table push_subscriptions enable row level security;

create policy "public read site content" on site_content
  for select
  using (true);

create policy "admin manage site content" on site_content
  for all
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "public read portfolio projects" on portfolio_projects
  for select
  using (true);

create policy "public read portfolio images" on portfolio_images
  for select
  using (true);

create policy "admin manage portfolio projects" on portfolio_projects
  for all
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "admin manage portfolio images" on portfolio_images
  for all
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "public create quote request" on quote_requests
  for insert
  with check (true);

create policy "admin read quote requests" on quote_requests
  for select
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "admin update quote requests" on quote_requests
  for update
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "public create contact messages" on contact_messages
  for insert
  with check (true);

create policy "admin read contact messages" on contact_messages
  for select
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "customer manage own profile" on customer_profiles
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "admin read profiles" on customer_profiles
  for select
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "customer create order" on orders
  for insert
  with check (user_id = auth.uid());

create policy "customer read own orders" on orders
  for select
  using (user_id = auth.uid());

create policy "customer update own orders (limited)" on orders
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "admin manage all orders" on orders
  for all
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "customer manage own uploads" on order_uploads
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "admin read uploads" on order_uploads
  for select
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "customer create support tickets for own completed orders" on support_tickets
  for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from orders o
      where o.id = support_tickets.order_id
        and o.user_id = auth.uid()
        and o.status = 'completed'
    )
  );

create policy "customer read own support tickets" on support_tickets
  for select
  using (user_id = auth.uid());

create policy "admin manage support tickets" on support_tickets
  for all
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "public read approved reviews" on reviews
  for select
  using (status = 'approved');

create policy "customer create review for own completed order" on reviews
  for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from orders o
      where o.id = reviews.order_id
        and o.user_id = auth.uid()
        and o.status = 'completed'
    )
  );

create policy "customer read own reviews" on reviews
  for select
  using (user_id = auth.uid());

create policy "admin manage reviews" on reviews
  for all
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "customer record tip intent for own completed order" on tip_intents
  for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from orders o
      where o.id = tip_intents.order_id
        and o.user_id = auth.uid()
        and o.status = 'completed'
    )
  );

create policy "customer read own tip intents" on tip_intents
  for select
  using (user_id = auth.uid());

create policy "admin read tip intents" on tip_intents
  for select
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "public register push subscription" on push_subscriptions
  for insert
  with check (true);

create policy "admin read push subscriptions" on push_subscriptions
  for select
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()));

create policy "admin delete push subscriptions" on push_subscriptions
  for delete
  using (exists (select 1 from admin_users au where au.user_id = auth.uid()));

grant usage on schema public to anon, authenticated;

grant select on site_content to anon, authenticated;
grant select on portfolio_projects to anon, authenticated;
grant select on portfolio_images to anon, authenticated;
grant select on reviews to anon, authenticated;

grant insert on quote_requests to anon, authenticated;
grant insert on contact_messages to anon, authenticated;
grant insert on push_subscriptions to anon, authenticated;

grant select, insert, update, delete on customer_profiles to authenticated;
grant select, insert, update, delete on orders to authenticated;
grant select, insert, update, delete on order_uploads to authenticated;
grant select, insert, update, delete on support_tickets to authenticated;
grant select, insert, update, delete on reviews to authenticated;
grant select, insert, update, delete on tip_intents to authenticated;

insert into site_content (key, value)
values
  (
    'business.info',
    jsonb_build_object(
      'name', 'A&J Mounting',
      'tagline', 'Professional TV & wall-hanging installs in Fort Wayne',
      'serviceArea', jsonb_build_object('county', 'Allen County', 'city', 'Fort Wayne'),
      'differentiators', jsonb_build_array(
        'About 50% lower than the local average',
        'We bring our own tools and transportation',
        'Clean, careful installs with respect for your home'
      ),
      'services', jsonb_build_array(
        jsonb_build_object('title', 'TV Mounting', 'desc', 'Secure mounting for all sizes, with clean alignment.'),
        jsonb_build_object('title', 'Picture & Art Hanging', 'desc', 'Level, centered placement with the right anchors.'),
        jsonb_build_object('title', 'Wall Hangings', 'desc', 'Mirrors, shelves, and more (by request).')
      )
    )
  ),
  (
    'faq.items',
    jsonb_build_array(
      jsonb_build_object('q', 'What areas do you serve?', 'a', 'Allen County (Fort Wayne only).'),
      jsonb_build_object('q', 'Do you bring your own tools?', 'a', 'Yes, we bring our own tools and transportation.'),
      jsonb_build_object('q', 'How do payments work?', 'a', 'We accept Cash App or cash. Tips are always appreciated but never required.')
    )
  )
on conflict (key) do nothing;
