// 하객 연락처 SHA-256 해시 (서버 전용 · 평문 저장 금지)
import { createHash } from "node:crypto";

// salt는 런타임 환경변수로만 주입. 키 순환/이력 관리 고려.
const SALT = process.env.CONTACT_HASH_SALT ?? "wedding-runner-2026";

function normalizePhone(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

export function hashContact(raw: string): string {
  const phone = normalizePhone(raw);
  return createHash("sha256").update(`${SALT}:${phone}`).digest("hex");
}

// 치팅 검증: 60초 상한 점수. PRD 기준 아이템 최대밀도 + 콤보 + 생존보너스 합산 가능치
// (하트 30 × 최대 30개 + 반지 100 × 5 + 부케 250 × 2 + 샴페인 80 × 3 + 생존 60×10 + 콤보보너스 200) ≈ 3,000
export const MAX_PLAUSIBLE_SCORE = 5000;

export function isScoreSuspicious(s: {
  score: number;
  survivalTime: number;
  itemScore: number;
  maxCombo: number;
}): string | null {
  if (s.score < 0) return "음수 점수";
  if (s.score > MAX_PLAUSIBLE_SCORE) return "상한 초과";
  if (s.survivalTime < 0 || s.survivalTime > 60) return "생존시간 이상";
  if (s.itemScore < 0 || s.itemScore > s.score + 1000) return "아이템 점수 이상";
  if (s.maxCombo < 0 || s.maxCombo > 60) return "콤보 이상";
  return null;
}
