-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  is_seller boolean default false,
  store_name text,
  store_description text,
  gcash_qr_url text,
  messenger_link text,

  constraint username_length check (char_length(username) >= 3)
);

-- Create a table for products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- Products policies
create policy "Products are viewable by everyone." on public.products
  for select using (true);

create policy "Sellers can insert their own products." on public.products
  for insert with check (auth.uid() = seller_id);

create policy "Sellers can update their own products." on public.products
  for update using (auth.uid() = seller_id);

create policy "Sellers can delete their own products." on public.products
  for delete using (auth.uid() = seller_id);

-- Create a trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
