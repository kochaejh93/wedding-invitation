import { NextRequest } from "next/server";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const db = serverSupabase();
  if (!db) {
    return Response.json({ ok: true, mode: "local", top: [], me: null });
  }

  const playerId = req.nextUrl.searchParams.get("playerId") ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 10), 50);

  const { data: top, error: topErr } = await db
    .from("wedding_runner_leaderboard")
    .select("id, player_id, nickname, score, max_combo, survival_time, updated_at")
    .order("score", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(limit);

  if (topErr) {
    return Response.json({ ok: false, reason: "db-error", detail: topErr.message }, { status: 500 });
  }

  let me: { rank: number; score: number; nickname: string } | null = null;
  if (playerId) {
    const { data: mine } = await db
      .from("wedding_runner_leaderboard")
      .select("score, nickname")
      .eq("player_id", playerId)
      .maybeSingle();

    if (mine) {
      const { count } = await db
        .from("wedding_runner_scores")
        .select("player_id", { count: "exact", head: true })
        .gt("score", mine.score);
      me = {
        rank: (count ?? 0) + 1,
        score: mine.score as number,
        nickname: mine.nickname as string,
      };
    }
  }

  return Response.json({ ok: true, top: top ?? [], me });
}
