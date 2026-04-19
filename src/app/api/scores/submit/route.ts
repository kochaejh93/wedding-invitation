import { NextRequest } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { hashContact, isScoreSuspicious } from "@/lib/score-hash";
import { GAME_VERSION, NICKNAME_MAX, NICKNAME_MIN } from "@/lib/wedding-constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitBody = {
  playerId?: unknown;
  nickname?: unknown;
  contact?: unknown;
  score?: unknown;
  itemScore?: unknown;
  maxCombo?: unknown;
  survivalTime?: unknown;
};

function isValidUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return Response.json({ ok: false, reason: "invalid-json" }, { status: 400 });
  }

  const playerId = String(body.playerId ?? "");
  const nickname = String(body.nickname ?? "").trim();
  const contact = String(body.contact ?? "").trim();
  const score = Number(body.score);
  const itemScore = Number(body.itemScore ?? 0);
  const maxCombo = Number(body.maxCombo ?? 0);
  const survivalTime = Number(body.survivalTime ?? 0);

  if (!isValidUuid(playerId)) {
    return Response.json({ ok: false, reason: "invalid-player-id" }, { status: 400 });
  }
  if (nickname.length < NICKNAME_MIN || nickname.length > NICKNAME_MAX) {
    return Response.json({ ok: false, reason: "invalid-nickname" }, { status: 400 });
  }
  if (contact.length < 4 || contact.length > 32) {
    return Response.json({ ok: false, reason: "invalid-contact" }, { status: 400 });
  }
  const suspicious = isScoreSuspicious({ score, itemScore, maxCombo, survivalTime });
  if (suspicious) {
    return Response.json({ ok: false, reason: `suspicious:${suspicious}` }, { status: 400 });
  }

  const db = serverSupabase();
  if (!db) {
    // Supabase 미구성 → 로컬 모드. 게임은 돌지만 서버 집계는 비활성
    return Response.json({ ok: true, mode: "local", rank: null });
  }

  const contactHash = hashContact(contact);

  // 기존 점수 조회 → 최고점만 Upsert
  const { data: existing } = await db
    .from("wedding_runner_scores")
    .select("score")
    .eq("player_id", playerId)
    .maybeSingle();

  if (existing && existing.score >= score) {
    return Response.json({ ok: true, updated: false, bestScore: existing.score });
  }

  const { error } = await db.from("wedding_runner_scores").upsert(
    {
      player_id: playerId,
      nickname,
      contact_hash: contactHash,
      score,
      item_score: itemScore,
      max_combo: maxCombo,
      survival_time: survivalTime,
      game_version: GAME_VERSION,
    },
    { onConflict: "player_id" },
  );

  if (error) {
    return Response.json({ ok: false, reason: "db-error", detail: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, updated: true, bestScore: score });
}
