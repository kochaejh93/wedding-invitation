-- 웨딩러너 리더보드 스키마 (Supabase · 프로젝트 ref: fhfgsepqgnbipkwqolaj)
-- 적용: Supabase SQL Editor에서 본 파일 내용 실행

-- 점수 테이블
create table if not exists public.wedding_runner_scores (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null,
  nickname text not null check (char_length(nickname) between 2 and 8),
  contact_hash text not null, -- SHA-256 해시, 평문 미저장
  score integer not null check (score >= 0),
  item_score integer not null default 0,
  max_combo integer not null default 0,
  survival_time integer not null default 0,
  game_version text not null default '1.0.0',
  ip_hash text, -- 레이트리밋/치팅용 선택 저장
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id)
);

create index if not exists idx_wrs_score_desc on public.wedding_runner_scores (score desc);
create index if not exists idx_wrs_created_at on public.wedding_runner_scores (created_at desc);

-- 갱신 시각 트리거
create or replace function public.wrs_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wrs_set_updated_at on public.wedding_runner_scores;
create trigger wrs_set_updated_at
  before update on public.wedding_runner_scores
  for each row execute function public.wrs_touch_updated_at();

-- RLS 활성화
alter table public.wedding_runner_scores enable row level security;

-- 읽기 정책: anon 포함 누구나 리더보드 조회 (단 contact_hash 컬럼은 쿼리시 select 제외할 것)
drop policy if exists wrs_select_public on public.wedding_runner_scores;
create policy wrs_select_public
  on public.wedding_runner_scores
  for select
  using (true);

-- 쓰기 정책: anon 차단 (API Route에서 service_role로만 insert/upsert)
-- → 별도 policy 선언 안 함 (RLS 기본 deny)

-- 리더보드 뷰 (연락처 해시 제외 안전 SELECT)
create or replace view public.wedding_runner_leaderboard as
  select
    id,
    player_id,
    nickname,
    score,
    max_combo,
    survival_time,
    updated_at
  from public.wedding_runner_scores
  order by score desc, updated_at asc;

comment on table public.wedding_runner_scores is '웨딩러너 게임 점수 — 하객 본인 최고점 1행 Upsert';
comment on column public.wedding_runner_scores.contact_hash is 'SHA-256(salt:phone) — 경품 수령자 본인 확인 전용';
