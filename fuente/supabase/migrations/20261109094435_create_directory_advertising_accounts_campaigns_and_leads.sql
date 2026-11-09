create table public.directory_advertisers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  business_name text not null check (length(btrim(business_name)) between 1 and 160),
  contact_name text not null check (length(btrim(contact_name)) between 1 and 120),
  contact_email text not null check (position('@' in contact_email) > 1),
  contact_phone text,
  status text not null default 'active' check (status in ('active','paused','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table public.directory_ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null,
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  campaign_name text not null check (length(btrim(campaign_name)) between 1 and 160),
  creative_type text not null default 'image' check (creative_type in ('image','video')),
  headline text not null check (length(btrim(headline)) between 1 and 180),
  body text not null default '' check (length(body) <= 2000),
  image_url text,
  video_url text,
  destination_url text not null check (destination_url ~* '^https?://'),
  context_categories text[] not null check (cardinality(context_categories) between 1 and 10),
  coverage_regions text[] not null check (cardinality(coverage_regions) between 1 and 100),
  placements text[] not null default array['directory']::text[] check (cardinality(placements) between 1 and 4),
  starts_at timestamptz,
  ends_at timestamptz,
  budget_amount numeric(12,2) not null check (budget_amount > 0),
  budget_currency text not null default 'USD' check (budget_currency ~ '^[A-Z]{3}$'),
  review_status text not null default 'draft' check (review_status in ('draft','pending_review','approved','rejected','paused','ended')),
  payment_status text not null default 'not_started' check (payment_status in ('not_started','pending','paid','failed','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  constraint directory_ad_campaign_dates_check check (ends_at is null or starts_at is null or ends_at > starts_at),
  constraint directory_ad_campaign_owner_advertiser_fkey
    foreign key (advertiser_id, owner_id)
    references public.directory_advertisers(id, owner_id)
    on delete cascade
);

create table public.directory_ad_sales_leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null check (length(btrim(business_name)) between 1 and 160),
  contact_name text not null check (length(btrim(contact_name)) between 1 and 120),
  contact_email text not null check (position('@' in contact_email) > 1),
  contact_phone text,
  offer_summary text not null check (length(btrim(offer_summary)) between 1 and 2000),
  context_categories text[] not null check (cardinality(context_categories) between 1 and 10),
  coverage_regions text[] not null check (cardinality(coverage_regions) between 1 and 100),
  preferred_period text,
  budget_amount numeric(12,2) check (budget_amount is null or budget_amount >= 0),
  budget_currency text not null default 'USD' check (budget_currency ~ '^[A-Z]{3}$'),
  lead_status text not null default 'new' check (lead_status in ('new','assigned','contacted','quote_sent','converted','closed')),
  created_at timestamptz not null default now()
);

create table public.directory_ad_orders (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  payment_provider text,
  provider_order_reference text,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (payment_provider, provider_order_reference),
  constraint directory_ad_order_campaign_owner_fkey
    foreign key (campaign_id, owner_id)
    references public.directory_ad_campaigns(id, owner_id)
    on delete restrict
);

create index directory_advertisers_owner_idx on public.directory_advertisers(owner_id);
create index directory_ad_campaigns_owner_idx on public.directory_ad_campaigns(owner_id);
create index directory_ad_campaigns_live_idx on public.directory_ad_campaigns(review_status, payment_status, starts_at, ends_at);
create index directory_ad_campaigns_categories_gin on public.directory_ad_campaigns using gin(context_categories);
create index directory_ad_campaigns_regions_gin on public.directory_ad_campaigns using gin(coverage_regions);
create index directory_ad_sales_leads_status_created_idx on public.directory_ad_sales_leads(lead_status, created_at desc);
create index directory_ad_orders_owner_created_idx on public.directory_ad_orders(owner_id, created_at desc);

alter table public.directory_advertisers enable row level security;
alter table public.directory_ad_campaigns enable row level security;
alter table public.directory_ad_sales_leads enable row level security;
alter table public.directory_ad_orders enable row level security;

revoke all on table public.directory_advertisers, public.directory_ad_campaigns, public.directory_ad_sales_leads, public.directory_ad_orders from public, anon, authenticated;
grant all on table public.directory_advertisers, public.directory_ad_campaigns, public.directory_ad_sales_leads, public.directory_ad_orders to service_role;

grant select (id, owner_id, business_name, contact_name, contact_email, contact_phone, status, created_at, updated_at)
  on public.directory_advertisers to authenticated;
grant insert (business_name, contact_name, contact_email, contact_phone)
  on public.directory_advertisers to authenticated;
grant update (business_name, contact_name, contact_email, contact_phone)
  on public.directory_advertisers to authenticated;

grant select (id, advertiser_id, owner_id, campaign_name, creative_type, headline, body, image_url, video_url, destination_url, context_categories, coverage_regions, placements, starts_at, ends_at, budget_amount, budget_currency, review_status, payment_status, created_at, updated_at)
  on public.directory_ad_campaigns to authenticated;
grant insert (advertiser_id, campaign_name, creative_type, headline, body, image_url, video_url, destination_url, context_categories, coverage_regions, placements, starts_at, ends_at, budget_amount, budget_currency)
  on public.directory_ad_campaigns to authenticated;
grant update (advertiser_id, campaign_name, creative_type, headline, body, image_url, video_url, destination_url, context_categories, coverage_regions, placements, starts_at, ends_at, budget_amount, budget_currency)
  on public.directory_ad_campaigns to authenticated;

grant select (id, campaign_id, owner_id, amount, currency, payment_provider, provider_order_reference, payment_status, created_at, updated_at)
  on public.directory_ad_orders to authenticated;

create policy "Advertisers can read their own account"
  on public.directory_advertisers for select to authenticated
  using (owner_id = (select auth.uid()));
create policy "Advertisers can create their own account"
  on public.directory_advertisers for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "Advertisers can update their own account"
  on public.directory_advertisers for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Advertisers can read their own campaigns"
  on public.directory_ad_campaigns for select to authenticated
  using (owner_id = (select auth.uid()));
create policy "Advertisers can create draft campaigns"
  on public.directory_ad_campaigns for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and review_status = 'draft'
    and payment_status = 'not_started'
    and exists (
      select 1 from public.directory_advertisers a
      where a.id = directory_ad_campaigns.advertiser_id
        and a.owner_id = (select auth.uid())
        and a.status = 'active'
    )
  );
create policy "Advertisers can update their unsubmitted campaigns"
  on public.directory_ad_campaigns for update to authenticated
  using (
    owner_id = (select auth.uid())
    and review_status in ('draft','rejected')
    and payment_status in ('not_started','failed')
  )
  with check (
    owner_id = (select auth.uid())
    and review_status in ('draft','rejected')
    and payment_status in ('not_started','failed')
    and exists (
      select 1 from public.directory_advertisers a
      where a.id = directory_ad_campaigns.advertiser_id
        and a.owner_id = (select auth.uid())
        and a.status = 'active'
    )
  );

create policy "Advertisers can read their own payment orders"
  on public.directory_ad_orders for select to authenticated
  using (owner_id = (select auth.uid()));