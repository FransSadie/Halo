insert into public.profiles (id, first_name, last_name, phone, email)
values ('0d19c7c4-6363-4eb5-8c8f-3ce54a2eac5b', 'Martha', 'Dlamini', '+27 82 111 2222', 'martha@example.com')
on conflict (id) do nothing;

insert into public.trusted_contacts (id, profile_id, name, relation, phone, email, preferred_contact_method, is_primary)
values
  ('7de93b10-c981-4d0e-b509-d9f7f64d11f0', '0d19c7c4-6363-4eb5-8c8f-3ce54a2eac5b', 'Lebo Dlamini', 'Daughter', '+27 82 555 1000', 'lebo@example.com', 'call', true),
  ('80259d8f-2c83-4821-b637-ae4a19107e74', '0d19c7c4-6363-4eb5-8c8f-3ce54a2eac5b', 'Dr. Naidoo', 'Family friend', '+27 82 555 2000', 'naidoo@example.com', 'sms', false)
on conflict (id) do nothing;

insert into public.safety_reminders (id, profile_id, title, message, cadence)
values
  ('7c087bcf-ea54-46d2-81c9-a83e997592f4', '0d19c7c4-6363-4eb5-8c8f-3ce54a2eac5b', 'Slow down', 'Banks never ask for your OTP by text, call, or email.', 'daily'),
  ('62c2a607-77b0-43df-ae8a-db07ca0d5e52', '0d19c7c4-6363-4eb5-8c8f-3ce54a2eac5b', 'Check first', 'If a caller wants money or gift cards, hang up and check with family first.', 'weekly')
on conflict (id) do nothing;

insert into public.app_settings (profile_id, text_scale, high_contrast, simplified_mode, read_aloud, theme)
values ('0d19c7c4-6363-4eb5-8c8f-3ce54a2eac5b', 'standard', false, false, false, 'light')
on conflict (profile_id) do nothing;
