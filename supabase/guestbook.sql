-- 방명록 테이블 (Supabase SQL Editor에서 실행)
-- 1. pgcrypto 확장
create extension if not exists pgcrypto;

-- 2. 테이블
create table if not exists guestbook (
  id uuid primary key default gen_random_uuid(),
  author varchar(10) not null,
  password_hash text not null,
  message varchar(200) not null,
  deleted boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. RLS
alter table guestbook enable row level security;

create policy "Allow anonymous insert"
  on guestbook for insert to anon with check (true);

-- 4. 조회용 뷰 (deleted = false, password_hash 제외)
create or replace view guestbook_list as
select id, author, message, created_at
from guestbook
where deleted = false
order by created_at desc;

-- 테이블 직접 조회 시 deleted만 허용 (password_hash 노출됨) 대신 뷰 사용
drop policy if exists "Select non-deleted" on guestbook;
create policy "Select non-deleted"
  on guestbook for select to anon
  using (deleted = false);

-- 뷰로 조회 시 password_hash 제외. 뷰에 대한 권한
grant select on guestbook_list to anon;

-- 5. Soft delete RPC (비밀번호 확인 후 deleted = true)
create or replace function soft_delete_guestbook(row_id uuid, password_plain text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  stored_hash text;
  input_hash text;
begin
  select password_hash into stored_hash
  from guestbook where id = row_id and deleted = false;
  if stored_hash is null then
    return false;
  end if;
  input_hash := encode(digest(password_plain, 'sha256'), 'hex');
  if stored_hash != input_hash then
    return false;
  end if;
  update guestbook set deleted = true where id = row_id;
  return true;
end;
$$;

grant execute on function soft_delete_guestbook(uuid, text) to anon;
