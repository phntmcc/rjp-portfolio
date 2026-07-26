alter table public.photos
	add column if not exists variants jsonb not null default '{}'::jsonb;

create index if not exists photos_variants_empty_idx
	on public.photos ((variants = '{}'::jsonb));
