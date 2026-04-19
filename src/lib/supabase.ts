import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 키가 없으면 null 반환 → 리더보드 기능 비활성화(게임 자체는 로컬 모드로 동작)
export function browserSupabase(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  return createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function serverSupabase(): SupabaseClient | null {
  if (!URL || !SERVICE) return null;
  return createClient(URL, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const LEADERBOARD_ENABLED = Boolean(URL && ANON);
