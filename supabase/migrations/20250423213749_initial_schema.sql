-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create groups table
create table groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  currency text default 'USD' not null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create group_members table
create table group_members (
  group_id uuid references groups(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  role text not null default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, profile_id)
);

-- Create transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade not null,
  created_by uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  amount decimal(10,2) not null,
  currency text not null,
  category text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transaction_splits table
create table transaction_splits (
  id uuid default gen_random_uuid() primary key,
  transaction_id uuid references transactions(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  amount decimal(10,2) not null,
  status text default 'pending' not null,
  settled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(transaction_id, profile_id)
);

-- Create expenses table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade not null,
  paid_by uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  amount decimal(10,2) not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint expenses_paid_by_fkey foreign key (paid_by) references profiles(id)
);

-- Create expense_splits table
create table expense_splits (
  id uuid default gen_random_uuid() primary key,
  expense_id uuid references expenses(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  amount decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(expense_id, profile_id)
);

-- Create settlements table
create table settlements (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade not null,
  from_user_id uuid references profiles(id) on delete cascade not null,
  to_user_id uuid references profiles(id) on delete cascade not null,
  amount decimal(10,2) not null,
  status text default 'pending' not null,
  settled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table transactions enable row level security;
alter table transaction_splits enable row level security;
alter table expenses enable row level security;
alter table expense_splits enable row level security;
alter table settlements enable row level security;

-- Create policies
create policy "Users can view their own profile."
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile."
  on profiles for update
  using (auth.uid() = id);

create policy "Users can view groups they are members of."
  on groups for select
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = id
      and group_members.profile_id = auth.uid()
    )
  );

create policy "Users can create groups."
  on groups for insert
  with check (created_by = auth.uid());

create policy "Users can update groups they are admins of."
  on groups for update
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = id
      and group_members.profile_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

create policy "Users can delete groups they are admins of."
  on groups for delete
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = id
      and group_members.profile_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

create policy "Users can view group members of their groups."
  on group_members for select
  using (
    exists (
      select 1 from groups
      where groups.id = group_id
      and exists (
        select 1 from group_members gm
        where gm.group_id = groups.id
        and gm.profile_id = auth.uid()
      )
    )
  );

create policy "Users can manage members if they are admins."
  on group_members for all
  using (
    exists (
      select 1 from groups
      where groups.id = group_id
      and exists (
        select 1 from group_members gm
        where gm.group_id = groups.id
        and gm.profile_id = auth.uid()
        and gm.role = 'admin'
      )
    )
  );

-- Transaction policies
create policy "Users can view transactions in their groups"
  on transactions for select
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = transactions.group_id
      and group_members.profile_id = auth.uid()
    )
  );

create policy "Users can create transactions in their groups"
  on transactions for insert
  with check (
    exists (
      select 1 from group_members
      where group_members.group_id = transactions.group_id
      and group_members.profile_id = auth.uid()
    )
    and created_by = auth.uid()
  );

create policy "Transaction creators can update their transactions"
  on transactions for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "Transaction creators can delete their transactions"
  on transactions for delete
  using (created_by = auth.uid());

-- Transaction splits policies
create policy "Users can view transaction splits in their groups"
  on transaction_splits for select
  using (
    exists (
      select 1 from transactions
      join group_members on group_members.group_id = transactions.group_id
      where transactions.id = transaction_splits.transaction_id
      and group_members.profile_id = auth.uid()
    )
  );

create policy "Users can create transaction splits in their groups"
  on transaction_splits for insert
  with check (
    exists (
      select 1 from transactions
      join group_members on group_members.group_id = transactions.group_id
      where transactions.id = transaction_splits.transaction_id
      and group_members.profile_id = auth.uid()
    )
  );

-- Expense policies
create policy "Users can view expenses in their groups"
  on expenses for select
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = expenses.group_id
      and group_members.profile_id = auth.uid()
    )
  );

create policy "Users can create expenses in their groups"
  on expenses for insert
  with check (
    exists (
      select 1 from group_members
      where group_members.group_id = expenses.group_id
      and group_members.profile_id = auth.uid()
    )
    and paid_by = auth.uid()
  );

create policy "Expense creators can update their expenses"
  on expenses for update
  using (paid_by = auth.uid())
  with check (paid_by = auth.uid());

create policy "Expense creators can delete their expenses"
  on expenses for delete
  using (paid_by = auth.uid());

-- Expense splits policies
create policy "Users can view expense splits in their groups"
  on expense_splits for select
  using (
    exists (
      select 1 from expenses
      join group_members on group_members.group_id = expenses.group_id
      where expenses.id = expense_splits.expense_id
      and group_members.profile_id = auth.uid()
    )
  );

create policy "Users can manage expense splits in their groups"
  on expense_splits for all
  using (
    exists (
      select 1 from expenses
      where expenses.id = expense_splits.expense_id
      and expenses.paid_by = auth.uid()
    )
  );

-- Settlement policies
create policy "Users can view settlements in their groups"
  on settlements for select
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = settlements.group_id
      and group_members.profile_id = auth.uid()
    )
  );

create policy "Users can create settlements"
  on settlements for insert
  with check (
    exists (
      select 1 from group_members
      where group_members.group_id = settlements.group_id
      and group_members.profile_id = auth.uid()
    )
    and (from_user_id = auth.uid() or to_user_id = auth.uid())
  );

create policy "Settlement participants can update settlements"
  on settlements for update
  using (from_user_id = auth.uid() or to_user_id = auth.uid())
  with check (from_user_id = auth.uid() or to_user_id = auth.uid());

-- Create trigger to automatically add creator as admin member
create or replace function public.handle_new_group()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.group_members (group_id, profile_id, role)
  values (new.id, new.created_by, 'admin');
  return new;
end;
$$;

create trigger on_group_created
  after insert on public.groups
  for each row execute procedure public.handle_new_group();

-- Create trigger to handle new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
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
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create trigger to update the updated_at column
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger groups_updated_at
  before update on public.groups
  for each row execute procedure public.handle_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();

-- Create trigger for expenses updated_at
create trigger expenses_updated_at
  before update on expenses
  for each row execute procedure public.handle_updated_at();

-- Create trigger for settlements updated_at
create trigger settlements_updated_at
  before update on settlements
  for each row execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index if not exists group_members_group_id_idx on group_members(group_id);
create index if not exists group_members_profile_id_idx on group_members(profile_id);
create index if not exists transactions_group_id_idx on transactions(group_id);
create index if not exists transactions_created_by_idx on transactions(created_by);
create index if not exists transaction_splits_transaction_id_idx on transaction_splits(transaction_id);
create index if not exists transaction_splits_profile_id_idx on transaction_splits(profile_id);
create index if not exists expenses_group_id_idx on expenses(group_id);
create index if not exists expenses_paid_by_idx on expenses(paid_by);
create index if not exists expense_splits_expense_id_idx on expense_splits(expense_id);
create index if not exists expense_splits_profile_id_idx on expense_splits(profile_id);
create index if not exists settlements_group_id_idx on settlements(group_id);
create index if not exists settlements_from_user_id_idx on settlements(from_user_id);
create index if not exists settlements_to_user_id_idx on settlements(to_user_id); 