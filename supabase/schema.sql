create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.trusted_contacts (
  id uuid primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  relation text not null,
  phone text not null,
  email text,
  preferred_contact_method text not null default 'call',
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  source_label text not null,
  content text not null,
  screenshot_name text,
  extracted_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.verification_results (
  request_id uuid primary key references public.verification_requests(id) on delete cascade,
  risk_level text not null,
  score integer not null,
  explanation text not null,
  suggested_action text not null,
  reasons jsonb not null default '[]'::jsonb,
  pause_checklist jsonb not null default '[]'::jsonb,
  requires_review boolean not null default false,
  trusted_match_name text
);

create table if not exists public.safety_reminders (
  id uuid primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  cadence text not null
);

create table if not exists public.app_settings (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  text_scale text not null default 'standard',
  high_contrast boolean not null default false,
  simplified_mode boolean not null default false,
  read_aloud boolean not null default false,
  theme text not null default 'light'
);
