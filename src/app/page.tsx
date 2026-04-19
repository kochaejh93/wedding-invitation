"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WeddingRunner from "@/components/wedding-runner/WeddingRunner";

// 모바일 햅틱 (지원 안 하는 브라우저는 자동 무시)
const vibrate = (pattern: number | number[]) => {
  if (typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* noop */
  }
};

// 더미 데이터 — 마스터 정보 받으면 교체
const data = {
  groom: { name: "채종현", nameEn: "Jonghyun Chae", father: "채승우", mother: "김미경", phone: "010-0000-0000", account: "신한은행 110-000-000000" },
  bride: { name: "최수빈", nameEn: "Subin Choi", father: "최원영", mother: "김영미", phone: "010-0000-0000", account: "국민은행 000-00-0000-000" },
  date: "2026-11-15T14:00:00+09:00",
  dateLabel: "2026년 11월 15일 일요일 오후 2시",
  venue: {
    name: "테라리움 서울",
    address: "서울특별시 노원구 노원로 247 서울온천 7~8층",
    subway: "7호선 하계역 도보 약 7분",
    bus: "하계역·서울온천 정류장 (146·1224·1226·1227·1132)",
    parking: "건물 주차장 약 700대 수용 · 최초 2시간 무료",
    parkingLots: [
      "제1주차장 — 본 건물 전용 주차장",
      "제2주차장 — 본 건물 인근 2곳 운영",
      "제3주차장 — 도보 거리 보조 주차장",
    ],
    parkingExtra: "본 건물 만차 시 인근 대진고등학교 주차장 이용 가능 (도보 약 5분, 횡단보도 1개)",
    parkingTip: "주말 피크 시간대에는 조기 만차 가능성이 있어 가급적 대중교통을 권장드립니다. 자세한 셔틀버스 운행 여부는 안내 데스크(02-6316-7700)로 문의 부탁드립니다.",
    phone: "02-6316-7700",
    lat: 37.6394920,
    lng: 127.0733210,
  },
  greeting: `서로의 계절을 함께 걸으며\n같은 풍경을 바라보게 되었습니다.\n\n작은 시작 위에\n귀한 발걸음 더해 주시면\n오래도록 따뜻한 기억으로 간직하겠습니다.`,
  gallery: Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/mng${i}/800/1000`),
};

// 12종 폰트 — CSS 변수와 라벨 매핑
const FONTS: { key: string; label: string; cssVar: string; category: string }[] = [
  { key: "gowun-batang", label: "Gowun Batang", cssVar: "var(--font-gowun-batang)", category: "명조" },
  { key: "noto-serif", label: "Noto Serif KR", cssVar: "var(--font-noto-serif)", category: "명조" },
  { key: "nanum-myeongjo", label: "Nanum Myeongjo", cssVar: "var(--font-nanum-myeongjo)", category: "명조" },
  { key: "noto-sans", label: "Noto Sans KR", cssVar: "var(--font-noto-sans)", category: "고딕" },
  { key: "gowun-dodum", label: "Gowun Dodum", cssVar: "var(--font-gowun-dodum)", category: "고딕" },
  { key: "jua", label: "Jua", cssVar: "var(--font-jua)", category: "고딕" },
  { key: "black-han", label: "Black Han Sans", cssVar: "var(--font-black-han)", category: "고딕" },
  { key: "nanum-pen", label: "Nanum Pen Script", cssVar: "var(--font-nanum-pen)", category: "필기" },
  { key: "single-day", label: "Single Day", cssVar: "var(--font-single-day)", category: "필기" },
  { key: "east-sea", label: "East Sea Dokdo", cssVar: "var(--font-east-sea)", category: "필기" },
  { key: "gaegu", label: "Gaegu", cssVar: "var(--font-gaegu)", category: "캐주얼" },
  { key: "cute", label: "Cute Font", cssVar: "var(--font-cute)", category: "캐주얼" },
];

function useCountdown(target: string) {
  const [remain, setRemain] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setRemain({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return remain;
}

function FlowerDivider() {
  return (
    <div className="flex items-center justify-center py-6">
      <svg viewBox="0 0 120 24" className="h-6 w-32 text-[color:var(--color-rose)]" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M2 12 H44" strokeLinecap="round" />
        <path d="M76 12 H118" strokeLinecap="round" />
        <g transform="translate(60 12)">
          <circle r="2.6" fill="currentColor" opacity="0.85" />
          <ellipse cx="-7" cy="0" rx="4" ry="1.6" opacity="0.55" />
          <ellipse cx="7" cy="0" rx="4" ry="1.6" opacity="0.55" />
          <ellipse cx="0" cy="-5" rx="1.6" ry="3.2" opacity="0.55" />
          <ellipse cx="0" cy="5" rx="1.6" ry="3.2" opacity="0.55" />
        </g>
      </svg>
    </div>
  );
}

function FontToggle({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-2 w-64 max-h-80 overflow-y-auto rounded-2xl bg-white shadow-2xl border border-[color:var(--color-line)] p-2">
          <div className="text-[12px] tracking-[0.28em] uppercase text-[color:var(--color-rose-deep)] px-3 py-2 border-b border-[color:var(--color-line)]">Font</div>
          {FONTS.map((f) => (
            <button
              key={f.key}
              onClick={() => onChange(f.key)}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                value === f.key ? "bg-[color:var(--color-blush)]" : "hover:bg-[color:var(--color-blush)]/60"
              }`}
              style={{ fontFamily: f.cssVar }}
            >
              <span className="text-[15px] text-[color:var(--color-charcoal)]">우리 결혼합니다</span>
              <span className="text-[11px] text-[color:var(--color-mute)] ml-2 whitespace-nowrap">{f.category}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-12 w-12 rounded-full bg-[color:var(--color-rose-deep)] text-white shadow-lg text-lg font-semibold active:scale-95 transition"
      >
        {open ? "×" : "가"}
      </button>
    </div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="eyebrow">{kicker}</p>
      <h2 className="section-title mt-3">{title}</h2>
    </div>
  );
}

