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
          <div className="relative h-56 w-full">
            <img
              src="https://staticmap.openstreetmap.de/staticmap.php?center=37.6372,127.0694&zoom=16&size=600x256&markers=37.6372,127.0694,red"
              alt={`${data.venue.name} 지도`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-blush-soft)]/95 px-3 py-1.5 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[#03C75A]" />
              <span className="text-[18px] font-semibold tracking-wider text-[color:var(--color-charcoal)]">NAVER MAP</span>
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-[color:var(--color-rose-deep)] px-3 py-1.5 text-[18px] tracking-widest text-white transition group-hover:bg-[color:var(--color-charcoal)]">
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

type GameState = "idle" | "playing" | "cleared" | "over";

type Entity = {
  lane: 0 | 1 | 2;
  y: number;
  kind: "ring" | "heart" | "champagne" | "envelope" | "cake";
  vy: number;
};

const ITEM_COLOR: Record<Entity["kind"], string> = {
  ring: "#e89378",
  heart: "#f0a3a3",
  champagne: "#d4b876",
  envelope: "#b29c91",
  cake: "#8a5a4f",
};

function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>("idle");
  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [remain, setRemain] = useState(60);

  const W = 320;
  const H = 420;
  const LANE_W = W / 3;
  const PLAYER_Y = H - 70;

  const laneRef = useRef<0 | 1 | 2>(1);
  const entitiesRef = useRef<Entity[]>([]);
  const spawnTimerRef = useRef(0);
  const scoreRef = useRef(0);
  const invincibleRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const timeLeftRef = useRef(60);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wedding_mini_best");
      if (raw) setBest(parseInt(raw, 10) || 0);
    } catch {}
  }, []);

  const syncState = useCallback((s: GameState) => {
    stateRef.current = s;
    setState(s);
  }, []);

  const reset = useCallback(() => {
    laneRef.current = 1;
    entitiesRef.current = [];
    spawnTimerRef.current = 0;
    scoreRef.current = 0;
    invincibleRef.current = 0;
    timeLeftRef.current = 60;
    lastTsRef.current = null;
    setScore(0);
    setRemain(60);
  }, []);

  const endGame = useCallback(
    (final: GameState) => {
      syncState(final);
      try {
        if (scoreRef.current > best) {
          setBest(scoreRef.current);
          localStorage.setItem("wedding_mini_best", String(scoreRef.current));
        }
      } catch {}
    },
    [best, syncState],
  );

  const start = useCallback(() => {
    reset();
    syncState("playing");
  }, [reset, syncState]);

  const moveLane = useCallback((dir: -1 | 1) => {
    if (stateRef.current !== "playing") return;
    const next = laneRef.current + dir;
    if (next < 0 || next > 2) return;
    laneRef.current = next as 0 | 1 | 2;
  }, []);

  // 키보드 컨트롤
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveLane(-1);
      else if (e.key === "ArrowRight") moveLane(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLane]);

  // 게임 루프
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

      // 타이머
      timeLeftRef.current -= dt;
      if (timeLeftRef.current <= 0) {
        scoreRef.current += 500; // 생존 보너스
        setScore(scoreRef.current);
        setRemain(0);
        endGame("cleared");
        return;
      }
      setRemain(Math.max(0, Math.ceil(timeLeftRef.current)));

      // 무적 감소
      if (invincibleRef.current > 0) invincibleRef.current -= dt;

      // 스폰
      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        spawnTimerRef.current = 0.55 + Math.random() * 0.35;
        const r = Math.random();
        const kind: Entity["kind"] =
          r < 0.25 ? "ring" : r < 0.5 ? "heart" : r < 0.62 ? "champagne" : r < 0.85 ? "envelope" : "cake";
        entitiesRef.current.push({
          lane: Math.floor(Math.random() * 3) as 0 | 1 | 2,
          y: -30,
          kind,
          vy: 170 + Math.random() * 60,
        });
      }

      // 엔티티 업데이트 + 충돌
      const survivors: Entity[] = [];
      for (const e of entitiesRef.current) {
        e.y += e.vy * dt;
        const hit =
          e.lane === laneRef.current &&
          e.y > PLAYER_Y - 26 &&
          e.y < PLAYER_Y + 26;
        if (hit) {
          if (e.kind === "ring") scoreRef.current += 100;
          else if (e.kind === "heart") scoreRef.current += 50;
          else if (e.kind === "champagne") {
            scoreRef.current += 150;
            invincibleRef.current = 3;
          } else if (e.kind === "envelope") {
            if (invincibleRef.current <= 0) {
              scoreRef.current = Math.max(0, scoreRef.current - 100);
            }
          } else if (e.kind === "cake") {
            if (invincibleRef.current <= 0) {
              setScore(scoreRef.current);
              endGame("over");
              return;
            }
          }
          setScore(scoreRef.current);
          continue;
        }
        if (e.y < H + 30) survivors.push(e);
      }
      entitiesRef.current = survivors;

      // 렌더
      ctx.fillStyle = "#fdfbf7";
      ctx.fillRect(0, 0, W, H);

      // 레인 가이드
      ctx.strokeStyle = "rgba(232, 147, 120, 0.18)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(LANE_W * i, 0);
        ctx.lineTo(LANE_W * i, H);
        ctx.stroke();
      }

      // 엔티티
      for (const e of entitiesRef.current) {
        const cx = e.lane * LANE_W + LANE_W / 2;
        ctx.fillStyle = ITEM_COLOR[e.kind];
        if (e.kind === "ring") {
          ctx.beginPath();
          ctx.arc(cx, e.y, 12, 0, Math.PI * 2);
          ctx.lineWidth = 4;
          ctx.strokeStyle = ITEM_COLOR.ring;
          ctx.stroke();
        } else if (e.kind === "heart") {
          drawHeart(ctx, cx, e.y, 11, ITEM_COLOR.heart);
        } else if (e.kind === "champagne") {
          ctx.fillRect(cx - 6, e.y - 12, 12, 22);
          ctx.beginPath();
          ctx.arc(cx, e.y - 14, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (e.kind === "envelope") {
          ctx.fillRect(cx - 14, e.y - 9, 28, 18);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - 14, e.y - 9);
          ctx.lineTo(cx, e.y + 3);
          ctx.lineTo(cx + 14, e.y - 9);
          ctx.stroke();
        } else if (e.kind === "cake") {
          ctx.fillRect(cx - 14, e.y - 6, 28, 14);
          ctx.fillStyle = "#f0a3a3";
          ctx.fillRect(cx - 14, e.y - 10, 28, 5);
        }
      }

      // 플레이어 (블러시+로즈 하트)
      const px = laneRef.current * LANE_W + LANE_W / 2;
      const blink = invincibleRef.current > 0 && Math.floor(ts / 80) % 2 === 0;
      drawHeart(ctx, px, PLAYER_Y, 15, blink ? "#f5b8a8" : "#e89378");

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, endGame]);

  // 터치 핸들러 — 좌우 스와이프 + 좌우 탭
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (stateRef.current !== "playing") return;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (stateRef.current !== "playing") return;
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 18) {
      moveLane(dx > 0 ? 1 : -1);
    } else {
      // 탭 위치로 이동
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.changedTouches[0].clientX - rect.left;
      if (x < rect.width / 3) moveLane(-1);
      else if (x > (rect.width * 2) / 3) moveLane(1);
    }
    touchStartX.current = null;
  };

  return (
    <section className="px-5 py-10 bg-white">
      <Card>
        <SectionHead kicker="Mini Game" title="웨딩 러너" />
        <p className="mb-5 text-center text-[13px] text-[color:var(--color-mute)] leading-loose">
          60초 안에 반지 · 하트 · 샴페인을 모으고
          <br />
          봉투와 케이크를 피해주세요.
        </p>

        <div className="mx-auto max-w-[320px]">
          <div className="mb-3 flex items-center justify-between text-[12px] tracking-widest text-[color:var(--color-mute)]">
            <span>
              SCORE <b className="ml-1 text-[color:var(--color-rose-deep)] text-base">{score}</b>
            </span>
            <span>
              TIME <b className="ml-1 text-[color:var(--color-rose-deep)] text-base">{remain}</b>
            </span>
            <span>
              BEST <b className="ml-1 text-[color:var(--color-charcoal)] text-base">{best}</b>
            </span>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-[color:var(--color-rose)]/25 bg-[#fdfbf7]"
            style={{ touchAction: "none" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <canvas ref={canvasRef} width={W} height={H} className="block w-full h-auto select-none" />

            {state === "idle" && (
              <GameOverlay
                title="Wedding Runner"
                description="좌우 스와이프 · 화살표 · 좌우 탭"
                btn="시작하기"
                onClick={start}
              />
            )}
            {state === "cleared" && (
              <GameOverlay
                title="결혼했다! 🎉"
                description={`60초 생존 성공 · 보너스 +500\n최종 점수 ${score}`}
                btn="다시 하기"
                onClick={start}
              />
            )}
            {state === "over" && (
              <GameOverlay
                title="게임 오버"
                description={`케이크에 부딪혔습니다.\n최종 점수 ${score}`}
                btn="다시 하기"
                onClick={start}
              />
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                moveLane(-1);
              }}
              className="py-3 rounded-xl border border-[color:var(--color-rose)]/30 text-[color:var(--color-rose-deep)]"
            >
              ← LEFT
            </button>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                moveLane(1);
              }}
              className="py-3 rounded-xl border border-[color:var(--color-rose)]/30 text-[color:var(--color-rose-deep)]"
            >
              RIGHT →
            </button>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-1 text-[11px] tracking-wide text-[color:var(--color-mute)] text-center">
            <LegendDot color={ITEM_COLOR.ring} label="반지 +100" />
            <LegendDot color={ITEM_COLOR.heart} label="하트 +50" />
            <LegendDot color={ITEM_COLOR.champagne} label="샴페인 +150" />
            <LegendDot color={ITEM_COLOR.envelope} label="봉투 −100" />
            <LegendDot color={ITEM_COLOR.cake} label="케이크 OUT" />
          </div>
        </div>
      </Card>
    </section>
  );
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
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[color:var(--color-blush)]/85 backdrop-blur-sm text-center px-6">
      <p className="text-lg text-[color:var(--color-charcoal)]">{title}</p>
      <p className="text-[13px] leading-relaxed text-[color:var(--color-charcoal)]/75 whitespace-pre-line">
        {description}
      </p>
      <button
        onClick={onClick}
        className="rounded-full bg-[color:var(--color-rose-deep)] px-6 py-2.5 text-[12px] tracking-[0.3em] text-white"
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
