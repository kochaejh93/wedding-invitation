"use client";

import { useEffect, useMemo, useState } from "react";

// 더미 데이터 — 마스터 정보 받으면 교체
const data = {
  groom: { name: "김신랑", father: "김부친", mother: "이모친", phone: "010-0000-0000", account: "신한은행 110-000-000000" },
  bride: { name: "박신부", father: "박부친", mother: "최모친", phone: "010-0000-0000", account: "국민은행 000-00-0000-000" },
  date: "2026-10-25T13:00:00+09:00",
  dateLabel: "2026년 10월 25일 일요일 오후 1시",
  venue: { name: "○○웨딩홀 그랜드볼룸 5F", address: "서울특별시 강남구 테헤란로 000", subway: "지하철 2호선 ○○역 3번 출구 도보 5분", parking: "건물 지하 주차장 2시간 무료" },
  greeting: `평생을 함께하고 싶은 사람을 만났습니다.\n서로 아껴주고 사랑하며 살겠습니다.\n오셔서 축복해 주시면 더없는 기쁨이겠습니다.`,
  gallery: ["#e8dec9", "#d8cdb3", "#c9bfa6", "#b8ad94", "#a89c84", "#988b75", "#887b66", "#78694e"],
};

// 12종 폰트 — CSS 변수와 라벨 매핑
const FONTS: { key: string; label: string; cssVar: string; category: string }[] = [
  { key: "noto-serif", label: "Noto Serif KR", cssVar: "var(--font-noto-serif)", category: "명조" },
  { key: "nanum-myeongjo", label: "Nanum Myeongjo", cssVar: "var(--font-nanum-myeongjo)", category: "명조" },
  { key: "gowun-batang", label: "Gowun Batang", cssVar: "var(--font-gowun-batang)", category: "명조" },
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

function FontToggle({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 w-64 max-h-80 overflow-y-auto rounded-2xl bg-white shadow-2xl border border-line p-2">
          <div className="text-xs text-ink-soft px-3 py-2 border-b border-line">글씨체 고르기</div>
          {FONTS.map((f) => (
            <button
              key={f.key}
              onClick={() => onChange(f.key)}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                value === f.key ? "bg-bg-soft" : "hover:bg-bg-soft/60"
              }`}
              style={{ fontFamily: f.cssVar }}
            >
              <span className="text-base">우리 결혼합니다</span>
              <span className="text-[10px] text-ink-soft ml-2">{f.category}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-ink text-bg px-4 py-3 shadow-xl text-sm tracking-wide"
      >
        {open ? "닫기" : "Aa 글씨체"}
      </button>
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center mb-8">
      <div className="text-xs tracking-[0.4em] text-gold uppercase">{kicker}</div>
      <div className="mt-2 text-lg text-ink-soft">{title}</div>
      <span className="divider mt-4" />
    </div>
  );
}

function MainVisual() {
  const dateText = new Date(data.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  return (
    <section className="px-8 pt-20 pb-16 text-center bg-gradient-to-b from-bg-soft to-transparent">
      <div className="text-xs tracking-[0.5em] text-gold">WE ARE GETTING MARRIED</div>
      <h1 className="mt-6 text-3xl leading-relaxed">
        {data.groom.name}
        <span className="mx-3 text-gold">&</span>
        {data.bride.name}
      </h1>
      <div className="mt-6 text-sm text-ink-soft">{dateText}</div>
      <span className="divider mt-8" />
    </section>
  );
}

function Greeting() {
  return (
    <section className="px-8 py-16 text-center">
      <SectionTitle kicker="INVITATION" title="소중한 분들을 초대합니다" />
      <p className="text-[15px] leading-loose whitespace-pre-line text-ink-soft">{data.greeting}</p>
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
    <section className="px-8 py-12 bg-bg-soft/50">
      <div className="text-center text-sm text-ink-soft mb-4">결혼식까지 남은 시간</div>
      <div className="flex justify-center gap-3">
        {items.map((i) => (
          <div key={i.l} className="bg-white rounded-xl px-3 py-3 text-center min-w-[58px] shadow-sm">
            <div className="text-2xl text-gold tabular-nums">{String(i.v).padStart(2, "0")}</div>
            <div className="text-[10px] text-ink-soft mt-1 tracking-widest">{i.l}</div>
          </div>
        ))}
      </div>
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
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <section className="px-8 py-16">
      <SectionTitle kicker="CALENDAR" title={`${year}년 ${month + 1}월`} />
      <div className="grid grid-cols-7 gap-y-3 text-center text-sm">
        {labels.map((l, i) => (
          <div key={l} className={`text-xs ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-ink-soft"}`}>
            {l}
          </div>
        ))}
        {days.map((d, i) => {
          const isTarget = d === target.getDate();
          const col = i % 7;
          return (
            <div key={i} className="py-1">
              {d && (
                <span
                  className={`inline-flex w-8 h-8 items-center justify-center rounded-full ${
                    isTarget
                      ? "bg-gold text-white"
                      : col === 0
                        ? "text-red-400"
                        : col === 6
                          ? "text-blue-400"
                          : ""
                  }`}
                >
                  {d}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-center text-sm text-ink-soft">{data.dateLabel}</div>
    </section>
  );
}

function People() {
  const Person = ({ role, p }: { role: string; p: typeof data.groom }) => (
    <div className="text-center flex-1">
      <div className="text-xs text-gold tracking-widest mb-2">{role}</div>
      <div className="text-xl mb-1">{p.name}</div>
      <div className="text-xs text-ink-soft mb-3">
        {p.father} · {p.mother}의 아들/딸
      </div>
      <a href={`tel:${p.phone}`} className="inline-block text-xs px-3 py-1 border border-line rounded-full text-ink-soft">
        연락하기
      </a>
    </div>
  );
  return (
    <section className="px-8 py-16 bg-bg-soft/30">
      <SectionTitle kicker="PEOPLE" title="신랑 & 신부" />
      <div className="flex items-stretch gap-4">
        <Person role="GROOM" p={data.groom} />
        <div className="w-px bg-line" />
        <Person role="BRIDE" p={data.bride} />
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="px-8 py-16">
      <SectionTitle kicker="GALLERY" title="우리의 순간들" />
      <div className="grid grid-cols-3 gap-2">
        {data.gallery.map((c, i) => (
          <div key={i} className="aspect-square rounded-md" style={{ background: c }} />
        ))}
      </div>
      <div className="text-center text-xs text-ink-soft mt-4">사진 자리 — 마스터 사진 받으면 교체 예정</div>
    </section>
  );
}

function Location() {
  return (
    <section className="px-8 py-16 bg-bg-soft/30">
      <SectionTitle kicker="LOCATION" title="오시는 길" />
      <div className="text-center mb-6">
        <div className="text-base">{data.venue.name}</div>
        <div className="text-sm text-ink-soft mt-1">{data.venue.address}</div>
      </div>
      <div className="aspect-[4/3] rounded-lg bg-bg-soft flex items-center justify-center text-xs text-ink-soft mb-6">
        지도 영역 (카카오/네이버 지도 임베드)
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gold mr-2">●</span>
          지하철 — {data.venue.subway}
        </div>
        <div>
          <span className="text-gold mr-2">●</span>
          주차 — {data.venue.parking}
        </div>
      </div>
    </section>
  );
}

function Account() {
  const Row = ({ role, name, account }: { role: string; name: string; account: string }) => (
    <div className="flex justify-between items-center py-3 border-b border-line text-sm">
      <div>
        <div className="text-xs text-ink-soft">{role}</div>
        <div>{name}</div>
      </div>
      <button
        onClick={() => navigator.clipboard?.writeText(account)}
        className="text-xs text-gold border border-gold/40 rounded-full px-3 py-1"
      >
        {account} 복사
      </button>
    </div>
  );
  return (
    <section className="px-8 py-16">
      <SectionTitle kicker="ACCOUNT" title="마음 전하실 곳" />
      <div className="text-center text-xs text-ink-soft mb-6">참석이 어려우신 분들을 위해 마련했습니다.</div>
      <div className="space-y-1">
        <Row role="신랑측" name={data.groom.name} account={data.groom.account} />
        <Row role="신부측" name={data.bride.name} account={data.bride.account} />
      </div>
    </section>
  );
}

function Guestbook() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<{ name: string; msg: string }[]>([
    { name: "친구A", msg: "두 분의 결혼을 진심으로 축하드립니다 🤍" },
  ]);
  const submit = () => {
    if (!name.trim() || !msg.trim()) return;
    setList((l) => [{ name, msg }, ...l]);
    setName("");
    setMsg("");
  };
  return (
    <section className="px-8 py-16 bg-bg-soft/30">
      <SectionTitle kicker="GUESTBOOK" title="방명록" />
      <div className="space-y-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="w-full px-4 py-2 rounded-lg bg-white border border-line text-sm"
        />
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="축하 메시지를 남겨주세요"
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-white border border-line text-sm resize-none"
        />
        <button onClick={submit} className="w-full py-2 rounded-lg bg-ink text-bg text-sm">
          남기기
        </button>
      </div>
      <div className="space-y-3">
        {list.map((g, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-line text-sm">
            <div className="text-xs text-gold mb-1">{g.name}</div>
            <div className="text-ink-soft">{g.msg}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RSVP() {
  const [yes, setYes] = useState<boolean | null>(null);
  const [meal, setMeal] = useState<string | null>(null);
  return (
    <section className="px-8 py-16">
      <SectionTitle kicker="RSVP" title="참석 여부" />
      <div className="space-y-5">
        <div>
          <div className="text-sm text-ink-soft mb-2">참석하시나요?</div>
          <div className="flex gap-2">
            {[
              { v: true, l: "참석" },
              { v: false, l: "불참" },
            ].map((o) => (
              <button
                key={String(o.v)}
                onClick={() => setYes(o.v)}
                className={`flex-1 py-3 rounded-lg border text-sm transition ${
                  yes === o.v ? "bg-ink text-bg border-ink" : "border-line"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
        {yes && (
          <div>
            <div className="text-sm text-ink-soft mb-2">식사 여부</div>
            <div className="flex gap-2">
              {["식사함", "식사안함"].map((o) => (
                <button
                  key={o}
                  onClick={() => setMeal(o)}
                  className={`flex-1 py-3 rounded-lg border text-sm transition ${
                    meal === o ? "bg-ink text-bg border-ink" : "border-line"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Share() {
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: "우리 결혼합니다", url: window.location.href });
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      alert("링크를 복사했습니다");
    }
  };
  return (
    <section className="px-8 py-16 bg-bg-soft/30 text-center">
      <SectionTitle kicker="SHARE" title="청첩장 공유하기" />
      <button onClick={share} className="px-8 py-3 rounded-full bg-gold text-white text-sm">
        링크 공유하기
      </button>
      <div className="mt-12 text-xs text-ink-soft">
        with love, {data.groom.name} & {data.bride.name}
      </div>
    </section>
  );
}

export default function Home() {
  const [fontKey, setFontKey] = useState("noto-serif");
  const fontVar = useMemo(() => FONTS.find((f) => f.key === fontKey)?.cssVar ?? "var(--font-noto-serif)", [fontKey]);
  return (
    <main className="invitation" style={{ fontFamily: fontVar } as React.CSSProperties}>
      <MainVisual />
      <Greeting />
      <Countdown />
      <Calendar />
      <People />
      <Gallery />
      <Location />
      <Account />
      <Guestbook />
      <RSVP />
      <Share />
      <FontToggle value={fontKey} onChange={setFontKey} />
    </main>
  );
}