// 공통 카드 래퍼 — 블러시 단일 톤
function Card({ children }: { children: React.ReactNode }) {
  return <div className="content-card bg-[color:var(--color-blush)]">{children}</div>;
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[color:var(--color-blush)] via-white to-white px-7 text-center">
      <svg
        className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-[color:var(--color-rose)]/55"
        width="180"
        height="60"
        viewBox="0 0 180 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <path d="M90 0 V60" />
        <path d="M90 12 Q70 18 60 30" />
        <path d="M90 12 Q110 18 120 30" />
        <path d="M90 26 Q72 32 64 44" />
        <path d="M90 26 Q108 32 116 44" />
        <ellipse cx="60" cy="30" rx="6" ry="2" />
        <ellipse cx="120" cy="30" rx="6" ry="2" />
        <ellipse cx="64" cy="44" rx="5" ry="1.8" />
        <ellipse cx="116" cy="44" rx="5" ry="1.8" />
      </svg>
      <div className="fade-in w-full max-w-[22rem]">
        <p className="eyebrow mb-6">We Invite You</p>
        <h1 className="text-[clamp(1.45rem,7vw,2.1rem)] leading-[1.15] text-[color:var(--color-charcoal)] break-words">
          {data.groom.nameEn}
        </h1>
        <p className="my-2 italic text-base text-[color:var(--color-rose-deep)]">&amp;</p>
        <h1 className="text-[clamp(1.45rem,7vw,2.1rem)] leading-[1.15] text-[color:var(--color-charcoal)] break-words">
          {data.bride.nameEn}
        </h1>
        <FlowerDivider />
        <p className="mt-2 text-[clamp(11px,3.4vw,14px)] tracking-[0.22em] text-[color:var(--color-mute)]">2026. 11. 15 · 일</p>
        <p className="mt-2 text-[clamp(10px,3vw,12px)] tracking-[0.18em] text-[color:var(--color-mute)]">{data.venue.name}</p>
      </div>
      <div className="absolute bottom-8 label-caps text-[color:var(--color-mute)] animate-pulse">SCROLL</div>
    </section>
  );
}

