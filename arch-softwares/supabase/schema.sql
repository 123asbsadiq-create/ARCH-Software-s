-- Run in Supabase > SQL Editor. Then create the admin user in Authentication > Users.
create or replace function is_admin() returns boolean language sql stable as
$$ select coalesce(auth.jwt()->>'email','')='123asbsadiq@gmail.com' $$; -- change if admin email differs

create table projects(id uuid primary key default gen_random_uuid(),title text not null,description text,category text not null,
 tech text[] default '{}',image_url text,live_url text,github_url text,featured boolean default false,is_demo boolean default true,created_at timestamptz default now());
create table products(id uuid primary key default gen_random_uuid(),name text not null,description text,features text[] default '{}',
 price text,image_url text,created_at timestamptz default now());
create table enquiries(id uuid primary key default gen_random_uuid(),name text not null check(char_length(name) between 2 and 100),
 email text not null check(email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),phone text check(char_length(phone)<=30),service text,
 subject text check(char_length(subject)<=150),message text not null check(char_length(message) between 10 and 3000),
 status text not null default 'new' check(status in('new','in progress','resolved','closed')),created_at timestamptz default now());
create table reviews(id uuid primary key default gen_random_uuid(),name text not null check(char_length(name) between 2 and 80),
 rating int not null check(rating between 1 and 5),comment text not null check(char_length(comment) between 10 and 1000),
 status text not null default 'pending' check(status in('pending','approved','rejected')),created_at timestamptz default now());
create table content(id uuid primary key default gen_random_uuid(),key text unique not null,value text);
insert into content(key,value) values('hero_title','Software built in Nigeria, ready for the world.'),
 ('hero_text','ARCH Softwares designs and builds websites, web and mobile apps and custom software that help businesses grow.'),
 ('about','Our mission is to give Nigerian businesses reliable, well-designed software. We start from your problem, build in small steps you can see, and support what we ship.');

alter table projects enable row level security; alter table products enable row level security;
alter table enquiries enable row level security; alter table reviews enable row level security; alter table content enable row level security;
create policy "read" on projects for select using(true); create policy "admin" on projects for all using(is_admin()) with check(is_admin());
create policy "read" on products for select using(true); create policy "admin" on products for all using(is_admin()) with check(is_admin());
create policy "read" on content for select using(true); create policy "admin" on content for all using(is_admin()) with check(is_admin());
create policy "send" on enquiries for insert with check(status='new'); create policy "admin" on enquiries for all using(is_admin()) with check(is_admin());
create policy "send" on reviews for insert with check(status='pending');
create policy "public" on reviews for select using(status='approved' or is_admin());
create policy "admin upd" on reviews for update using(is_admin()) with check(is_admin());
create policy "admin del" on reviews for delete using(is_admin());

insert into storage.buckets(id,name,public) values('images','images',true) on conflict do nothing;
create policy "img read" on storage.objects for select using(bucket_id='images');
create policy "img admin" on storage.objects for all using(bucket_id='images' and is_admin()) with check(bucket_id='images' and is_admin());
