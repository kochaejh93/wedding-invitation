"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// 더미 데이터 — 마스터 정보 받으면 교체
const data = {
  groom: { name: "채종현", nameEn: "Jonghyun Chae", father: "채승우", mother: "김미경", phone: "010-0000-0000", account: "신한은행 110-000-000000" },
  bride: { name: "최수빈", nameEn: "Subin Choi", father: "최원영", mother: "김영미", phone: "010-0000-0000", account: "국민은행 000-00-0000-000" },
  date: "2026-11-15T14:00:00+09:00",
  dateLabel: "2026년 11월 15일 일요일 오후 2시",
  venue: {
    name: "테라리움 서울",
    address: "서울특별시 노원구 노원로 247 서울온천 7~8층",
    subway: "7호선 하계역 1번 출구 도보 7분",
    bus: "하계역·서울온천 정류장 (146·1224·1226·1227·1132)",
    parking: "건물 주차장 700대 · 무료 2시간",
    parkingExtra: "본 건물 만차 시 인근 대진고등학교 주차장(도보 5분)",
    phone: "02-6316-7700",
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
          <div className="text-[20px] tracking-[0.3em] uppercase text-[color:var(--color-rose-deep)] px-3 py-2 border-b border-[color:var(--color-line)]">Font</div>
          {FONTS.map((f) => (
            <button
              key={f.key}
              onClick={() => onChange(f.key)}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                value === f.key ? "bg-[color:var(--color-blush)]" : "hover:bg-[color:var(--color-blush)]/60"
              }`}
              style={{ fontFamily: f.cssVar }}
            >
              <span className="text-base text-[color:var(--color-charcoal)]">우리 결혼합니다</span>
              <span className="text-[20px] text-[color:var(--color-mute)] ml-2">{f.category}</span>
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
      <div className="fade-in">
        <p className="eyebrow mb-6">We Invite You</p>
        <h1 className="text-[2.4rem] leading-tight text-[color:var(--color-charcoal)]">{data.groom.nameEn}</h1>
        <p className="my-3 italic text-base text-[color:var(--color-rose-deep)]">&amp;</p>
        <h1 className="text-[2.4rem] leading-tight text-[color:var(--color-charcoal)]">{data.bride.nameEn}</h1>
        <FlowerDivider />
        <p className="mt-2 text-sm tracking-[0.25em] text-[color:var(--color-mute)]">2026. 11. 15 · 일</p>
        <p className="mt-2 text-xs tracking-[0.2em] text-[color:var(--color-mute)]">{data.venue.name}</p>
      </div>
      <div className="absolute bottom-8 text-[20px] tracking-[0.4em] text-[color:var(--color-mute)] animate-pulse">SCROLL</div>
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
      <p className="mt-3 text-2xl text-[color:var(--color-charcoal)]">{p.nameEn}</p>
      <p className="mt-1 text-base text-[color:var(--color-charcoal)]">{p.name}</p>
      <p className="mt-2 text-xs text-[color:var(--color-mute)]">
        {p.father} · {p.mother}
      </p>
      <a
        href={`tel:${p.phone}`}
        className="mt-3 inline-block text-[18px] tracking-widest text-[color:var(--color-rose-deep)] border border-[color:var(--color-rose)]/40 rounded-full px-3 py-1"
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
              <div className="text-[1.6rem] text-[color:var(--color-rose-deep)] tabular-nums">{String(i.v).padStart(2, "0")}</div>
              <div className="mt-1 text-[18px] tracking-[0.25em] text-[color:var(--color-mute)]">{i.l}</div>
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
          <p className="text-center tracking-[0.2em] text-[color:var(--color-rose-deep)]">
            {monthName} · {year}
          </p>
          <div className="mt-4 grid grid-cols-7 text-center text-[22px] tracking-widest text-[color:var(--color-mute)]">
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
      <p className="mt-4 text-center text-[18px] text-[color:var(--color-mute)]">사진 자리 — 마스터 사진 받으면 교체</p>
    </section>
  );
}

function Location() {
  const copyAddress = () => {
    navigator.clipboard?.writeText(data.venue.address);
  };
  const naverMapUrl =
    "https://map.naver.com/p/search/%ED%85%8C%EB%9D%BC%EB%A6%AC%EC%9B%80%20%EC%84%9C%EC%9A%B8/place/1618264201?c=15.00,0,0,0,dh&placePath=/home?bk_query=%ED%85%8C%EB%9D%BC%EB%A6%AC%EC%9B%80%20%EC%84%9C%EC%9A%B8&entry=bmp&from=map&fromPanelNum=2&locale=ko&svcName=map_pcv5&searchText=%ED%85%8C%EB%9D%BC%EB%A6%AC%EC%9B%80%20%EC%84%9C%EC%9A%B8";
  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="Location" title="오시는 길" />
        <a
          href={naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-2xl"
        >
          <div
            className="relative h-56 w-full"
            style={{
              background:
                "linear-gradient(135deg, #f0f7f0 0%, #e3efe0 40%, #eef2f6 100%)",
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 600 224"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <g stroke="#d7e2d4" strokeWidth="1.2" fill="none" opacity="0.8">
                <path d="M0 56 L600 56" />
                <path d="M0 112 L600 112" />
                <path d="M0 168 L600 168" />
                <path d="M120 0 L120 224" />
                <path d="M260 0 L260 224" />
                <path d="M400 0 L400 224" />
                <path d="M520 0 L520 224" />
              </g>
              <path
                d="M0 140 Q120 128 260 148 T520 132 T600 138"
                stroke="#c6d6cc"
                strokeWidth="14"
                fill="none"
                opacity="0.55"
              />
              <path
                d="M70 0 L140 110 L80 224"
                stroke="#e6d8c9"
                strokeWidth="10"
                fill="none"
                opacity="0.6"
              />
              <circle cx="300" cy="112" r="60" fill="#ffffff" opacity="0.4" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <svg width="46" height="60" viewBox="0 0 46 60" aria-hidden="true">
                <path
                  d="M23 2 C11 2 2 11 2 23 C2 37 19 54 23 58 C27 54 44 37 44 23 C44 11 35 2 23 2 Z"
                  fill="#03C75A"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle cx="23" cy="22" r="7" fill="#ffffff" />
              </svg>
            </div>
            <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[#03C75A]" />
              <span className="text-[13px] font-semibold tracking-wider text-[color:var(--color-charcoal)]">NAVER MAP</span>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/95 px-3 py-1 text-[12px] font-medium tracking-wider text-[color:var(--color-charcoal)] shadow-sm">
              {data.venue.name}
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-[color:var(--color-rose-deep)] px-3 py-1.5 text-[12px] tracking-widest text-white transition group-hover:bg-[color:var(--color-charcoal)]">
              네이버 지도 열기 →
            </div>
          </div>
        </a>
        <div className="mt-5 text-center">
          <p className="text-xl tracking-wide text-[color:var(--color-charcoal)]">{data.venue.name}</p>
          <p className="mt-2 text-[13px] text-[color:var(--color-mute)]">{data.venue.address}</p>
          <p className="text-[13px] text-[color:var(--color-mute)]">{data.venue.phone}</p>
          <button
            onClick={copyAddress}
            className="mt-3 rounded-full border border-[color:var(--color-rose)]/40 px-4 py-1.5 text-[18px] tracking-widest text-[color:var(--color-rose-deep)]"
          >
            주소 복사
          </button>
        </div>
        <div className="mt-7 space-y-3 p-5 text-[13px] text-[color:var(--color-charcoal)]/85">
          <div className="flex gap-3">
            <span className="min-w-[56px] text-[color:var(--color-rose-deep)] text-[14px]">지하철</span>
            <span>{data.venue.subway}</span>
          </div>
          <div className="flex gap-3">
            <span className="min-w-[56px] text-[color:var(--color-rose-deep)] text-[14px]">버스</span>
            <span>{data.venue.bus}</span>
          </div>
          <div className="flex gap-3">
            <span className="min-w-[56px] text-[color:var(--color-rose-deep)] text-[14px]">주차</span>
            <span>
              {data.venue.parking}
              <br />
              <span className="text-[12px] text-[color:var(--color-mute)]">{data.venue.parkingExtra}</span>
            </span>
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
              className="text-[18px] tracking-widest text-[color:var(--color-rose-deep)] border border-[color:var(--color-rose)]/40 rounded-full px-3 py-1"
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
        <p className="mb-8 text-center text-[13px] leading-loose text-[color:var(--color-mute)]">
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
        <p className="mb-6 text-center text-[13px] text-[color:var(--color-mute)] leading-loose">
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
                <span className="text-[11px] tracking-widest text-[color:var(--color-rose-deep)]">{g.name}</span>
              </div>
              <p className="mt-2 text-[14px] leading-[2] text-[color:var(--color-charcoal)]/85 whitespace-pre-line">
                {g.msg}
              </p>
              <p className="mt-3 text-right text-[11px] tracking-widest text-[color:var(--color-mute)]">{fmt(g.ts)}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="mt-7 mx-auto block rounded-full border border-[color:var(--color-rose)]/40 px-6 py-2.5 text-[13px] tracking-[0.25em] text-[color:var(--color-rose-deep)]"
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

// 횡스크롤 플랫포머 — 신랑이 결혼식장까지 달린다
type GameState = "idle" | "playing" | "cleared" | "over";

type EntKind = "ring" | "heart" | "champagne" | "envelope" | "cake" | "bench";

type Ent = {
  kind: EntKind;
  x: number;
  y: number;
  collected?: boolean;
};

const GAME_W = 480;
const GAME_H = 260;
const GROUND_Y = 210;
const PLAYER_X = 80;
const PLAYER_W = 18;
const PLAYER_H = 34;
const JUMP_V = -420;
const GRAVITY = 1200;

function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>("idle");
  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [remain, setRemain] = useState(60);
  const [lives, setLives] = useState(3);

  const playerYRef = useRef(GROUND_Y);
  const vyRef = useRef(0);
  const onGroundRef = useRef(true);
  const animFrameRef = useRef(0);
  const animTimerRef = useRef(0);
  const entsRef = useRef<Ent[]>([]);
  const spawnTimerRef = useRef(0.8);
  const scrollRef = useRef(0);
  const speedRef = useRef(160);
  const scoreRef = useRef(0);
  const invincibleRef = useRef(0);
  const timeLeftRef = useRef(60);
  const livesRef = useRef(3);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wedding_runner_best_v2");
      if (raw) setBest(parseInt(raw, 10) || 0);
    } catch {}
  }, []);

  // idle 화면: 배경 + 신랑 프리뷰
  useEffect(() => {
    if (state === "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawBackground(ctx, 0);
    drawGround(ctx, 0);
    drawChapel(ctx, GAME_W - 110, 0);
    drawGroomPixel(ctx, PLAYER_X, GROUND_Y, 0);
  }, [state]);

  const syncState = useCallback((s: GameState) => {
    stateRef.current = s;
    setState(s);
  }, []);

  const reset = useCallback(() => {
    entsRef.current = [];
    spawnTimerRef.current = 1.2;
    scrollRef.current = 0;
    speedRef.current = 160;
    scoreRef.current = 0;
    timeLeftRef.current = 60;
    livesRef.current = 3;
    invincibleRef.current = 0;
    playerYRef.current = GROUND_Y;
    vyRef.current = 0;
    onGroundRef.current = true;
    lastTsRef.current = null;
    animFrameRef.current = 0;
    animTimerRef.current = 0;
    setScore(0);
    setRemain(60);
    setLives(3);
  }, []);

  const endGame = useCallback(
    (final: GameState) => {
      syncState(final);
      try {
        if (scoreRef.current > best) {
          setBest(scoreRef.current);
          localStorage.setItem("wedding_runner_best_v2", String(scoreRef.current));
        }
      } catch {}
    },
    [best, syncState],
  );

  const start = useCallback(() => {
    reset();
    syncState("playing");
  }, [reset, syncState]);

  const jump = useCallback(() => {
    if (stateRef.current !== "playing") return;
    if (!onGroundRef.current) return;
    vyRef.current = JUMP_V;
    onGroundRef.current = false;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    if (state !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (ts: number) => {
      if (stateRef.current !== "playing") return;
      const last = lastTsRef.current ?? ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      lastTsRef.current = ts;

      timeLeftRef.current -= dt;
      if (timeLeftRef.current <= 0) {
        scoreRef.current += 500;
        setScore(scoreRef.current);
        setRemain(0);
        endGame("cleared");
        return;
      }
      setRemain(Math.max(0, Math.ceil(timeLeftRef.current)));

      if (invincibleRef.current > 0) invincibleRef.current -= dt;

      // 시간 지남에 따라 가속
      speedRef.current = Math.min(280, speedRef.current + 3 * dt);

      // 점프 물리
      vyRef.current += GRAVITY * dt;
      playerYRef.current += vyRef.current * dt;
      if (playerYRef.current >= GROUND_Y) {
        playerYRef.current = GROUND_Y;
        vyRef.current = 0;
        onGroundRef.current = true;
      }

      // 달리기 애니메이션
      if (onGroundRef.current) {
        animTimerRef.current += dt;
        if (animTimerRef.current > 0.11) {
          animTimerRef.current = 0;
          animFrameRef.current = 1 - animFrameRef.current;
        }
      }

      scrollRef.current += speedRef.current * dt;

      // 엔티티 스폰
      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        spawnTimerRef.current = 0.75 + Math.random() * 0.55;
        const r = Math.random();
        let kind: EntKind;
        if (r < 0.22) kind = "ring";
        else if (r < 0.4) kind = "heart";
        else if (r < 0.48) kind = "champagne";
        else if (r < 0.7) kind = "envelope";
        else if (r < 0.88) kind = "cake";
        else kind = "bench";

        let ey = GROUND_Y;
        if (kind === "ring" || kind === "heart" || kind === "champagne") {
          ey = GROUND_Y - 55 - Math.random() * 35;
        }
        entsRef.current.push({ kind, x: GAME_W + 30, y: ey });
      }

      // 업데이트 + 충돌
      const survivors: Ent[] = [];
      const px = PLAYER_X;
      const pyCenter = playerYRef.current - PLAYER_H / 2;
      for (const e of entsRef.current) {
        e.x -= speedRef.current * dt;
        if (e.x < -60) continue;

        if (!e.collected) {
          let hitR = 18;
          let ecy = e.y;
          if (e.kind === "envelope" || e.kind === "bench") {
            ecy = e.y - 10;
            hitR = 16;
          } else if (e.kind === "cake") {
            ecy = e.y - 18;
            hitR = 22;
          }
          const dx = Math.abs(e.x - px);
          const dy = Math.abs(ecy - pyCenter);
          const hit = dx < hitR && dy < hitR + 6;

          if (hit) {
            if (e.kind === "ring") {
              scoreRef.current += 100;
              e.collected = true;
              setScore(scoreRef.current);
            } else if (e.kind === "heart") {
              scoreRef.current += 50;
              e.collected = true;
              setScore(scoreRef.current);
            } else if (e.kind === "champagne") {
              scoreRef.current += 150;
              invincibleRef.current = 3;
              e.collected = true;
              setScore(scoreRef.current);
            } else if (e.kind === "envelope" || e.kind === "bench" || e.kind === "cake") {
              if (invincibleRef.current <= 0) {
                livesRef.current -= 1;
                invincibleRef.current = 1.2;
                scoreRef.current = Math.max(0, scoreRef.current - 50);
                setScore(scoreRef.current);
                setLives(livesRef.current);
                e.collected = true;
                if (livesRef.current <= 0) {
                  endGame("over");
                  return;
                }
              }
            }
            continue;
          }
        }
        survivors.push(e);
      }
      entsRef.current = survivors;

      // 렌더
      drawBackground(ctx, scrollRef.current);
      drawGround(ctx, scrollRef.current);

      // 멀리 보이는 예식장 (골인 지점 느낌)
      const chapelX = GAME_W - 110 + Math.sin(scrollRef.current * 0.003) * 4;
      drawChapel(ctx, chapelX, scrollRef.current);

      for (const e of entsRef.current) drawEntity(ctx, e);

      const blink = invincibleRef.current > 0 && Math.floor(ts / 70) % 2 === 0;
      if (!blink) drawGroomPixel(ctx, px, playerYRef.current, animFrameRef.current);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, endGame]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (stateRef.current !== "playing") return;
    e.preventDefault();
    jump();
  };

  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="Mini Game" title="웨딩 러너" />
        <p className="mb-5 text-center text-[13px] text-[color:var(--color-mute)] leading-loose">
          신랑이 예식장을 향해 달립니다.
          <br />
          탭 또는 스페이스로 점프해 장애물을 피하고 반지 · 하트 · 샴페인을 모아주세요.
        </p>

        <div className="mx-auto max-w-[480px]">
          <div className="mb-3 flex items-center justify-between text-[12px] tracking-widest text-[color:var(--color-mute)]">
            <span>
              SCORE <b className="ml-1 text-[color:var(--color-rose-deep)] text-base">{score}</b>
            </span>
            <span>
              TIME <b className="ml-1 text-[color:var(--color-rose-deep)] text-base">{remain}</b>
            </span>
            <span>
              LIFE <b className="ml-1 text-[color:var(--color-rose-deep)] text-base">{"♥".repeat(Math.max(0, lives))}</b>
            </span>
            <span>
              BEST <b className="ml-1 text-[color:var(--color-charcoal)] text-base">{best}</b>
            </span>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-[color:var(--color-rose)]/25 bg-[#fdfbf7]"
            style={{ touchAction: state === "playing" ? "none" : "auto", imageRendering: "pixelated" }}
            onTouchStart={onTouchStart}
          >
            <canvas
              ref={canvasRef}
              width={GAME_W}
              height={GAME_H}
              className="block w-full h-auto select-none"
              style={{ imageRendering: "pixelated" }}
            />

            {state === "idle" && (
              <GameOverlay
                title="Wedding Runner"
                description="탭 또는 스페이스로 점프!"
                btn="시작하기"
                onClick={start}
              />
            )}
            {state === "cleared" && (
              <GameOverlay
                title="결혼했다! 🎉"
                description={`60초 완주 · 보너스 +500\n최종 점수 ${score}`}
                btn="다시 하기"
                onClick={start}
              />
            )}
            {state === "over" && (
              <GameOverlay
                title="GAME OVER"
                description={`최종 점수 ${score}`}
                btn="다시 하기"
                onClick={start}
              />
            )}
          </div>

          <div className="mt-3 sm:hidden">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                jump();
              }}
              className="w-full py-4 rounded-xl border border-[color:var(--color-rose)]/30 text-[color:var(--color-rose-deep)] tracking-[0.3em] text-[13px]"
            >
              ↑ JUMP
            </button>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-1 text-[11px] tracking-wide text-[color:var(--color-mute)] text-center">
            <LegendDot color="#e89378" label="반지 +100" />
            <LegendDot color="#f0a3a3" label="하트 +50" />
            <LegendDot color="#d4b876" label="샴페인 +150" />
            <LegendDot color="#b29c91" label="봉투 −HP" />
            <LegendDot color="#8a5a4f" label="케이크 −HP" />
          </div>
        </div>
      </Card>
    </section>
  );
}

// ─── 픽셀 아트 스프라이트 ────────────────────────────────
function drawGroomPixel(ctx: CanvasRenderingContext2D, cx: number, footY: number, frame: number) {
  const s = 2; // 픽셀 스케일
  const ox = Math.round(cx - 8);
  const oy = Math.round(footY - 17 * s);

  const rect = (col: number, row: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(ox + col * s, oy + row * s, w * s, h * s);
  };

  const HAIR = "#2b1810";
  const SKIN = "#f9d3b4";
  const CHEEK = "#f0a3a3";
  const EYE = "#2b1810";
  const SUIT = "#2b2824";
  const SHIRT = "#ffffff";
  const BOW = "#e89378";
  const PANTS = "#1a1715";
  const SHOE = "#0a0807";

  // 머리
  rect(2, 0, 4, 1, HAIR);
  rect(1, 1, 6, 1, HAIR);
  // 얼굴
  rect(1, 2, 6, 1, SKIN);
  rect(1, 2, 6, 1, SKIN);
  rect(2, 3, 4, 1, SKIN);
  rect(1, 4, 6, 1, SKIN);
  // 눈
  rect(2, 3, 1, 1, EYE);
  rect(5, 3, 1, 1, EYE);
  // 볼
  rect(1, 4, 1, 1, CHEEK);
  rect(6, 4, 1, 1, CHEEK);
  // 턱
  rect(2, 5, 4, 1, SKIN);
  // 어깨 + 턱시도
  rect(0, 6, 8, 1, SUIT);
  rect(0, 7, 2, 4, SUIT); // 왼쪽 옷깃
  rect(6, 7, 2, 4, SUIT); // 오른쪽 옷깃
  rect(2, 7, 4, 4, SHIRT); // 셔츠
  rect(3, 7, 2, 1, BOW); // 나비넥타이
  // 허리
  rect(0, 11, 8, 1, SUIT);
  // 다리
  if (frame === 0) {
    rect(1, 12, 2, 3, PANTS);
    rect(5, 12, 2, 3, PANTS);
    rect(1, 15, 3, 1, SHOE);
    rect(4, 15, 3, 1, SHOE);
  } else {
    rect(2, 12, 2, 3, PANTS);
    rect(4, 12, 2, 3, PANTS);
    rect(2, 15, 3, 1, SHOE);
    rect(3, 15, 3, 1, SHOE);
  }
}

function drawChapel(ctx: CanvasRenderingContext2D, x: number, scroll: number) {
  // 배경 예식장 (골인 지점 이미지)
  const y = GROUND_Y - 80;
  const parallax = Math.sin(scroll * 0.004) * 2;
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(x - 40, y + 20 + parallax, 80, 60);
  // 지붕
  ctx.fillStyle = "#e89378";
  ctx.beginPath();
  ctx.moveTo(x - 45, y + 20 + parallax);
  ctx.lineTo(x, y - 10 + parallax);
  ctx.lineTo(x + 45, y + 20 + parallax);
  ctx.closePath();
  ctx.fill();
  // 십자 장식
  ctx.fillStyle = "#c97a62";
  ctx.fillRect(x - 2, y - 22 + parallax, 4, 14);
  ctx.fillRect(x - 6, y - 18 + parallax, 12, 3);
  // 문
  ctx.fillStyle = "#8a5a4f";
  ctx.fillRect(x - 10, y + 50 + parallax, 20, 30);
  ctx.fillStyle = "#d4b876";
  ctx.fillRect(x - 1, y + 55 + parallax, 2, 6);
  // 창문
  ctx.fillStyle = "#d4b876";
  ctx.fillRect(x - 28, y + 35 + parallax, 10, 12);
  ctx.fillRect(x + 18, y + 35 + parallax, 10, 12);
}

function drawBackground(ctx: CanvasRenderingContext2D, scroll: number) {
  // 하늘 그라디언트
  const g = ctx.createLinearGradient(0, 0, 0, GAME_H);
  g.addColorStop(0, "#ffe4d6");
  g.addColorStop(0.6, "#fff5ec");
  g.addColorStop(1, "#fdfbf7");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // 태양
  ctx.fillStyle = "rgba(255, 230, 200, 0.9)";
  ctx.beginPath();
  ctx.arc(GAME_W - 60, 50, 22, 0, Math.PI * 2);
  ctx.fill();

  // 구름 (느린 패럴랙스)
  const cs = scroll * 0.2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  for (let i = 0; i < 5; i++) {
    const seed = i * 157 + 40;
    const baseX = ((seed - cs) % (GAME_W + 80) + GAME_W + 80) % (GAME_W + 80) - 40;
    const cy = 28 + (i % 3) * 20;
    ctx.beginPath();
    ctx.arc(baseX, cy, 12, 0, Math.PI * 2);
    ctx.arc(baseX + 12, cy + 3, 10, 0, Math.PI * 2);
    ctx.arc(baseX - 12, cy + 3, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 먼 언덕
  const hs = scroll * 0.5;
  ctx.fillStyle = "rgba(232, 147, 120, 0.25)";
  for (let i = 0; i < 6; i++) {
    const seed = i * 110;
    const baseX = ((seed - hs) % (GAME_W + 140) + GAME_W + 140) % (GAME_W + 140) - 70;
    ctx.beginPath();
    ctx.arc(baseX, GROUND_Y + 15, 55, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  // 가까운 꽃/나무 실루엣
  const ts = scroll * 0.85;
  for (let i = 0; i < 8; i++) {
    const seed = i * 78 + 10;
    const baseX = ((seed - ts) % (GAME_W + 60) + GAME_W + 60) % (GAME_W + 60) - 30;
    // 나무
    ctx.fillStyle = "rgba(138, 90, 79, 0.35)";
    ctx.fillRect(baseX - 2, GROUND_Y - 18, 4, 18);
    ctx.fillStyle = "rgba(240, 163, 163, 0.6)";
    ctx.beginPath();
    ctx.arc(baseX, GROUND_Y - 22, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround(ctx: CanvasRenderingContext2D, scroll: number) {
  // 지면
  ctx.fillStyle = "#f5d4c4";
  ctx.fillRect(0, GROUND_Y + 2, GAME_W, GAME_H - GROUND_Y - 2);
  // 경계선
  ctx.fillStyle = "#e89378";
  ctx.fillRect(0, GROUND_Y + 2, GAME_W, 2);
  // 타일 점 (스크롤 효과)
  ctx.fillStyle = "rgba(201, 122, 98, 0.5)";
  const step = 24;
  const offset = scroll % step;
  for (let x = -offset; x < GAME_W; x += step) {
    ctx.fillRect(x, GROUND_Y + 10, 6, 2);
    ctx.fillRect(x + 12, GROUND_Y + 22, 4, 2);
  }
}

function drawEntity(ctx: CanvasRenderingContext2D, e: Ent) {
  if (e.collected) return;
  const x = e.x;
  const y = e.y;

  if (e.kind === "ring") {
    // 금반지 + 다이아
    ctx.strokeStyle = "#e89378";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(x, y - 14);
    ctx.lineTo(x + 4, y - 9);
    ctx.lineTo(x, y - 4);
    ctx.lineTo(x - 4, y - 9);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#d4b876";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (e.kind === "heart") {
    drawHeart(ctx, x, y, 10, "#f0a3a3");
  } else if (e.kind === "champagne") {
    ctx.fillStyle = "#d4b876";
    ctx.fillRect(x - 4, y - 12, 8, 18);
    ctx.fillStyle = "#8a5a4f";
    ctx.fillRect(x - 3, y - 16, 6, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 4, y - 6, 8, 3);
    ctx.fillStyle = "#e89378";
    ctx.beginPath();
    ctx.arc(x, y - 18, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (e.kind === "envelope") {
    // 축의금 봉투 (바닥 장애물)
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(x - 14, y - 18, 28, 18);
    ctx.strokeStyle = "#e89378";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 14, y - 18, 28, 18);
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 18);
    ctx.lineTo(x, y - 6);
    ctx.lineTo(x + 14, y - 18);
    ctx.stroke();
    drawHeart(ctx, x, y - 10, 3.5, "#e89378");
  } else if (e.kind === "bench") {
    // 교회 벤치 (낮은 장애물)
    ctx.fillStyle = "#8a5a4f";
    ctx.fillRect(x - 18, y - 16, 36, 5);
    ctx.fillRect(x - 16, y - 11, 2, 11);
    ctx.fillRect(x + 14, y - 11, 2, 11);
  } else if (e.kind === "cake") {
    // 3단 웨딩 케이크 (큰 장애물 — 높이 점프 필요)
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(x - 16, y - 12, 32, 12);
    ctx.fillRect(x - 12, y - 22, 24, 10);
    ctx.fillRect(x - 8, y - 32, 16, 10);
    ctx.fillStyle = "#f0a3a3";
    ctx.fillRect(x - 16, y - 8, 32, 2);
    ctx.fillRect(x - 12, y - 18, 24, 2);
    ctx.fillRect(x - 8, y - 28, 16, 2);
    // 장식
    ctx.fillStyle = "#e89378";
    ctx.beginPath();
    ctx.arc(x, y - 36, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function GameOverlay({
  title,
  description,
  btn,
  onClick,
}: {
  title: string;
  description: string;
  btn: string;
  onClick: () => void;
}) {
  const handle = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[color:var(--color-blush)]/90 backdrop-blur-sm text-center px-6"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      style={{ touchAction: "auto" }}
    >
      <p className="text-lg text-[color:var(--color-charcoal)]">{title}</p>
      <p className="text-[13px] leading-relaxed text-[color:var(--color-charcoal)]/75 whitespace-pre-line">
        {description}
      </p>
      <button
        type="button"
        onClick={handle}
        onTouchEnd={handle}
        className="rounded-full bg-[color:var(--color-rose-deep)] px-8 py-3 text-[13px] tracking-[0.3em] text-white shadow-md active:scale-95"
      >
        {btn}
      </button>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.6);
  ctx.bezierCurveTo(cx + s * 1.2, cy + s * 0.2, cx + s * 0.9, cy - s * 0.9, cx, cy - s * 0.2);
  ctx.bezierCurveTo(cx - s * 0.9, cy - s * 0.9, cx - s * 1.2, cy + s * 0.2, cx, cy + s * 0.6);
  ctx.fill();
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
        <p className="mt-4 text-2xl text-[color:var(--color-charcoal)]">
          {data.groom.nameEn} &amp; {data.bride.nameEn}
        </p>
        <button
          onClick={share}
          className="mx-auto mt-8 block rounded-full bg-[color:var(--color-rose-deep)] px-7 py-3 text-[12px] tracking-[0.3em] text-white"
        >
          SHARE
        </button>
        <p className="mt-10 text-[18px] tracking-[0.3em] text-[color:var(--color-mute)]">MADE WITH LOVE</p>
      </div>
    </section>
  );
}

export default function Home() {
  const [fontKey, setFontKey] = useState("gowun-batang");
  const fontVar = useMemo(
    () => FONTS.find((f) => f.key === fontKey)?.cssVar ?? "var(--font-gowun-batang)",
    [fontKey],
  );
  return (
    <main className="invitation" style={{ fontFamily: fontVar } as React.CSSProperties}>
      <Hero />
      <Greeting />
      <Couple />
      <Countdown />
      <Calendar />
      <Gallery />
      <Location />
      <MiniGame />
      <Account />
      <Guestbook />
      <Share />
      <FontToggle value={fontKey} onChange={setFontKey} />
    </main>
  );
}