function Greeting() {
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="Invitation" title="초대합니다" />
        <p className="whitespace-pre-line text-center leading-[2.1] text-[15px] text-[color:var(--color-charcoal)]/85">
          {data.greeting}
        </p>
        <FlowerDivider />
        <div className="text-center text-[13px] leading-loose text-[color:var(--color-mute)]">
          <p>
            <span className="text-[color:var(--color-charcoal)]/70">{data.groom.father}</span>
            <span className="mx-2">·</span>
            <span className="text-[color:var(--color-charcoal)]/70">{data.groom.mother}</span>
            <span className="ml-2">의 아들</span>
            <span className="ml-2 font-medium text-[color:var(--color-charcoal)]">{data.groom.name}</span>
          </p>
          <p className="mt-1.5">
            <span className="text-[color:var(--color-charcoal)]/70">{data.bride.father}</span>
            <span className="mx-2">·</span>
            <span className="text-[color:var(--color-charcoal)]/70">{data.bride.mother}</span>
            <span className="ml-2">의 딸</span>
            <span className="ml-2 font-medium text-[color:var(--color-charcoal)]">{data.bride.name}</span>
          </p>
        </div>
      </Card>
    </section>
  );
}

function Couple() {
  const Person = ({ role, p }: { role: string; p: typeof data.groom }) => (
    <div className="text-center">
      <p className="eyebrow">{role}</p>
      <p className="mt-3 text-[clamp(1.15rem,5vw,1.5rem)] text-[color:var(--color-charcoal)] whitespace-nowrap">{p.nameEn}</p>
      <p className="mt-1 text-[clamp(14px,4vw,16px)] text-[color:var(--color-charcoal)]">{p.name}</p>
      <p className="mt-2 text-[11px] text-[color:var(--color-mute)] whitespace-nowrap">
        {p.father} · {p.mother}
      </p>
      <a
        href={`tel:${p.phone}`}
        className="mt-3 inline-block label-caps text-[color:var(--color-rose-deep)] border border-[color:var(--color-rose)]/40 rounded-full px-3 py-1"
      >
        CALL
      </a>
    </div>
  );
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="The Couple" title="신랑 · 신부" />
        <div className="grid grid-cols-2 gap-4 items-start">
          <Person role="Groom" p={data.groom} />
          <Person role="Bride" p={data.bride} />
        </div>
      </Card>
    </section>
  );
}

