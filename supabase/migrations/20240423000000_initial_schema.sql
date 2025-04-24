-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table public.groups (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    image_url text,
    created_by uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table public.group_members (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references public.groups(id) on delete cascade not null,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    unique(group_id, profile_id)
);

create table public.transactions (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references public.groups(id) on delete cascade not null,
    created_by uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    amount decimal(10,2) not null,
    date timestamptz default now() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table public.transaction_splits (
    id uuid default uuid_generate_v4() primary key,
    transaction_id uuid references public.transactions(id) on delete cascade not null,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    amount decimal(10,2) not null,
    created_at timestamptz default now() not null,
    unique(transaction_id, profile_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_splits enable row level security;

-- Create policies

-- Profiles policies
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Groups policies
create policy "Users can view groups they are members of"
    on public.groups for select
    using (
        exists (
            select 1 from public.group_members
            where group_members.group_id = groups.id
            and group_members.profile_id = auth.uid()
        )
    );

create policy "Users can create groups"
    on public.groups for insert
    with check (created_by = auth.uid());

create policy "Group creators can update their groups"
    on public.groups for update
    using (created_by = auth.uid())
    with check (created_by = auth.uid());

create policy "Group creators can delete their groups"
    on public.groups for delete
    using (created_by = auth.uid());

-- Group members policies
create policy "Users can view group members of groups they belong to"
    on public.group_members for select
    using (
        exists (
            select 1 from public.group_members as gm
            where gm.group_id = group_members.group_id
            and gm.profile_id = auth.uid()
        )
    );

create policy "Group creators can manage group members"
    on public.group_members for all
    using (
        exists (
            select 1 from public.groups
            where groups.id = group_members.group_id
            and groups.created_by = auth.uid()
        )
    );

create policy "Users can add themselves to groups"
    on public.group_members for insert
    with check (profile_id = auth.uid());

-- Transactions policies
create policy "Users can view transactions in their groups"
    on public.transactions for select
    using (
        exists (
            select 1 from public.group_members
            where group_members.group_id = transactions.group_id
            and group_members.profile_id = auth.uid()
        )
    );

create policy "Users can create transactions in their groups"
    on public.transactions for insert
    with check (
        exists (
            select 1 from public.group_members
            where group_members.group_id = transactions.group_id
            and group_members.profile_id = auth.uid()
        )
        and created_by = auth.uid()
    );

create policy "Transaction creators can update their transactions"
    on public.transactions for update
    using (created_by = auth.uid())
    with check (created_by = auth.uid());

create policy "Transaction creators can delete their transactions"
    on public.transactions for delete
    using (created_by = auth.uid());

-- Transaction splits policies
create policy "Users can view transaction splits in their groups"
    on public.transaction_splits for select
    using (
        exists (
            select 1 from public.transactions
            join public.group_members on group_members.group_id = transactions.group_id
            where transactions.id = transaction_splits.transaction_id
            and group_members.profile_id = auth.uid()
        )
    );

create policy "Users can create transaction splits in their groups"
    on public.transaction_splits for insert
    with check (
        exists (
            select 1 from public.transactions
            join public.group_members on group_members.group_id = transactions.group_id
            where transactions.id = transaction_splits.transaction_id
            and group_members.profile_id = auth.uid()
        )
    );

-- Functions and triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

create or replace function public.handle_new_group()
returns trigger as $$
begin
    insert into public.group_members (group_id, profile_id)
    values (new.id, new.created_by);
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_group_created
    after insert on public.groups
    for each row execute procedure public.handle_new_group();

-- Create indexes for better performance
create index if not exists group_members_group_id_idx on public.group_members(group_id);
create index if not exists group_members_profile_id_idx on public.group_members(profile_id);
create index if not exists transactions_group_id_idx on public.transactions(group_id);
create index if not exists transactions_created_by_idx on public.transactions(created_by);
create index if not exists transaction_splits_transaction_id_idx on public.transaction_splits(transaction_id);
create index if not exists transaction_splits_profile_id_idx on public.transaction_splits(profile_id); 