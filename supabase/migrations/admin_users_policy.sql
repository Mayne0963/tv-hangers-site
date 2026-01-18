create policy "read own admin row" on admin_users
  for select
  using (user_id = auth.uid());

grant select on admin_users to authenticated;