function Countdown() {
  const r = useCountdown(data.date);
  const items = [
    { v: r.d, l: "DAYS" },
    { v: r.h, l: "HOUR" },
    { v: r.m, l: "MIN" },
    { v: r.s, l: "SEC" },
  ];
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="D-Day" title="우리의 그 날까지" />
        <div className="grid grid-cols-4 gap-2 text-center">
          {items.map((i) => (
            <div key={i.l} className="py-5">
              <div className="text-[clamp(1.4rem,6vw,1.7rem)] text-[color:var(--color-rose-deep)] tabular-nums">{String(i.v).padStart(2, "0")}</div>
              <div className="mt-1 label-caps text-[color:var(--color-mute)]">{i.l}</div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[13px] text-[color:var(--color-mute)]">
          <span className="text-[color:var(--color-charcoal)]">{data.groom.name}</span>
          <span className="mx-2 text-[color:var(--color-rose)]">♥</span>
          <span className="text-[color:var(--color-charcoal)]">{data.bride.name}</span>의 결혼식이{" "}
          <b className="text-[color:var(--color-rose-deep)]">{r.d}</b>일 남았습니다.
        </p>
      </Card>
    </section>
  );
}

function Calendar() {
  const target = new Date(data.date);
  const year = target.getFullYear();
  const month = target.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startCol = first.getDay();
  const days: (number | null)[] = [
    ...Array(startCol).fill(null),
    ...Array.from({ length: last.getDate() }, (_, i) => i + 1),
  ];
  while (days.length % 7 !== 0) days.push(null);
  const monthName = target.toLocaleDateString("en-US", { month: "long" });
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="When" title="예식일" />
        <div className="mx-auto max-w-xs p-5">
          <p className="text-center tracking-[0.2em] text-[color:var(--color-rose-deep)] text-[clamp(13px,3.8vw,16px)] whitespace-nowrap">
            {monthName} · {year}
          </p>
          <div className="mt-4 grid grid-cols-7 text-center text-[clamp(13px,3.8vw,18px)] tracking-wider text-[color:var(--color-mute)]">
            {["S", "M", "T", "W", "T", "F", "S"].map((l, i) => (
              <div key={i} className={`py-2 ${i === 0 ? "text-[color:var(--color-rose-deep)]" : ""}`}>{l}</div>
            ))}
            {days.map((d, i) => {
              const isTarget = d === target.getDate();
              return (
                <div key={i} className="py-2 text-[13px] text-[color:var(--color-charcoal)]/80">
                  {d && isTarget && (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-rose)] text-white">
                      {d}
                    </span>
                  )}
                  {d && !isTarget && <span>{d}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-6 text-center text-[13px] text-[color:var(--color-mute)]">{data.dateLabel.split(" 오후")[0]}</p>
        <p className="mt-1 text-center text-[13px] text-[color:var(--color-rose-deep)]">오후 2시</p>
      </Card>
    </section>
  );
}

function Gallery() {
  return (
    <section className="px-5 py-10 bg-white">
      <SectionHead kicker="Gallery" title="우리의 순간" />
      <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
        {data.gallery.map((src, i) => (
          <div key={i} className="aspect-[3/4] overflow-hidden bg-[color:var(--color-blush)]/50 rounded-md">
            <img src={src} alt={`gallery-${i}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] text-[color:var(--color-mute)]">사진 자리 — 마스터 사진 받으면 교체</p>
    </section>
  );
}

function NaverMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    const init = () => {
      if (cancelled || !containerRef.current) return;
      const w = window as unknown as { naver?: { maps?: Record<string, unknown> } };
      const nmaps = w.naver?.maps as {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (el: HTMLElement, opts: Record<string, unknown>) => { setCenter(p: unknown): void };
        Marker: new (opts: Record<string, unknown>) => unknown;
        Position?: { TOP_RIGHT: unknown };
      } | undefined;
      if (!nmaps) {
        setStatus("error");
        return;
      }
      const pos = new nmaps.LatLng(lat, lng);
      const map = new nmaps.Map(containerRef.current, {
        center: pos,
        zoom: 16,
        scaleControl: false,
        mapDataControl: false,
        logoControlOptions: { position: nmaps.Position?.TOP_RIGHT },
      });
      new nmaps.Marker({ position: pos, map, title: name });
      setStatus("ready");
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-naver-maps="true"]',
    );
    if (existing) {
      const w = window as unknown as { naver?: { maps?: unknown } };
      if (w.naver?.maps) init();
      else existing.addEventListener("load", init, { once: true });
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.dataset.naverMaps = "true";
    script.addEventListener("load", init, { once: true });
    script.addEventListener("error", () => setStatus("error"), { once: true });
    document.head.appendChild(script);
    return () => {
      cancelled = true;
    };
  }, [lat, lng, name]);

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-[#f0f4f1]">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] text-[color:var(--color-mute)]">
          {status === "error" ? "지도 불러오기 실패" : "지도 불러오는 중…"}
        </div>
      )}
      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-[#03C75A]" />
        <span className="whitespace-nowrap text-[11px] font-semibold tracking-wider text-[color:var(--color-charcoal)]">NAVER MAP</span>
      </div>
    </div>
  );
}

function Location() {
  const copyAddress = () => {
    navigator.clipboard?.writeText(data.venue.address);
  };
  const naverMapUrl =
    "https://map.naver.com/p/search/%ED%85%8C%EB%9D%BC%EB%A6%AC%EC%9B%80%20%EC%84%9C%EC%9A%B8/place/1618264201";
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="Location" title="오시는 길" />
        <NaverMap lat={data.venue.lat} lng={data.venue.lng} name={data.venue.name} />
        <a
          href={naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-[12px] tracking-wider text-[color:var(--color-rose-deep)] underline underline-offset-4"
        >
          네이버 지도에서 길찾기 →
        </a>
        <div className="mt-5 text-center">
          <p className="text-[clamp(1.05rem,4.6vw,1.35rem)] tracking-wide text-[color:var(--color-charcoal)]">{data.venue.name}</p>
          <p className="mt-2 text-[13px] text-[color:var(--color-mute)] body-kr leading-relaxed">{data.venue.address}</p>
          <p className="text-[13px] text-[color:var(--color-mute)] whitespace-nowrap">{data.venue.phone}</p>
          <button
            onClick={copyAddress}
            className="mt-3 rounded-full border border-[color:var(--color-rose)]/40 px-4 py-1.5 text-[12px] tracking-wider text-[color:var(--color-rose-deep)] whitespace-nowrap"
          >
            주소 복사
          </button>
        </div>
        <div className="mt-7 space-y-3 p-5 text-[13px] text-[color:var(--color-charcoal)]/85 body-kr">
          <div className="flex gap-3">
            <span className="min-w-[48px] text-[color:var(--color-rose-deep)] text-[13px] whitespace-nowrap">지하철</span>
            <span>{data.venue.subway}</span>
          </div>
          <div className="flex gap-3">
            <span className="min-w-[48px] text-[color:var(--color-rose-deep)] text-[13px] whitespace-nowrap">버스</span>
            <span>{data.venue.bus}</span>
          </div>
          <div className="flex gap-3">
            <span className="min-w-[48px] text-[color:var(--color-rose-deep)] text-[13px] whitespace-nowrap">주차</span>
            <div className="flex-1 space-y-2">
              <p>{data.venue.parking}</p>
              {data.venue.parkingLots && data.venue.parkingLots.length > 0 && (
                <ul className="list-disc pl-5 text-[12px] leading-relaxed text-[color:var(--color-charcoal)]/75 space-y-0.5">
                  {data.venue.parkingLots.map((lot) => (
                    <li key={lot}>{lot}</li>
                  ))}
                </ul>
              )}
              <p className="text-[12px] leading-relaxed text-[color:var(--color-mute)]">{data.venue.parkingExtra}</p>
              {data.venue.parkingTip && (
                <p className="text-[12px] leading-relaxed text-[color:var(--color-mute)]">{data.venue.parkingTip}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function Account() {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpened((o) => ({ ...o, [k]: !o[k] }));
  const Row = ({ k, role, name, account }: { k: string; role: string; name: string; account: string }) => {
    const isOpen = opened[k];
    return (
      <div>
        <button
          onClick={() => toggle(k)}
          className="flex w-full items-center justify-between rounded-2xl px-5 py-4 border-b border-[color:var(--color-rose)]/20"
        >
          <span className="text-[13px] tracking-wide">
            <span className="text-[color:var(--color-mute)]">{role}</span>
            <span className="ml-3 text-[color:var(--color-charcoal)]">{name}</span>
          </span>
          <span className="text-[color:var(--color-rose-deep)] text-lg leading-none">{isOpen ? "−" : "+"}</span>
        </button>
        {isOpen && (
          <div className="mt-1 flex items-center justify-between px-5 py-3 text-[13px]">
            <span className="text-[color:var(--color-charcoal)]">{account}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(account)}
              className="text-[12px] tracking-wider text-[color:var(--color-rose-deep)] border border-[color:var(--color-rose)]/40 rounded-full px-3 py-1 whitespace-nowrap"
            >
              복사
            </button>
          </div>
        )}
      </div>
    );
  };
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="Heart" title="마음 전하실 곳" />
        <p className="mb-8 text-center text-[13px] leading-loose text-[color:var(--color-mute)] body-kr">
          참석이 어려우신 분들을 위해
          <br />
          조심스레 계좌번호를 안내드립니다.
        </p>
        <div className="space-y-3">
          <Row k="groom" role="신랑측" name={data.groom.name} account={data.groom.account} />
          <Row k="bride" role="신부측" name={data.bride.name} account={data.bride.account} />
        </div>
      </Card>
    </section>
  );
}

function Guestbook() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<{ name: string; msg: string; ts: number }[]>([
    { name: "친구 J", msg: "두 분의 새로운 시작을 진심으로 축하합니다. 늘 따스한 봄날 같은 결혼 생활 보내세요.", ts: Date.now() - 86400000 },
  ]);
  const [open, setOpen] = useState(false);
  const submit = () => {
    if (!name.trim() || !msg.trim()) return;
    setList((l) => [{ name: name.trim(), msg: msg.trim(), ts: Date.now() }, ...l]);
    setName("");
    setMsg("");
    setOpen(false);
  };
  const fmt = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="Guestbook" title="방명록" />
        <p className="mb-6 text-center text-[13px] text-[color:var(--color-mute)] leading-loose body-kr">
          따뜻한 마음 한 줄 남겨주시면
          <br />
          오래도록 간직하겠습니다.
        </p>

        <div className="space-y-4">
          {list.map((g, i) => (
            <div
              key={i}
              className="relative px-5 pt-6 pb-5 border-t border-[color:var(--color-rose)]/20"
            >
              <div className="absolute -top-2 left-5 inline-flex items-center gap-1.5 bg-[color:var(--color-blush)] rounded-full px-3 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-rose-deep)]" />
                <span className="text-[11px] tracking-widest text-[color:var(--color-rose-deep)] whitespace-nowrap">{g.name}</span>
              </div>
              <p className="mt-2 text-[14px] leading-[2] text-[color:var(--color-charcoal)]/85 whitespace-pre-line body-kr">
                {g.msg}
              </p>
              <p className="mt-3 text-right text-[11px] tracking-widest text-[color:var(--color-mute)] whitespace-nowrap">{fmt(g.ts)}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="mt-7 mx-auto block rounded-full border border-[color:var(--color-rose)]/40 px-6 py-2.5 text-[12px] tracking-[0.22em] text-[color:var(--color-rose-deep)] whitespace-nowrap"
        >
          + 메시지 남기기
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-6 sm:pb-0">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <p className="eyebrow text-center">Leave a Note</p>
              <h3 className="mt-2 mb-5 text-center text-lg text-[color:var(--color-charcoal)]">축하 메시지</h3>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                className="w-full px-0 py-2 mb-3 bg-transparent border-0 border-b border-[color:var(--color-line)] text-[14px] focus:outline-none focus:border-[color:var(--color-rose-deep)]"
              />
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="축하 메시지를 남겨주세요"
                rows={4}
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-[color:var(--color-line)] text-[14px] resize-none focus:outline-none focus:border-[color:var(--color-rose-deep)]"
              />
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="py-3 rounded-xl border border-[color:var(--color-line)] text-[13px] tracking-widest text-[color:var(--color-mute)]"
                >
                  취소
                </button>
                <button
                  onClick={submit}
                  className="py-3 rounded-xl bg-[color:var(--color-rose-deep)] text-white text-[13px] tracking-widest"
                >
                  남기기
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

function Share() {
  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "우리 결혼합니다", url: window.location.href });
      } catch {
        /* noop */
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      alert("링크를 복사했습니다");
    }
  };
  return (
    <section className="px-5 py-14 pb-28 bg-white">
      <FlowerDivider />
      <div className="text-center">
        <p className="eyebrow">Thank You</p>
        <p className="mt-4 text-[clamp(1.2rem,5.4vw,1.6rem)] text-[color:var(--color-charcoal)] whitespace-nowrap">
          {data.groom.nameEn} &amp; {data.bride.nameEn}
        </p>
        <button
          onClick={share}
          className="mx-auto mt-8 block rounded-full bg-[color:var(--color-rose-deep)] px-7 py-3 text-[12px] tracking-[0.28em] text-white whitespace-nowrap"
        >
          SHARE
        </button>
        <p className="mt-10 label-caps text-[color:var(--color-mute)]">MADE WITH LOVE</p>
      </div>
    </section>
  );
}

// ─── 랜딩 ───
// 첫 진입 시 청첩장/게임 분기를 선택하는 단순한 표지화면
function Landing({ onPickInvitation, onPickGame }: { onPickInvitation: () => void; onPickGame: () => void }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[color:var(--color-blush)] via-white to-white px-6 text-center">
      <div className="fade-in flex w-full max-w-[22rem] flex-col items-center">
        <p className="eyebrow mb-4">Wedding Day</p>
        <h1 className="text-[clamp(1.3rem,6vw,1.9rem)] leading-[1.2] text-[color:var(--color-charcoal)] text-center">
          <span className="block break-words">{data.groom.nameEn}</span>
          <span className="my-1 block italic text-[0.75em] text-[color:var(--color-rose-deep)]">&amp;</span>
          <span className="block break-words">{data.bride.nameEn}</span>
        </h1>
        <p className="mt-3 text-[clamp(12px,3.6vw,14px)] tracking-[0.2em] text-[color:var(--color-mute)]">
          2026. 11. 15 · SUN · 14:00
        </p>
        <p className="mt-1 text-[clamp(11px,3.2vw,13px)] tracking-[0.16em] text-[color:var(--color-mute)]">
          {data.venue.name}
        </p>

        <FlowerDivider />

        <button
          type="button"
          onClick={onPickInvitation}
          className="w-full max-w-xs rounded-full bg-[color:var(--color-rose-deep)] px-6 py-4 text-[clamp(14px,4vw,16px)] font-medium tracking-[0.18em] text-white shadow-md active:scale-[0.98] transition"
        >
          📬 청첩장 바로보기
        </button>
        <button
          type="button"
          onClick={onPickGame}
          className="mt-3 w-full max-w-xs rounded-full border border-[color:var(--color-rose)]/50 bg-white/60 px-6 py-3 text-[clamp(12px,3.6vw,14px)] tracking-[0.16em] text-[color:var(--color-rose-deep)] active:scale-[0.98] transition"
        >
          🎮 미니게임 하고 선물 받기
        </button>
        <p className="mt-3 text-[11px] tracking-widest text-[color:var(--color-mute)] whitespace-nowrap">
          ※ 게임 1~3등 소정의 선물 증정
        </p>
      </div>
      <div className="absolute bottom-6 label-caps text-[color:var(--color-mute)]">SCROLL OR TAP</div>
    </section>
  );
}

// ─── 게임 단독 뷰 ───
// 랜딩 → 게임 선택 시 게임만 보여주고, 클리어/오버 후 자동으로 청첩장 본문으로 전환
function GameStage({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <section className="relative min-h-[100svh] bg-white">
      <div className="flex items-center justify-between px-5 pt-5">
        <p className="eyebrow">Wedding Quest</p>
        <button
          type="button"
          onClick={onSkip}
          className="text-[11px] tracking-widest text-[color:var(--color-mute)] underline underline-offset-4 whitespace-nowrap"
        >
          청첩장 바로보기 →
        </button>
      </div>
      <WeddingRunner onComplete={onComplete} />
    </section>
  );
}

type View = "landing" | "game" | "invitation";

export default function Home() {
  const [fontKey, setFontKey] = useState("gowun-batang");
  const [view, setView] = useState<View>("landing");
  const [transitioning, setTransitioning] = useState(false);
  const fontVar = useMemo(
    () => FONTS.find((f) => f.key === fontKey)?.cssVar ?? "var(--font-gowun-batang)",
    [fontKey],
  );

  // 게임 종료 → 페이드아웃 후 청첩장 전환
  const handleGameComplete = useCallback(() => {
    setTransitioning(true);
    window.setTimeout(() => {
      setView("invitation");
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 600);
  }, []);

  return (
    <main className="invitation" style={{ fontFamily: fontVar } as React.CSSProperties}>
      <div className={transitioning ? "fade-out" : "fade-in"} key={view}>
        {view === "landing" && (
          <Landing
            onPickInvitation={() => setView("invitation")}
            onPickGame={() => setView("game")}
          />
        )}
        {view === "game" && (
          <GameStage
            onComplete={handleGameComplete}
            onSkip={() => setView("invitation")}
          />
        )}
        {view === "invitation" && (
          <>
            <Hero />
            <Greeting />
            <Couple />
            <Countdown />
            <Calendar />
            <Gallery />
            <Location />
            <Account />
            <Guestbook />
            <Share />
          </>
        )}
      </div>
      <FontToggle value={fontKey} onChange={setFontKey} />
    </main>
  );
}
