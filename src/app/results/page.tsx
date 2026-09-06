"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { Google_Sans, League_Gothic, Syncopate } from "next/font/google";
import { ReactLenis, type LenisRef } from "lenis/react";
import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import DiscordLogo from "../discord-logo";
import YouTubeLogo from "../youtube-logo";
import styles from "./results.module.css";

const lineSeedExtraBold = localFont({
  src: "../fonts/LINESeedJP-ExtraBold.ttf",
  weight: "800",
  display: "swap",
});

const zakkuriGothic = localFont({
  src: "../fonts/ZakkuriGothicFree-Black.otf",
  weight: "900",
  display: "swap",
  fallback: ["sans-serif"],
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-ranking-google-sans",
});

type ResultItem = {
  videoId: string;
  count: number;
  title?: string;
  channelTitle?: string;
  channelIcon?: string;
  description?: string;
  slot?: number;
};

type ResultsData = {
  total: number;
  publishedCount?: number;
  publishedRanks?: number[];
  ranked: ResultItem[];
};

type EntriesData = {
  entries?: Array<{ youtubeId?: string }>;
};

type RankedItem = ResultItem & {
  rank: number;
  percentage: number;
};

const topLayers: Array<{
  src: string;
  clip: string;
  motion?: number;
  topbarOrder?: number;
  intro?: "from-left" | "from-right" | "from-below" | "fade";
  introDelay?: number;
}> = [
  // { src: "/Top/1.png", clip: "76.06% 58.8% 7.29% 4.51%" },
  { src: "/Top/2.png", clip: "38.71% 63.44% 33.24% 26.9%", motion: 1, topbarOrder: 25, intro: "fade", introDelay: 0.5 },
  { src: "/Top/3.png", clip: "9.24% 30.6% 61.59% 57.53%", motion: 2, topbarOrder: 24, intro: "fade", introDelay: 0.6 },
  { src: "/Top/4.png", clip: "56.53% 22.4% 10% 67.14%", motion: 3, topbarOrder: 23, intro: "fade", introDelay: 0.7 },
  { src: "/Top/5.png", clip: "0% 3.33% 37.76% 64.17%", topbarOrder: 19, intro: "from-right", introDelay: 0.3 },
  { src: "/Top/6.png", clip: "56% 67.5% 0% 8.46%", topbarOrder: 22, intro: "from-left", introDelay: 0.2 },
  { src: "/Top/7_.png", clip: "0% 1.51% 0% 1.04%", topbarOrder: 18, intro: "from-below", introDelay: 0 },
  { src: "/Top/8.png", clip: "0% 68.78% 36.65% 0.73%", intro: "from-left", introDelay: 0.1 },
  { src: "/Top/9.png", clip: "58.12% 0.76% 0% 74.64%", intro: "from-right", introDelay: 0.4 },
  { src: "/Top/10.png", clip: "0" },
];

const TOP_ASSET_VERSION = "20260904-1700";
const TOP_LOADING_ASSETS = [
  "/Top/1.png",
  "/Top/2.png",
  "/Top/3.png",
  "/Top/4.png",
  "/Top/5.png",
  "/Top/6.png",
  "/Top/7_.png",
  "/Top/8.png",
  "/Top/9.png",
  "/Top/10.png",
  "/Top/11.png",
  "/Top/12.png",
  "/Top/yokatta.png",
] as const;
const UNAVAILABLE_THUMBNAIL_IDS = new Set(["rMNoahdPhz0"]);
const rankingColors = ["#f05d73", "#a71e42"] as const;
const rankingShapes: Array<{
  kind: "triangle" | "square" | "letter";
  letter?: string;
  left: string;
  top: string;
  size: string;
  color: string;
  duration: string;
  delay: string;
}> = [
  { kind: "triangle", left: "7%", top: "11%", size: "clamp(3.5rem, 7vw, 8rem)", color: rankingColors[0], duration: "20s", delay: "-14s" },
  { kind: "square", left: "16%", top: "54%", size: "clamp(2.7rem, 5vw, 6.5rem)", color: rankingColors[1], duration: "27s", delay: "-5s" },
  { kind: "letter", letter: "Y", left: "31%", top: "24%", size: "clamp(12rem, 28vw, 34rem)", color: rankingColors[0], duration: "24s", delay: "-19s" },
  { kind: "triangle", left: "38%", top: "67%", size: "clamp(4rem, 8vw, 9rem)", color: rankingColors[1], duration: "30s", delay: "-9s" },
  { kind: "square", left: "49%", top: "9%", size: "clamp(3rem, 6vw, 7rem)", color: rankingColors[0], duration: "21s", delay: "-16s" },
  { kind: "letter", letter: "M", left: "52%", top: "44%", size: "clamp(14rem, 32vw, 38rem)", color: rankingColors[1], duration: "31s", delay: "-25s" },
  { kind: "triangle", left: "71%", top: "16%", size: "clamp(2.8rem, 5.5vw, 6.4rem)", color: rankingColors[0], duration: "26s", delay: "-8s" },
  { kind: "square", left: "82%", top: "59%", size: "clamp(4rem, 8vw, 9.5rem)", color: rankingColors[1], duration: "23s", delay: "-13s" },
  { kind: "letter", letter: "K", left: "42%", top: "31%", size: "clamp(12rem, 24vw, 30rem)", color: rankingColors[0], duration: "29s", delay: "-21s" },
  { kind: "triangle", left: "4%", top: "78%", size: "clamp(2.6rem, 5vw, 6rem)", color: rankingColors[1], duration: "19s", delay: "-3s" },
  { kind: "square", left: "33%", top: "39%", size: "clamp(2.3rem, 4.5vw, 5.3rem)", color: rankingColors[0], duration: "28s", delay: "-18s" },
  { kind: "letter", letter: "W", left: "58%", top: "75%", size: "clamp(11rem, 26vw, 32rem)", color: rankingColors[1], duration: "22s", delay: "-11s" },
];
const rankingBars = [
  { left: "5%", width: "clamp(0.9rem, 2.2vw, 2.4rem)", color: rankingColors[1], duration: "11s", delay: "-5s", from: "-5vw", to: "7vw" },
  { left: "22%", width: "clamp(0.7rem, 1.5vw, 1.7rem)", color: rankingColors[0], duration: "15s", delay: "-8s", from: "4vw", to: "-7vw" },
  { left: "41%", width: "clamp(1rem, 2.8vw, 3rem)", color: rankingColors[1], duration: "13s", delay: "-3s", from: "-8vw", to: "4vw" },
  { left: "56%", width: "clamp(0.65rem, 1.2vw, 1.45rem)", color: rankingColors[0], duration: "16s", delay: "-12s", from: "7vw", to: "-5vw" },
  { left: "74%", width: "clamp(1.1rem, 2.4vw, 2.8rem)", color: rankingColors[1], duration: "12s", delay: "-7s", from: "-4vw", to: "8vw" },
  { left: "89%", width: "clamp(0.8rem, 1.7vw, 2rem)", color: rankingColors[0], duration: "14s", delay: "-10s", from: "6vw", to: "-6vw" },
] as const;
const rankingDenseShapes = Array.from({ length: 1800 }, (_, index) => {
  const kinds = ["triangle", "square"] as const;
  const sizes = [
    "clamp(1.7rem, 3.2vw, 4rem)",
    "clamp(2.2rem, 4.4vw, 5.5rem)",
    "clamp(2.8rem, 5.8vw, 7rem)",
    "clamp(3.4rem, 6.8vw, 8rem)",
  ];
  const letterSizes = [
    "clamp(7rem, 12.8vw, 16rem)",
    "clamp(8.8rem, 17.6vw, 22rem)",
    "clamp(11.2rem, 23.2vw, 28rem)",
    "clamp(13.6rem, 27.2vw, 32rem)",
  ];
  const kind = index % 15 === 0 ? "letter" : kinds[index % kinds.length];

  return {
    kind,
    letter: "YMKW"[index % 4],
    left: kind === "letter"
      ? `${25 + ((index * 19 + 11) % 42)}%`
      : `${(index * 37 + 13) % 100}%`,
    top: `${(index * 29 + 7) % 92}%`,
    size: kind === "letter" ? letterSizes[index % letterSizes.length] : sizes[index % sizes.length],
    color: rankingColors[index % rankingColors.length],
    duration: `${80 + (index % 41)}s`,
    delay: `-${(index * 7) % 121}s`,
  };
});
const rankingDenseBars = Array.from({ length: 12 }, (_, index) => ({
  left: `${(index * 9 + 3) % 100}%`,
  width: ["clamp(0.55rem, 1vw, 1.2rem)", "clamp(0.9rem, 1.8vw, 2.1rem)", "clamp(1.2rem, 2.6vw, 3rem)"][index % 3],
  color: rankingColors[(index + 1) % rankingColors.length],
  duration: `${10 + (index % 7)}s`,
  delay: `-${(index * 5) % 17}s`,
  from: `${-8 + (index % 5) * 2}vw`,
  to: `${8 - (index % 5) * 2}vw`,
}));

