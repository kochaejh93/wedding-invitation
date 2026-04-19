// 결혼식 날짜 · 경품 · 리더보드 마감일 공용 상수

export const WEDDING_DATE_ISO = "2026-11-15T14:00:00+09:00";
export const WEDDING_DATE_LABEL = "2026. 11. 15 · SUN · 14:00";
export const WEDDING_DATE_LONG = "2026년 11월 15일 일요일 오후 2시";

// 집계 마감: 결혼식 당일 자정(KST)
export const LEADERBOARD_DEADLINE_ISO = "2026-11-15T23:59:59+09:00";

export const GAME_VERSION = "1.0.0";

export const PRIZES = [
  { rank: 1, emoji: "🥇", label: "백화점 상품권 10만원" },
  { rank: 2, emoji: "🥈", label: "백화점 상품권 5만원" },
  { rank: 3, emoji: "🥉", label: "치킨 기프티콘 1개" },
] as const;

// 닉네임 길이 제한
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 8;

// 60초 본게임 구간
export const GAME_DURATION_SEC = 60;
