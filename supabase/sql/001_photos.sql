create extension if not exists "pgcrypto";

create table if not exists public.photos (
	id uuid primary key default gen_random_uuid(),
	title text,
	description text,
	shot_at timestamptz,
	location_name text not null,
	location_slug text not null,
	lat double precision,
	lng double precision,
	camera_make text,
	camera_model text,
	lens text,
	iso text,
	aperture text,
	shutter_speed text,
	focal_length text,
	width integer,
	height integer,
	orientation integer,
	blur_data_url text,
	image_path text not null,
	thumb_path text not null,
	display_url text not null,
	thumb_url text not null,
	created_at timestamptz not null default now()
);

create index if not exists photos_location_slug_idx
	on public.photos (location_slug);

create index if not exists photos_shot_at_idx
	on public.photos (shot_at desc);

alter table public.photos enable row level security;

drop policy if exists "public can read photos" on public.photos;
create policy "public can read photos"
	on public.photos
	for select
	to public
	using (true);

drop policy if exists "authenticated can insert photos" on public.photos;
create policy "authenticated can insert photos"
	on public.photos
	for insert
	to authenticated
	with check (true);

drop policy if exists "authenticated can update photos" on public.photos;
create policy "authenticated can update photos"
	on public.photos
	for update
	to authenticated
	using (true)
	with check (true);

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "public can read photo objects" on storage.objects;
create policy "public can read photo objects"
	on storage.objects
	for select
	to public
	using (bucket_id = 'photos');

drop policy if exists "authenticated can upload photo objects" on storage.objects;
create policy "authenticated can upload photo objects"
	on storage.objects
	for insert
	to authenticated
	with check (bucket_id = 'photos');

drop policy if exists "authenticated can update photo objects" on storage.objects;
create policy "authenticated can update photo objects"
	on storage.objects
	for update
	to authenticated
	using (bucket_id = 'photos')
	with check (bucket_id = 'photos');