function versionedTopAsset(src: string) {
  return `${src}?v=${TOP_ASSET_VERSION}`;
}

function RankingBackdrop() {
  const allShapes = [...rankingShapes, ...rankingDenseShapes];

  return (
    <div className={styles.rankingBackdrop} aria-hidden="true">
      {allShapes.filter((shape) => shape.kind !== "letter").map((shape, index) => (
        <span
          className={styles.rankingShape}
          data-kind={shape.kind}
          key={`shape-${index}`}
          style={{
            "--shape-left": shape.left,
            "--shape-top": shape.top,
            "--shape-size": shape.size,
            "--shape-color": shape.color,
            "--shape-duration": shape.duration,
            "--shape-delay": shape.delay,
          } as CSSProperties}
        />
      ))}
      {[...rankingBars, ...rankingDenseBars].map((bar, index) => (
        <span
          className={styles.rankingBar}
          key={`bar-${index}`}
          style={{
            "--bar-left": bar.left,
            "--bar-width": bar.width,
            "--bar-color": bar.color,
            "--bar-duration": bar.duration,
            "--bar-delay": bar.delay,
            "--bar-from": bar.from,
            "--bar-to": bar.to,
          } as CSSProperties}
        />
      ))}
      {allShapes.filter((shape) => shape.kind === "letter").map((shape, index) => (
        <span
          className={`${styles.rankingShape} ${googleSans.variable}`}
          data-kind="letter"
          key={`letter-${index}`}
          style={{
            "--shape-left": shape.left,
            "--shape-top": shape.top,
            "--shape-size": shape.size,
            "--shape-color": shape.color,
            "--shape-duration": shape.duration,
            "--shape-delay": shape.delay,
          } as CSSProperties}
        >
          {shape.letter}
        </span>
      ))}
    </div>
  );
}

function stableHash(value: string) {
  return [...value].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
}

class ResultsRequestError extends Error {
  constructor(public code: "not-published" | "unavailable") {
    super(code);
  }
}

async function requestResults(): Promise<ResultsData> {
  const response = await fetch("/api/results", { cache: "no-store" });
  const payload = (await response.json()) as Partial<ResultsData> & {
    error?: string;
  };
  if (payload.error === "results_not_published") {
    throw new ResultsRequestError("not-published");
  }
  if (!response.ok || !Array.isArray(payload.ranked)) {
    throw new ResultsRequestError("unavailable");
  }

  return { total: payload.total ?? 0, ranked: payload.ranked };
}

