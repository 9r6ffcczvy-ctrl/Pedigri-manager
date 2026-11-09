create index if not exists directory_ad_campaigns_advertiser_owner_idx
  on public.directory_ad_campaigns(advertiser_id, owner_id);
create index if not exists directory_ad_orders_campaign_owner_idx
  on public.directory_ad_orders(campaign_id, owner_id);

create policy "Service role manages advertiser sales leads"
  on public.directory_ad_sales_leads
  for all to service_role
  using (true)
  with check (true);