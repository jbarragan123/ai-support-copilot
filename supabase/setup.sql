-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tickets table
create table public.tickets (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default now(),
    description text not null,
    category text,
    sentiment text,
    processed boolean default false
);

insert into public.tickets (description)
values
('Mi internet no funciona desde ayer'),
('No entiendo un cobro adicional en mi factura'),
('Quiero información sobre planes empresariales');

-- Allow public read access
create policy "Public read access"
on public.tickets
for select
using (true);

-- Allow public insert
create policy "Public insert access"
on public.tickets
for insert
with check (true);

-- Allow public update
create policy "Public update access"
on public.tickets
for update
using (true);