function getRankedItems(data: ResultsData): RankedItem[] {
  let previousCount: number | undefined;
  let currentRank = 0;

  return data.ranked.map((item, index) => {
    if (item.count !== previousCount) currentRank = index + 1;
    previousCount = item.count;

    return {
      ...item,
      rank: currentRank,
      percentage: data.total > 0 ? (item.count / data.total) * 100 : 0,
    };
  });
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14 7h20v7c0 8-4.2 14-10 14s-10-6-10-14V7Z" />
      <path d="M14 11H7v3c0 6.2 3.8 10 9.6 10M34 11h7v3c0 6.2-3.8 10-9.6 10M24 28v8M16 41h16M19 36h10" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function TwitterLogo() {
  return (
    <svg className="home-social__twitter-logo" viewBox="0 0 512 512" aria-hidden="true">
      <path
        fill="currentColor"
        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.299 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253Z"
      />
    </svg>
  );
}

function ReelText({ label }: { label: string }) {
  return (
    <span className="home-hero__reel" aria-hidden="true">
      {[...label].map((character, index) => (
        <span
          className="home-hero__reel-character"
          style={{ "--reel-index": index } as CSSProperties}
          key={`${character}-${index}`}
        >
          <span className="home-hero__reel-track">
            <span>{character}</span>
            <span>{character}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

function SpinningRay() {
  return (
    <span className={styles.rayClip} aria-hidden="true">
      <span className={styles.raySpinner}>
        <Image
          src={versionedTopAsset("/Top/12.png")}
          alt=""
          fill
          sizes="70vw"
          priority
          unoptimized
        />
      </span>
    </span>
  );
}

type BroadcastRevealStage =
  | "covered"
  | "departing"
  | "returning"
  | "second-enter"
  | "second-exit"
  | "revealed";

function BroadcastReveal({
  rank,
  mode,
  side = "left",
  published,
  canAdvance,
  onRequestAdvance,
}: {
  rank: number;
  mode: "podium" | "standard";
  side?: "left" | "right";
  published: boolean;
  canAdvance: boolean;
  onRequestAdvance: (rank: number) => Promise<boolean>;
}) {
  const [stage, setStage] = useState<BroadcastRevealStage>("covered");
  const [holding, setHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const sequenceTimersRef = useRef<number[]>([]);
  const initializedRef = useRef(false);

  const clearSequenceTimers = () => {
    sequenceTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    sequenceTimersRef.current = [];
  };

  const cancelHold = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHolding(false);
  };

  const beginReveal = () => {
    clearSequenceTimers();
    const completeReveal = () => {
      setStage("revealed");
    };

    if (mode === "standard") {
      setStage("departing");
      sequenceTimersRef.current.push(
        window.setTimeout(() => setStage("returning"), 660),
        window.setTimeout(completeReveal, 1480),
      );
      return;
    }

    setStage("second-enter");
    sequenceTimersRef.current.push(
      window.setTimeout(() => setStage("second-exit"), 1460),
      window.setTimeout(completeReveal, 2280),
    );
  };

  const startHold = () => {
    if (stage !== "covered" || holdTimerRef.current !== null) return;
    setHolding(true);
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      setHolding(false);
      void onRequestAdvance(rank).then((advanced) => {
        if (!advanced) setHolding(false);
      });
    }, 800);
  };

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (published) setStage("revealed");
      return;
    }
    clearSequenceTimers();
    if (published) beginReveal();
    else setStage("covered");
  // The transition itself intentionally runs only when the server state changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [published]);

  useEffect(() => () => {
    if (holdTimerRef.current !== null) window.clearTimeout(holdTimerRef.current);
    sequenceTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  if (stage === "revealed") return null;

  return (
    <div
      className={styles.broadcastReveal}
      data-stage={stage}
      data-mode={mode}
      data-side={side}
    >
      <div className={styles.broadcastChecker} aria-hidden="true" />
      <div className={styles.broadcastRevealPrompt}>
        <strong className={styles.broadcastRevealRank}>{rank}位</strong>
        <span className={styles.broadcastRevealLabel}>結果を表示する</span>
        <button
          className={styles.broadcastRevealButton}
          data-holding={holding ? "true" : "false"}
          type="button"
          aria-label={`${rank}位の結果を表示する。長押ししてください`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          disabled={!canAdvance}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            if (canAdvance) startHold();
          }}
          onPointerUp={cancelHold}
          onPointerCancel={cancelHold}
          onPointerLeave={cancelHold}
          onKeyDown={(event) => {
            if ((event.key === " " || event.key === "Enter") && !event.repeat) {
              event.preventDefault();
              if (canAdvance) startHold();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              cancelHold();
            }
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          <span>{canAdvance ? "続行→" : "配信者が公開します"}</span>
        </button>
      </div>
      {mode === "podium" && (stage === "second-enter" || stage === "second-exit") ? (
        <div className={styles.broadcastSecondSequence} aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            // Plain img intentionally avoids image optimization during the timed reveal.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.broadcastSecondLayer}
              src={`/second/${index + 1}.png`}
              alt=""
              style={{
                "--second-index": index,
                zIndex: 8 - index,
              } as CSSProperties}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EndLogoSection({ children, videoIds }: { children?: ReactNode; videoIds: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState({ top: "100svh", bottom: "0px" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-arrived", "true");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    section.querySelectorAll(`.${styles.lowerRankingCard}`).forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scaleTravel = Math.max(section.offsetHeight, 1);
      const scrollProgress = Math.min(
        1,
        Math.max(0, (viewportHeight - rect.top) / scaleTravel),
      );
      const revealTop = Math.min(viewportHeight, Math.max(0, rect.top));
      const revealBottom = Math.min(viewportHeight, Math.max(0, viewportHeight - rect.bottom));

      setProgress((current) => Math.abs(current - scrollProgress) > 0.002 ? scrollProgress : current);
      setReveal((current) => {
        const top = `${revealTop}px`;
        const bottom = `${revealBottom}px`;
        return current.top === top && current.bottom === bottom ? current : { top, bottom };
      });
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      className={styles.endLogoSection}
      ref={sectionRef}
      style={{
        "--end-logo-progress": progress,
        "--end-logo-reveal-top": reveal.top,
        "--end-logo-reveal-bottom": reveal.bottom,
      } as CSSProperties}
      aria-label="やまかわ動画編集大会"
    >
      <div className={styles.endLogoSticky}>
        <ThumbnailStream videoIds={videoIds} variant="ranking" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.endLogo}
          src="/logo/logo.png"
          alt="やまかわ動画編集大会"
        />
      </div>
      {children ? <div className={styles.endLogoContent}>{children}</div> : null}
    </section>
  );
}

function RankingTailSection({ children, locked = false }: { children: ReactNode; locked?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState({ top: "100svh", bottom: "0px" });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / Math.max(section.offsetHeight, 1)));
      const top = `${Math.min(viewportHeight, Math.max(0, rect.top))}px`;
      const bottom = `${Math.min(viewportHeight, Math.max(0, viewportHeight - rect.bottom))}px`;

      setProgress((current) => Math.abs(current - nextProgress) > 0.002 ? nextProgress : current);
      setReveal((current) => current.top === top && current.bottom === bottom ? current : { top, bottom });
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      className={styles.rankingTail}
      ref={sectionRef}
      style={{
        "--tail-logo-progress": progress,
        "--tail-logo-reveal-top": reveal.top,
        "--tail-logo-reveal-bottom": reveal.bottom,
      } as CSSProperties}
      data-locked={locked || undefined}
      aria-label="11位以降の作品"
    >
      <div className={styles.rankingTailLogoSticky} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.rankingTailLogo} src="/logo/logo.png" alt="" />
      </div>
      <div className={styles.rankingTailContent}>{children}</div>
    </section>
  );
}

function TopArtwork({ introReady }: { introReady: boolean }) {
  return (
    <section className={styles.topArtwork} aria-label="投票結果">
      <div className={`home-hero__topbar ${styles.topbarOverArt}`}>
        <p className={`${lineSeedExtraBold.className} home-hero__brand`}>
          <span className="home-hero__brand-desktop">やまかわ動画編集大会</span>
          <span className="home-hero__brand-mobile">編集大会</span>
        </p>
        <nav className={`${lineSeedExtraBold.className} home-social`} aria-label="ソーシャルメディア">
          <a
            className="home-social__link"
            href="https://youtube.com/@yamakawateruki?si=Hb3Fn6Wdkz4tyfs5"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTubeを開く"
          >
            <YouTubeLogo className="home-about__youtube-svg w-[1.38em] h-auto flex-none" />
            <ReelText label="YouTube" />
          </a>
          <a
            className="home-social__link"
            href="https://x.com/YamakawaTeruki"
            target="_blank"
            rel="noreferrer"
            aria-label="X（旧Twitter）を開く"
          >
            <TwitterLogo />
            <ReelText label="X（旧Twitter）" />
          </a>
          <a
            className="home-social__link"
            href="https://discord.gg/Cn7GV9rn7Y"
            target="_blank"
            rel="noreferrer"
            aria-label="Discord鯖を開く"
          >
            <DiscordLogo className="home-social__discord-logo" />
            <ReelText label="Discord鯖" />
          </a>
        </nav>
      </div>
      <div className={styles.topCanvas} data-intro-ready={introReady || undefined}>
        <div className={styles.topCanvasMotion} aria-hidden="true">
          {topLayers.map((layer, index) => (
            <span
              className={`${styles.artLayer}${layer.motion ? ` ${styles.floatingLayer}` : ""}`}
              data-motion={layer.motion || undefined}
              data-intro={layer.intro}
              key={layer.src}
              style={
                {
                  "--layer-order": layer.topbarOrder ?? 11 - index,
                  "--layer-clip": `inset(${layer.clip})`,
                  "--intro-delay": `${layer.introDelay ?? 0}s`,
                } as CSSProperties
              }
            >
              <Image
                src={versionedTopAsset(layer.src)}
                alt=""
                fill
                sizes="100vw"
                priority
                unoptimized
              />
            </span>
          ))}

          <span className={styles.frameLayer}>
            <Image
              src={versionedTopAsset("/Top/11.png")}
              alt=""
              fill
              sizes="100vw"
              priority
              unoptimized
            />
          </span>
          <SpinningRay />
        </div>

        <span className={styles.topbarSevenOverlay} aria-hidden="true" style={{ "--intro-delay": "0.55s" } as CSSProperties}>
          <span
            className={styles.topbarSevenLayer}
            style={{ "--layer-clip": "inset(0% 1.51% 0% 1.04%)" } as CSSProperties}
          >
            <Image
              src={versionedTopAsset("/Top/7_.png")}
              alt=""
              fill
              sizes="100vw"
              priority
              unoptimized
            />
          </span>
        </span>
      </div>
    </section>
  );
}

function ThumbnailStream({ videoIds, variant = "about" }: { videoIds: string[]; variant?: "about" | "ranking" }) {
  const rows = useMemo(() => {
    const available = videoIds.filter((videoId) => !UNAVAILABLE_THUMBNAIL_IDS.has(videoId));
    const ordered = [...available].sort((first, second) => stableHash(first) - stableHash(second));

    if (ordered.length === 0) return [];

    return Array.from({ length: 10 }, (_, rowIndex) => {
      const lane = Array.from(
        { length: Math.min(18, ordered.length) },
        (_, thumbnailIndex) => ordered[(rowIndex * 13 + thumbnailIndex * 5) % ordered.length],
      );

      return [...lane, ...lane];
    });
  }, [videoIds]);

  if (rows.length === 0 || rows[0].length === 0) return null;

  return (
    <div className={`${styles.thumbnailStream} ${variant === "ranking" ? styles.rankingThumbnailStream : ""}`} aria-hidden="true">
      <div className={styles.thumbnailStreamInner}>
        {rows.map((row, rowIndex) => (
          <div className={styles.thumbnailRow} data-row={rowIndex} key={rowIndex}>
            <div className={styles.thumbnailTrack}>
              {row.map((videoId, thumbnailIndex) => (
                <span
                  className={styles.thumbnailCard}
                  key={`${videoId}-${thumbnailIndex}`}
                  style={{ backgroundImage: `url("/Thumbnail/${videoId}.jpg")` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function YouTubeThumbnail({
  item,
  priority = false,
  sizes = "(max-width: 720px) 92vw, (max-width: 1100px) 45vw, 30vw",
}: {
  item: ResultItem;
  priority?: boolean;
  sizes?: string;
}) {
  const [resolution, setResolution] = useState<"maxresdefault" | "hqdefault">(
    "maxresdefault",
  );
  const title = item.title || `エントリー作品 ${item.videoId}`;

  return (
    <Image
      src={`https://i.ytimg.com/vi/${item.videoId}/${resolution}.jpg`}
      alt={`${title}のサムネイル`}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      onLoad={(event) => {
        if (
          resolution === "maxresdefault" &&
          event.currentTarget.naturalWidth <= 160
        ) {
          setResolution("hqdefault");
        }
      }}
      onError={() => setResolution("hqdefault")}
    />
  );
}

function VoteStyleVideoThumbnail({
  youtubeId,
  alt,
}: {
  youtubeId: string;
  alt: string;
}) {
  const [resolution, setResolution] = useState<"maxresdefault" | "sddefault" | "hqdefault">("maxresdefault");
  const [isHovered, setIsHovered] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const fallbackResolution = () => setResolution((current) => current === "maxresdefault" ? "sddefault" : "hqdefault");

  return (
    <div
      className="pv-video-thumb relative w-full h-full overflow-hidden"
      onMouseEnter={() => { setIsHovered(true); setHasHovered(true); }}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={() => { setIsHovered(true); setHasHovered(true); }}
    >
      <div
        className="pvt-inner w-full h-full relative"
        style={{
          transform: isHovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {hasHovered ? (
          <div className="pvt-preview-wrap absolute inset-0 z-0">
            <iframe
              className="pvt-preview-iframe-placeholder w-full h-full border-0"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=0&rel=0&playsinline=1&mute=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              style={{ pointerEvents: "none", opacity: isHovered ? 1 : 0, transition: "opacity 0.4s" }}
              title={alt}
            />
          </div>
        ) : null}
        <div className="pvt-cover absolute inset-0 z-10 transition-opacity duration-500" style={{ opacity: isHovered ? 0 : 1 }} aria-hidden="true">
          <Image
            unoptimized
            className="pvt-cover-img object-cover"
            src={`https://i.ytimg.com/vi/${youtubeId}/${resolution}.jpg`}
            alt={alt}
            fill
            sizes="28vw"
            onLoad={(event) => {
              const image = event.currentTarget;
              if (image.naturalWidth <= 160 && image.naturalHeight <= 120) fallbackResolution();
            }}
            onError={fallbackResolution}
          />
        </div>
        <div className="pvt-playbtn absolute inset-0 z-20 grid place-items-center pointer-events-none transition-transform duration-300" style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }} aria-hidden="true">
          <div className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsLoadingScreen({
  ready,
  onDismiss,
}: {
  ready: boolean;
  onDismiss: () => void;
}) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setClosing(true), 0);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <div
      className={`home-loading-screen${closing ? " home-loading-screen--closing" : ""}`}
      role="status"
      aria-label="結果発表ページを読み込んでいます"
      aria-hidden={closing}
      onTransitionEnd={(event) => {
        if (closing && event.target === event.currentTarget && event.propertyName === "opacity") onDismiss();
      }}
    >
      <div className={`${zakkuriGothic.className} home-loading-screen__grid`}>
        <span className="home-loading-screen__char home-loading-screen__char--1">や</span>
        <span className="home-loading-screen__char home-loading-screen__char--2">ま</span>
        <span className="home-loading-screen__char home-loading-screen__char--3">か</span>
        <span className="home-loading-screen__char home-loading-screen__char--4">わ</span>
      </div>
    </div>
  );
}

function ErrorState({
  kind,
  onRetry,
}: {
  kind: "not-published" | "unavailable";
  onRetry: () => void;
}) {
  if (kind === "not-published") {
    return (
      <div className={styles.errorCard} role="status">
        <p className={styles.errorEyebrow}>COMING SOON</p>
        <h1>結果はまだ公開されていません</h1>
        <p>2026年9月5日 21:00の結果発表後に公開します。</p>
        <Link href="/">トップページへ戻る</Link>
      </div>
    );
  }

  return (
    <div className={styles.errorCard} role="alert">
      <p className={styles.errorEyebrow}>CONNECTION ERROR</p>
      <h1>結果を読み込めませんでした</h1>
      <p>通信状況を確認して、もう一度お試しください。</p>
      <button type="button" onClick={onRetry}>再読み込み</button>
      <Link href="/">トップページへ戻る</Link>
    </div>
  );
}

export default function ResultsPage() {
  const lenisRef = useRef<LenisRef>(null);
  const pageRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"not-published" | "unavailable" | null>(null);
  const [selectedRankingItem, setSelectedRankingItem] = useState<ResultItem | null>(null);
  const [publishedRanks, setPublishedRanks] = useState<number[]>([]);
  const [canAdvanceResults, setCanAdvanceResults] = useState(false);
  const [thumbnailVideoIds, setThumbnailVideoIds] = useState<string[]>([]);
  const [topAssetsReady, setTopAssetsReady] = useState(false);
  const [loadingScreenVisible, setLoadingScreenVisible] = useState(true);

  const loadResults = async () => {
    setLoading(true);
    setError(null);

    try {
      setData(await requestResults());
    } catch (requestError) {
      setError(
        requestError instanceof ResultsRequestError
          ? requestError.code
          : "unavailable",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    void requestResults()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof ResultsRequestError
              ? requestError.code
              : "unavailable",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void fetch("/api/entries", { cache: "force-cache" })
      .then((response) => response.json() as Promise<EntriesData>)
      .then((payload) => {
        if (!active || !Array.isArray(payload.entries)) return;
        setThumbnailVideoIds(
          payload.entries
            .map((entry) => entry.youtubeId)
            .filter((videoId): videoId is string => typeof videoId === "string" && /^[A-Za-z0-9_-]{11}$/.test(videoId)),
        );
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    let completed = 0;
    const settle = () => {
      completed += 1;
      if (active && completed === TOP_LOADING_ASSETS.length) setTopAssetsReady(true);
    };
    TOP_LOADING_ASSETS.forEach((src) => {
      const image = new window.Image();
      let settled = false;
      const settleOnce = () => {
        if (settled) return;
        settled = true;
        settle();
      };
      image.onload = settleOnce;
      image.onerror = settleOnce;
      image.src = versionedTopAsset(src);
      if (image.complete) settleOnce();
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let poll: number | null = null;
    const applyState = (state: { publishedRanks?: number[]; canAdvance?: boolean }) => {
      if (!active || !Array.isArray(state.publishedRanks)) return;
      setPublishedRanks(state.publishedRanks.filter((rank): rank is number => Number.isInteger(rank) && rank >= 1 && rank <= 10));
      if (typeof state.canAdvance === "boolean") setCanAdvanceResults(state.canAdvance);
      void requestResults().then((result) => {
        if (active) setData(result);
      }).catch(() => undefined);
    };
    const fetchState = () => {
      void fetch("/api/live-results", { cache: "no-store" })
        .then((response) => response.ok ? response.json() : null)
        .then((state) => { if (state) applyState(state); })
        .catch(() => undefined);
    };

    fetchState();
    if (location.hostname !== "localhost") {
      const protocol = location.protocol === "https:" ? "wss:" : "ws:";
      socket = new WebSocket(`${protocol}//${location.host}/api/live-results/socket`);
      socket.onmessage = (event) => {
        try { applyState(JSON.parse(event.data) as { publishedRanks?: number[] }); } catch { /* Ignore invalid broadcasts. */ }
      };
      socket.onerror = () => socket?.close();
      socket.onclose = () => { if (active) poll = window.setInterval(fetchState, 1500); };
    } else {
      poll = window.setInterval(fetchState, 1000);
    }
    return () => {
      active = false;
      socket?.close();
      if (poll !== null) window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (!selectedRankingItem) return;

    const previousOverflow = document.body.style.overflow;
    const lenis = lenisRef.current?.lenis;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedRankingItem(null);
    };

    document.body.style.overflow = "hidden";
    lenis?.stop();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedRankingItem]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || loading) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia(
      "(max-width: 1024px), (hover: none) and (pointer: coarse)",
    );

    const updateEffects = (scrollPosition: number) => {
      const safeScroll = Math.max(scrollPosition, 0);
      const progress = Math.min(safeScroll / (window.innerHeight * 0.9), 1);

      if (reducedMotion.matches || compactLayout.matches) {
        page.style.setProperty("--results-art-y", "0px");
        page.style.setProperty("--results-art-scale", "1");
        page.style.setProperty("--results-wave-y", "0px");
        page.style.setProperty("--results-title-y", "0px");
        return;
      }

      page.style.setProperty("--results-art-y", `${safeScroll * 0.14}px`);
      page.style.setProperty("--results-art-scale", `${1 + progress * 0.03}`);
      page.style.setProperty(
        "--results-wave-y",
        `${-Math.min(safeScroll * 0.04, 38)}px`,
      );
      page.style.setProperty(
        "--results-title-y",
        `${-Math.min(safeScroll * 0.075, 54)}px`,
      );
    };

    const handleScroll = () => updateEffects(window.scrollY);
    const handleResize = () => updateEffects(window.scrollY);

    updateEffects(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    reducedMotion.addEventListener("change", handleResize);
    compactLayout.addEventListener("change", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      reducedMotion.removeEventListener("change", handleResize);
      compactLayout.removeEventListener("change", handleResize);
    };
  }, [loading]);

  const rankedItems = useMemo(
    () => (data ? getRankedItems(data) : []),
    [data],
  );
  const finalRankingsUnlocked = publishedRanks.length >= 10;
  const topTenItems = Array.from({ length: 10 }, (_, index) => rankedItems.find((item) => item.slot === index + 1) ?? (finalRankingsUnlocked ? rankedItems[index] : undefined) ?? {
    videoId: `hidden-rank-${index + 1}`,
    count: 0,
    title: "",
    channelTitle: "",
    rank: index + 1,
    percentage: 0,
  });
  const podium = topTenItems.slice(0, 3);
  const remainingRankedItems = topTenItems.slice(3, 10);
  const finalRankedItems = rankedItems.slice(10);
  const requestAdvance = async (rank: number) => {
    try {
      const response = await fetch("/api/live-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "advance", rank }),
      });
      if (!response.ok) return false;
      const state = await response.json() as { publishedRanks?: number[] };
      if (Array.isArray(state.publishedRanks)) setPublishedRanks(state.publishedRanks);
      return true;
    } catch {
      return false;
    }
  };
  const finalRankGroups = Array.from(
    finalRankedItems.reduce((groups, item) => {
      const group = groups.get(item.rank) ?? [];
      group.push(item);
      groups.set(item.rank, group);
      return groups;
    }, new Map<number, RankedItem[]>()),
  );
  const streamVideoIds = thumbnailVideoIds.length > 0
    ? thumbnailVideoIds
    : data?.ranked.map((item) => item.videoId) ?? [];

  if (error || !data) {
    return (
      <main className={`${styles.page} ${lineSeedExtraBold.className}`}>
        {loading ? <ResultsLoadingScreen ready={false} onDismiss={() => undefined} /> : <ErrorState kind={error ?? "unavailable"} onRetry={() => void loadResults()} />}
      </main>
    );
  }

  return (
    <>
      {loadingScreenVisible ? (
        <ResultsLoadingScreen
          ready={topAssetsReady}
          onDismiss={() => setLoadingScreenVisible(false)}
        />
      ) : null}
      <ReactLenis ref={lenisRef} root />
      <main ref={pageRef} className={`${styles.page} ${lineSeedExtraBold.className}`}>
      <div className={styles.noise} aria-hidden="true" />
      <TopArtwork introReady={!loadingScreenVisible} />
      <section className={styles.aboutIntro} aria-labelledby="results-about-title">
        <ThumbnailStream videoIds={streamVideoIds} />
        <svg
          className={styles.aboutWave}
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="none"
            d="M0 206C166 82 326-16 530 28C735 72 820 205 1054 224C1222 238 1340 198 1440 142V280H0Z"
          />
        </svg>
        <h2 id="results-about-title" className={`${styles.aboutTitle} ${leagueGothic.className}`}>
          <span>ABOUT</span>
          <span className={styles.aboutTitleTag}>集計について</span>
        </h2>
        <div className={styles.resultsFlow}>
          <article className={styles.resultsStep}>
            <h3 className={styles.resultsStepLabel}>
              <span>1</span>
              不正投票について
            </h3>
            <div className={styles.resultsStepBody}>
              <p>
                <strong>同一人物による同一作品への複数投票</strong>と判断したものは、
                <br />
                複数票であっても<strong>1票として集計</strong>しています。
              </p>
              <p className={styles.resultsStepNote}>
                ※この処理は、不正投票と確信できるケースに限って行っています。
              </p>
            </div>
          </article>

          <article className={styles.resultsStep} data-reserve-media="true">
            <h3 className={styles.resultsStepLabel}>
              <span>2</span>
              エントリー数・投票数
            </h3>
            <div className={styles.resultsStepBody}>
              <p>
                <strong>86名の方にエントリー</strong>いただき、
                <br />
                <strong>200名を超える皆さま</strong>から投票をいただきました。
                <br />
                <strong>ご参加・ご協力</strong>、ありがとうございました！
              </p>
            </div>
            <span className={styles.resultsStepGraphic} aria-hidden="true">
              <Image
                src={versionedTopAsset("/Top/yokatta.png")}
                alt=""
                fill
                sizes="(max-width: 580px) 85vw, 30vw"
                unoptimized
              />
            </span>
          </article>
        </div>
      </section>
      {data.total === 0 ? (
        <section className={styles.empty}>
          <p className={styles.eyebrow}>RESULTS</p>
          <h2>まだ投票結果はありません</h2>
          <p>投票が集まると、ここにランキングが表示されます。</p>
          <Link href="/vote">エントリー作品を見る <ArrowIcon /></Link>
        </section>
      ) : (
        <>
          <section className={styles.rankingIntro} aria-label="ランキング">
            <div className={styles.rankingGridOverlay} aria-hidden="true" />
            <h2 className={`${styles.rankingTitle} ${leagueGothic.className}`}>
              <span>RANKING</span>
              <span className={`${styles.rankingTitleTag} ${lineSeedExtraBold.className}`}>ランキング</span>
            </h2>
            <div className={styles.rankingPreviewGrid} aria-label="上位3作品">
              {podium.map((item, index) => (
                <article
                  className={styles.rankingPreviewCard}
                  data-place={index + 1}
                  key={`podium-rank-${index + 1}`}
                  aria-label={`${index + 1}位：${item.title || "作品"}`}
                >
                  <YouTubeThumbnail
                    item={item}
                    priority={index < 2}
                    sizes={index === 0 ? "88vw" : "44vw"}
                  />
                  <Image
                    className={styles.rankingPreviewOverlay}
                    src={`/ranking/${index + 1}.png`}
                    alt=""
                    fill
                    sizes={index === 0 ? "88vw" : "44vw"}
                    unoptimized
                    aria-hidden="true"
                  />
                  <span className={`${styles.rankingPlace} ${lineSeedExtraBold.className}`} aria-hidden="true">
                    {index + 1}位
                  </span>
                  <div className={styles.rankingCopy}>
                    <div className={styles.rankingChannel}>
                      {item.channelIcon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.channelIcon} alt="" />
                      ) : (
                        <span className={styles.rankingChannelFallback} aria-hidden="true">
                          {(item.channelTitle || "?").slice(0, 1)}
                        </span>
                      )}
                      <span>{item.channelTitle || "参加クリエイター"}</span>
                    </div>
                    <h3>{item.title || "タイトル未取得の作品"}</h3>
                  </div>
                  <button
                    className={styles.rankingEmbed}
                    type="button"
                    onClick={() => setSelectedRankingItem(item)}
                    aria-label={`${item.title || "作品"}を再生`}
                  >
                    <VoteStyleVideoThumbnail youtubeId={item.videoId} alt={`${item.title || "作品"}のサムネイル`} />
                  </button>
                  <BroadcastReveal
                    rank={index + 1}
                    mode="podium"
                    published={publishedRanks.includes(index + 1)}
                    canAdvance={canAdvanceResults && !publishedRanks.includes(index + 1)}
                    onRequestAdvance={requestAdvance}
                  />
                </article>
              ))}
            </div>
          </section>
          <div className={styles.resultsDivider} aria-hidden="true">
            <div className={`${styles.resultsDividerTrack} ${syncopate.className}`}>
              <span>{"YAMAKAWATERUKI\u00a0\u00a0\u00a0".repeat(12)}</span>
              <span>{"YAMAKAWATERUKI\u00a0\u00a0\u00a0".repeat(12)}</span>
            </div>
          </div>
          <EndLogoSection videoIds={streamVideoIds}>
            {remainingRankedItems.length > 0 ? (
              <section className={styles.lowerRanking} aria-label="4位から10位の作品">
                <div className={styles.lowerRankingGrid}>
                  {remainingRankedItems.map((item, index) => (
                    <div className={styles.lowerRankingRow} data-side={index % 2 === 0 ? "left" : "right"} key={`lower-rank-${index + 4}`}>
                    <div className={styles.rankingMarginMark} aria-hidden="true">
                      <strong className={styles.lowerRankingPlace}>{index + 4}<small>位</small></strong>
                    </div>
                    <article
                      className={styles.lowerRankingCard}
                      data-side={index % 2 === 0 ? "left" : "right"}
                      aria-label={`${index + 4}位：${item.title || "作品"}`}
                    >
                      <YouTubeThumbnail
                        item={item}
                        sizes="(max-width: 760px) 100vw, 72vw"
                      />
                      {index + 4 !== 7 ? (
                        <Image
                          className={styles.lowerRankingOverlay}
                          src={`/ranking/${index + 4}.png`}
                          alt=""
                          fill
                          sizes="(max-width: 760px) 100vw, 72vw"
                          unoptimized
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className={styles.lowerRankingCopy}>
                        <div className={styles.rankingChannel}>
                          {item.channelIcon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.channelIcon} alt="" />
                          ) : (
                            <span className={styles.rankingChannelFallback} aria-hidden="true">
                              {(item.channelTitle || "?").slice(0, 1)}
                            </span>
                          )}
                          <span>{item.channelTitle || "参加クリエイター"}</span>
                        </div>
                        <h3>{item.title || "タイトル未取得の作品"}</h3>
                      </div>
                      <button
                        className={styles.lowerRankingEmbed}
                        type="button"
                        onClick={() => setSelectedRankingItem(item)}
                        aria-label={`${item.title || "作品"}を再生`}
                      >
                        <VoteStyleVideoThumbnail youtubeId={item.videoId} alt={`${item.title || "作品"}のサムネイル`} />
                      </button>
                      <BroadcastReveal
                        rank={index + 4}
                        mode="standard"
                        side={index % 2 === 0 ? "left" : "right"}
                        published={publishedRanks.includes(index + 4)}
                        canAdvance={canAdvanceResults && !publishedRanks.includes(index + 4)}
                        onRequestAdvance={requestAdvance}
                      />
                    </article>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </EndLogoSection>
          <RankingTailSection locked={!finalRankingsUnlocked}>
              {finalRankingsUnlocked ? (
                <div className={styles.rankingTailGroups}>
                  {finalRankGroups.map(([rank, items]) => (
                    <section className={styles.rankingTailGroup} key={rank}>
                      <h2 className={styles.rankingTailGroupLabel}>
                        {rank}位{items.length > 1 ? "タイ" : ""}の動画
                      </h2>
                      <ol className={styles.rankingTailList}>
                        {items.map((item) => (
                          <li className={styles.rankingTailItem} key={item.videoId}>
                            <button
                              className={styles.rankingTailThumbnail}
                              type="button"
                              onClick={() => setSelectedRankingItem(item)}
                              aria-label={`${item.title || "作品"}を再生`}
                            >
                              <VoteStyleVideoThumbnail youtubeId={item.videoId} alt={`${item.title || "作品"}のサムネイル`} />
                            </button>
                            <div className={styles.rankingTailCopy}>
                              <div className={styles.rankingTailChannel}>
                                {item.channelIcon ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={item.channelIcon} alt="" />
                                ) : (
                                  <span aria-hidden="true">{(item.channelTitle || "?").slice(0, 1)}</span>
                                )}
                                <p>{item.channelTitle || "参加クリエイター"}</p>
                              </div>
                              <h3>{item.title || "タイトル未取得の作品"}</h3>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </section>
                  ))}
                </div>
              ) : (
                <div className={styles.rankingTailLock} role="status" aria-live="polite">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo/logo.png" alt="" aria-hidden="true" />
                  <div>
                    <strong>10位以下</strong>
                    <p>1位から10位をすべて表示すると解除されます！</p>
                  </div>
                </div>
              )}
            </RankingTailSection>
        </>
      )}

      <footer
        style={{
          backgroundColor: "#000000",
          borderTop: "1px solid #222222",
          padding: "3rem 1.5rem",
          textAlign: "center",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
        }}
      >
        {/* The app's local image policy excludes /logo, so keep this footer asset
            unoptimized rather than routing it through next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo.png"
          alt="やまかわ動画編集大会"
          style={{
            height: "auto",
            width: "clamp(300px, 50vw, 540px)",
            display: "block",
          }}
        />
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "center" }}>
          <Link
            href="/policy"
            style={{
              color: "#ffffff",
              textDecoration: "underline",
              fontSize: "0.95rem",
              opacity: 0.85,
            }}
          >
            プライバシーポリシー
          </Link>
          <a
            href="https://github.com/y-exe/votesites"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#ffffff",
              textDecoration: "underline",
              fontSize: "0.95rem",
              opacity: 0.85,
            }}
          >
            OSS
          </a>
        </div>
      </footer>
      {selectedRankingItem ? (
        <div
          className="fixed z-[1000] inset-0 grid place-items-center p-[clamp(1rem,4vw,3rem)] bg-[rgb(0_0_0_/_82%)] backdrop-blur-[10px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedRankingItem(null);
          }}
        >
          <div
            className="relative w-[min(92vw,74rem)] h-[90vh] sm:h-auto py-[2vh] sm:py-0 flex flex-col justify-between sm:justify-center sm:gap-[clamp(0.8rem,2vw,1.5rem)]"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedRankingItem.title || "エントリー動画"}を再生`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedRankingItem(null);
            }}
          >
            <div
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 text-white shrink-0"
              style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 2px 5px rgba(0,0,0,0.8)" }}
            >
              <div className="flex items-center gap-3 shrink-0">
              {selectedRankingItem.channelIcon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedRankingItem.channelIcon} alt={selectedRankingItem.channelTitle} className="w-[clamp(2.5rem,4.5vw,3.5rem)] h-[clamp(2.5rem,4.5vw,3.5rem)] rounded-full shadow-[0_0_0_1px_rgba(0,0,0,1)] object-cover bg-neutral-900" />
              ) : (
                <div className="w-[clamp(2.5rem,4.5vw,3.5rem)] h-[clamp(2.5rem,4.5vw,3.5rem)] rounded-full shadow-[0_0_0_1px_rgba(0,0,0,1)] bg-neutral-800 flex items-center justify-center font-bold text-xl">{selectedRankingItem.channelTitle?.charAt(0) || "?"}</div>
              )}
                <h3 className="font-bold text-[clamp(1.1rem,2vw,1.5rem)] line-clamp-1">{selectedRankingItem.channelTitle || "Unknown Channel"}</h3>
              </div>
              <p className="text-[clamp(0.85rem,1.5vw,1rem)] font-medium line-clamp-4 sm:line-clamp-2 sm:text-right sm:max-w-[60%]" style={{ whiteSpace: "pre-wrap" }}>{selectedRankingItem.description || selectedRankingItem.title}</p>
            </div>
            <div className="relative w-full aspect-video overflow-hidden rounded-[clamp(0.9rem,2vw,1.7rem)] bg-black shadow-[0_1.5rem_5rem_rgb(0_0_0_/_55%)] shrink-0 my-auto sm:my-0">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedRankingItem.videoId}?autoplay=1`}
                title={selectedRankingItem.title || "エントリー動画"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
            <div className="flex justify-center mt-2 shrink-0">
              <a className="vote-entry-playlist-button home-reel-trigger" href={`https://youtube.com/watch?v=${selectedRankingItem.videoId}`} target="_blank" rel="noopener noreferrer" aria-label="YouTubeで見る" style={{ margin: 0 }}>
                <YouTubeLogo className="vote-entry-playlist-button__logo" />
                <ReelText label="YouTubeで見る →" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
      </main>
    </>
  );
}
