"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { League_Gothic } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ReactLenis, type LenisRef } from "lenis/react";
import { editingAppIcons } from "./equipment-data";
import DiscordLogo from "./discord-logo";
import {
  type CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const EquipmentFlow = dynamic(() => import("./equipment-flow"), {
  ssr: false,
});

declare global {
  interface Window {
    Typekit?: {
      load: (config: { kitId: string; scriptTimeout: number; async: boolean }) => void;
    };
  }
}

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const lineSeedExtraBold = localFont({
  src: "./fonts/LINESeedJP-ExtraBold.ttf",
  weight: "800",
  style: "normal",
  display: "block",
  fallback: ["sans-serif"],
});

const zakkuriGothic = localFont({
  src: "./fonts/ZakkuriGothicFree-Black.otf",
  weight: "900",
  style: "normal",
  display: "swap",
  fallback: ["sans-serif"],
});

const homeQaItems = [
  { question: "誰でも参加できますか？", answer: "応募条件を満たしていれば、編集歴や使用ソフトを問わず参加できます。" },
  { question: "どんな動画を作ればいいですか？", answer: "指定素材を使い、YouTube風やMADなど自由な世界観で編集してください。" },
  { question: "編集ソフトに指定はありますか？", answer: "ありません。普段お使いの編集ソフトで制作できます。" },
  { question: "動画の公開設定は？", answer: "公開または限定公開で投稿してください。非公開動画は応募できません。" },
  { question: "どうやって応募しますか？", answer: "YouTubeへ動画を投稿し、そのURLをGoogleフォームから送信してください。" },
  { question: "応募締切はいつですか？", answer: "2026年8月28日 23:59です。余裕をもって送信してください。" },
  { question: "投票期間はいつですか？", answer: "2026年8月29日 20:00から9月4日 23:59までです。" },
  { question: "投票にDiscordは必要ですか？", answer: "重複・不正投票を防ぐため、Discordでのログインが必要です。" },
  { question: "投票先は変更できますか？", answer: "投票期間中であれば、別の作品へ投票を移行できます。" },
  { question: "結果はいつ分かりますか？", answer: "途中順位は非公開です。9月5日 21:00の生放送で発表します。" },
] as const;

const homeQaBackdropWords = Array.from({ length: 6 }, () => "やまかわてるき");

const videoPaths = Array.from({ length: 20 }, (_, index) =>
  `/video-preview/${index + 1}.mp4`,
);

function getVideoPoster(src: string) {
  return src.replace("/video-preview/", "/video-preview/posters/").replace(/\.mp4$/, ".webp");
}

type AmbientMediaMode = "poster" | "video" | "ios-image";

type NavigatorWithConnection = Navigator & {
  connection?: EventTarget & { saveData?: boolean };
};

function getAmbientMediaMode(): AmbientMediaMode {
  const navigatorWithConnection = navigator as NavigatorWithConnection;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const shouldSaveData = navigatorWithConnection.connection?.saveData === true;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return shouldSaveData || reduceMotion ? "poster" : isIOS ? "ios-image" : "video";
}

function subscribeAmbientMediaMode(callback: () => void) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as NavigatorWithConnection).connection;

  reduceMotion.addEventListener("change", callback);
  connection?.addEventListener("change", callback);

  return () => {
    reduceMotion.removeEventListener("change", callback);
    connection?.removeEventListener("change", callback);
  };
}

function useAmbientMediaMode() {
  const mode = useSyncExternalStore<AmbientMediaMode>(
    subscribeAmbientMediaMode,
    getAmbientMediaMode,
    (): AmbientMediaMode => "poster",
  );

  return mode;
}

function AmbientMedia({
  src,
  className,
  mode,
}: {
  src: string;
  className?: string;
  mode: AmbientMediaMode;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [motionFailed, setMotionFailed] = useState(false);
  const poster = getVideoPoster(src);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isNearViewport || mode !== "video") return;

    video.muted = true;
    video.defaultMuted = true;
    const playback = video.play();
    playback?.catch(() => setMotionFailed(true));

    return () => video.pause();
  }, [isNearViewport, mode]);

  return (
    <span className="ambient-media" data-media-mode={mode} ref={hostRef}>
      <Image
        className={`ambient-media__poster${className ? ` ${className}` : ""}`}
        src={poster}
        alt=""
        fill
        sizes="(max-width: 640px) 60vw, 28vw"
        unoptimized
      />
      {isNearViewport && mode === "video" && !motionFailed ? (
        <video
          className={`ambient-media__motion${className ? ` ${className}` : ""}`}
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          onLoadedMetadata={(event) => {
            const player = event.currentTarget;
            player.muted = true;
            player.defaultMuted = true;
            if (Number.isFinite(player.duration) && player.duration > 0) {
              player.currentTime = Math.random() * player.duration;
            }
          }}
          onError={() => setMotionFailed(true)}
        />
      ) : null}
      {isNearViewport && mode === "ios-image" && !motionFailed ? (
        // Safari supports short MP4 files in image elements without media controls.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`ambient-media__motion${className ? ` ${className}` : ""}`}
          src={src}
          alt=""
          onError={() => setMotionFailed(true)}
        />
      ) : null}
    </span>
  );
}

const initialRows = {
  top: videoPaths.slice(0, 10),
  bottom: videoPaths.slice(10, 20),
};

let browserRows: typeof initialRows | undefined;

function YouTubeLogo() {
  return (
    <svg
      className="home-about__youtube-svg"
      viewBox="0 0 28 20"
      aria-hidden="true"
    >
      <path
        fill="#ff0033"
        d="M27.4 3.1A3.5 3.5 0 0 0 25 0.6C22.8 0 18.5 0 14 0S5.2 0 3 0.6A3.5 3.5 0 0 0 0.6 3.1C0 5.3 0 7.7 0 10s0 4.7 0.6 6.9A3.5 3.5 0 0 0 3 19.4c2.2 0.6 6.5 0.6 11 0.6s8.8 0 11-0.6a3.5 3.5 0 0 0 2.4-2.5c0.6-2.2 0.6-4.6 0.6-6.9s0-4.7-0.6-6.9Z"
      />
      <path fill="#fff" d="m11.2 14.3 7.3-4.3-7.3-4.3z" />
    </svg>
  );
}

function TwitterLogo() {
  return (
    <svg
      className="home-social__twitter-logo"
      viewBox="0 0 512 512"
      aria-hidden="true"
    >
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

function HeroReelLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="home-hero__action" href={href} aria-label={label}>
      <ReelText label={label} />
    </a>
  );
}

function EntryVideoTitle({ videos }: { videos: string[] }) {
  const letters = [..."ENTRY"];
  const letterCenters = letters.map((_, index) => 600 + (index - 2) * 205);
  const mediaMode = useAmbientMediaMode();

  return (
    <div className="home-about__entry-video-title" aria-hidden="true">
      <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid meet">
        <defs>
          {letters.map((letter, index) => (
            <clipPath id={`entry-video-letter-${index}`} key={letter}>
              <text
                className={leagueGothic.className}
                x={letterCenters[index]}
                y="440"
                textAnchor="middle"
                fontSize="640"
                fontWeight="400"
              >
                {letter}
              </text>
            </clipPath>
          ))}
        </defs>
        {letters.map((letter, index) => {
          const video = videos[index % videos.length];
          const clipPath = `url(#entry-video-letter-${index})`;

          return (
            <g key={letter}>
              <image
                x={letterCenters[index] - 120}
                y="0"
                width="240"
                height="620"
                href={getVideoPoster(video)}
                preserveAspectRatio="xMidYMid slice"
                clipPath={clipPath}
              />
              {mediaMode === "ios-image" ? (
                <image
                  className="home-about__entry-video-image"
                  x={letterCenters[index] - 120}
                  y="0"
                  width="240"
                  height="620"
                  href={video}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={clipPath}
                />
              ) : null}
              {mediaMode === "video" ? (
                <foreignObject
                  x={letterCenters[index] - 120}
                  y="0"
                  width="240"
                  height="620"
                  clipPath={clipPath}
                >
                  <AmbientMedia
                    className="home-about__entry-video"
                    src={video}
                    mode={mediaMode}
                  />
                </foreignObject>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MovingGrid() {
  return <div className="home-after-about__grid" aria-hidden="true" />;
}

function pickRows() {
  const shuffled = [...videoPaths].sort(() => Math.random() - 0.5);

  return {
    top: shuffled.slice(0, 10),
    bottom: shuffled.slice(10, 20),
  };
}

function subscribe() {
  return () => {};
}

function getBrowserRows() {
  browserRows ??= pickRows();
  return browserRows;
}

function getCardVariant(id: string) {
  let value = 0;

  for (const character of id) {
    value = (value * 31 + character.charCodeAt(0)) >>> 0;
  }

  return value % 6;
}

function getEdgeSlope(boundaryIndex: number) {
  const value = Math.imul(boundaryIndex + 1, 2_654_435_761) >>> 0;
  const slopes = [-18, -14, -10, -6, 0, 6, 10, 14, 18];

  return slopes[value % slopes.length];
}

function getRoundedClipPath(leftSlope: number, rightSlope: number) {
  const leftTop = leftSlope > 0 ? 0 : -leftSlope;
  const leftBottom = leftSlope > 0 ? leftSlope : 0;
  const rightTop = rightSlope > 0 ? 100 - rightSlope : 100;
  const rightBottom = rightSlope > 0 ? 100 : 100 + rightSlope;
  const points = [
    { x: leftTop, y: 0 },
    { x: rightTop, y: 0 },
    { x: rightBottom, y: 100 },
    { x: leftBottom, y: 100 },
  ];
  const cornerRadius = 4;
  const roundedCorners = points.map((point, index) => {
    const previous = points.at((index + points.length - 1) % points.length)!;
    const next = points[(index + 1) % points.length];
    const previousDistance = Math.hypot(previous.x - point.x, previous.y - point.y);
    const nextDistance = Math.hypot(next.x - point.x, next.y - point.y);
    const radius = Math.min(cornerRadius, previousDistance / 2, nextDistance / 2);

    return {
      point,
      start: {
        x: point.x + ((previous.x - point.x) * radius) / previousDistance,
        y: point.y + ((previous.y - point.y) * radius) / previousDistance,
      },
      end: {
        x: point.x + ((next.x - point.x) * radius) / nextDistance,
        y: point.y + ((next.y - point.y) * radius) / nextDistance,
      },
    };
  });
  const coordinate = (value: number) => (value / 100).toFixed(4);
  const first = roundedCorners[0];
  const commands = roundedCorners.map(({ point, start, end }, index) => {
    const line = index === 0 ? "" : `L ${coordinate(start.x)} ${coordinate(start.y)} `;

    return `${line}Q ${coordinate(point.x)} ${coordinate(point.y)} ${coordinate(end.x)} ${coordinate(end.y)} `;
  });

  return `M ${coordinate(first.start.x)} ${coordinate(first.start.y)} ${commands.join("")}Z`;
}

function getVerticalOffset(cardIndex: number) {
  const offsets = ["-0.65rem", "0.4rem", "-0.9rem", "0.7rem", "-0.35rem", "0.95rem"];

  return offsets[cardIndex % offsets.length];
}

function VideoRow({
  videos,
  direction,
  variant = "page",
  scrollReactive = false,
}: {
  videos: string[];
  direction: "left" | "right";
  variant?: "page" | "card" | "closing";
  scrollReactive?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const clipPrefix = useId().replaceAll(":", "");
  const mediaMode = useAmbientMediaMode();
  const [cards] = useState(() => {
    const created = videos.map((src, index) => ({
      id: `${src}-${index}`,
      src,
      variant: getCardVariant(`${src}-${index}`),
      leftSlope: variant === "closing" ? 0 : getEdgeSlope(index),
      rightSlope: variant === "closing" ? 0 : getEdgeSlope(index + 1),
      verticalOffset: variant === "closing" ? "0rem" : getVerticalOffset(index),
    }));

    created.at(-1)!.rightSlope = created[0].leftSlope;
    return created;
  });

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame = 0;
    let previousTime = performance.now();
    let offset = 0;
    let initialized = false;
    const speed = 58;
    let lastScrollPosition = window.scrollY;
    let lastScrollTime = performance.now();
    let lastScrollEventTime = lastScrollTime;
    let targetScrollMultiplier = 1;
    let scrollMultiplier = 1;
    const compactMedia = window.matchMedia("(max-width: 1024px)");
    let scrollReactivityEnabled = scrollReactive && !compactMedia.matches;

    const handleScroll = () => {
      if (!scrollReactivityEnabled) return;

      const now = performance.now();
      const elapsed = Math.min(Math.max(now - lastScrollTime, 8), 80);
      const scrollPosition = window.scrollY;
      const velocity = ((scrollPosition - lastScrollPosition) / elapsed) * 1000;
      const velocityRatio = Math.min(Math.abs(velocity) / 1400, 1);

      if (velocity > 2) {
        targetScrollMultiplier = 1.25 + velocityRatio * 3.75;
      } else if (velocity < -2) {
        targetScrollMultiplier = -(0.9 + velocityRatio * 3.75);
      }

      lastScrollPosition = scrollPosition;
      lastScrollTime = now;
      lastScrollEventTime = now;
    };

    const syncScrollReactivity = () => {
      window.removeEventListener("scroll", handleScroll);
      scrollReactivityEnabled = scrollReactive && !compactMedia.matches;
      targetScrollMultiplier = 1;
      scrollMultiplier = 1;
      lastScrollPosition = window.scrollY;
      lastScrollTime = performance.now();
      lastScrollEventTime = lastScrollTime;

      if (scrollReactivityEnabled) {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }
    };

    syncScrollReactivity();
    compactMedia.addEventListener("change", syncScrollReactivity);

    const animate = (now: number) => {
      const firstGroup = track.firstElementChild as HTMLElement | null;
      const groupWidth = firstGroup?.offsetWidth ?? 0;

      if (groupWidth === 0) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      if (!initialized) {
        offset = direction === "left" ? 0 : -groupWidth;
        initialized = true;
      }

      const elapsed = Math.min(now - previousTime, 100);
      previousTime = now;

      if (scrollReactivityEnabled) {
        const elapsedSeconds = elapsed / 1000;

        if (now - lastScrollEventTime > 90) {
          targetScrollMultiplier +=
            (1 - targetScrollMultiplier) * Math.min(elapsedSeconds * 5.5, 1);
        }

        scrollMultiplier +=
          (targetScrollMultiplier - scrollMultiplier) *
          Math.min(elapsedSeconds * 10, 1);
      }

      offset +=
        (direction === "left" ? -1 : 1) *
        speed *
        scrollMultiplier *
        (elapsed / 1000);

      while (offset <= -groupWidth) {
        offset += groupWidth;
      }

      while (offset >= 0) {
        offset -= groupWidth;
      }

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      animationFrame = requestAnimationFrame(animate);
    };

    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      compactMedia.removeEventListener("change", syncScrollReactivity);
    };
  }, [direction, scrollReactive]);

  useLayoutEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const syncCardSpacing = () => {
      const groups = Array.from(track.children) as HTMLElement[];

      groups.forEach((group) => {
        const cardElements = Array.from(group.children) as HTMLElement[];
        const gap = Number.parseFloat(getComputedStyle(group).columnGap) || 0;
        let previousWidth = 0;
        let translateX = 0;
        let layoutWidth = 0;

        cardElements.forEach((card, index) => {
          if (index > 0) {
            const slope = Math.abs(Number.parseFloat(card.dataset.leftSlope ?? "0"));
            const currentCut = (card.offsetWidth * slope) / 100;
            const previousCut = (previousWidth * slope) / 100;

            translateX -= (currentCut + previousCut) / 2;
          }

          card.style.setProperty("--card-translate-x", `${translateX}px`);
          previousWidth = card.offsetWidth;
          layoutWidth += card.offsetWidth + gap;
        });

        const firstCard = cardElements[0];
        const firstSlope = Math.abs(Number.parseFloat(firstCard?.dataset.leftSlope ?? "0"));
        const firstCut = ((firstCard?.offsetWidth ?? 0) * firstSlope) / 100;
        const lastCut = (previousWidth * firstSlope) / 100;
        const visibleWidth = layoutWidth + translateX - (firstCut + lastCut) / 2;

        group.style.width = `${Math.max(visibleWidth, 1)}px`;
      });
    };

    const resizeObserver = new ResizeObserver(syncCardSpacing);
    resizeObserver.observe(track);
    syncCardSpacing();

    return () => resizeObserver.disconnect();
  }, [cards]);

  return (
    <div
      className={`video-row video-row--${direction} video-row--${variant}`}
      aria-hidden="true"
    >
      <div className="video-row__tilt">
        <div ref={trackRef} className="video-row__track">
          {Array.from({ length: 2 }, (_, groupIndex) =>
            <div className="video-row__group" key={groupIndex}>
              {cards.map(({ id, src, variant, leftSlope, rightSlope, verticalOffset }) => {
                const clipId = `${clipPrefix}-video-clip-${groupIndex}-${id.replace(/[^a-z0-9-]/gi, "-")}`;

                return (
                  <div
                    className={`video-card video-card--${variant}`}
                    key={`${id}-${groupIndex}`}
                    data-left-slope={leftSlope}
                    style={
                      {
                        "--card-offset": verticalOffset,
                      } as CSSProperties
                    }
                  >
                    <svg className="video-card__clip" width="0" height="0" aria-hidden="true">
                      <defs>
                        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                          <path d={getRoundedClipPath(leftSlope, rightSlope)} />
                        </clipPath>
                      </defs>
                    </svg>
                    <div
                      className="video-card__media"
                      style={{ clipPath: `url(#${clipId})` }}
                    >
                      <AmbientMedia src={src} mode={mediaMode} />
                    </div>
                  </div>
                );
              })}
            </div>,
          )}
        </div>
      </div>
    </div>
  );
}

function EditingContestWall() {
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) return;

    const offsets = Array.from({ length: 10 }, () => 0);
    let initialized = false;
    let animationFrame = 0;
    let previousTime = performance.now();
    let lastScrollPosition = window.scrollY;
    let lastScrollTime = previousTime;
    let lastScrollEventTime = previousTime;
    let targetScrollMultiplier = 1;
    let scrollMultiplier = 1;
    const compactMedia = window.matchMedia("(max-width: 1024px)");
    let scrollReactivityEnabled = !compactMedia.matches;

    const handleScroll = () => {
      if (!scrollReactivityEnabled) return;

      const now = performance.now();
      const elapsed = Math.min(Math.max(now - lastScrollTime, 8), 80);
      const scrollPosition = window.scrollY;
      const velocity = ((scrollPosition - lastScrollPosition) / elapsed) * 1000;
      const velocityRatio = Math.min(Math.abs(velocity) / 1400, 1);

      if (velocity > 2) {
        targetScrollMultiplier = 1.2 + velocityRatio * 3.8;
      } else if (velocity < -2) {
        targetScrollMultiplier = -(0.9 + velocityRatio * 3.8);
      }

      lastScrollPosition = scrollPosition;
      lastScrollTime = now;
      lastScrollEventTime = now;
    };

    const animate = (now: number) => {
      const elapsed = Math.min(now - previousTime, 100);
      const elapsedSeconds = elapsed / 1000;
      previousTime = now;
      const groupWidths = trackRefs.current.map((track) => {
        const firstGroup = track?.firstElementChild as HTMLElement | null;
        return firstGroup?.offsetWidth ?? 0;
      });

      if (!initialized && groupWidths.every((width) => width > 0)) {
        groupWidths.forEach((width, index) => {
          offsets[index] = index % 2 === 0 ? -width : 0;
        });
        initialized = true;
      }

      if (scrollReactivityEnabled && now - lastScrollEventTime > 90) {
        targetScrollMultiplier +=
          (1 - targetScrollMultiplier) * Math.min(elapsedSeconds * 5.5, 1);
      }

      if (scrollReactivityEnabled) {
        scrollMultiplier +=
          (targetScrollMultiplier - scrollMultiplier) *
          Math.min(elapsedSeconds * 10, 1);
      }

      trackRefs.current.forEach((track, index) => {
        const groupWidth = groupWidths[index];

        if (!track || groupWidth <= 0) return;

        const direction = index % 2 === 0 ? 1 : -1;
        const rowSpeed = 30 + (index % 3) * 4;
        offsets[index] +=
          direction * rowSpeed * scrollMultiplier * elapsedSeconds;

        while (offsets[index] <= -groupWidth) offsets[index] += groupWidth;
        while (offsets[index] >= 0) offsets[index] -= groupWidth;

        track.style.transform = `translate3d(${offsets[index]}px, 0, 0)`;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    const syncScrollReactivity = () => {
      window.removeEventListener("scroll", handleScroll);
      scrollReactivityEnabled = !compactMedia.matches;
      targetScrollMultiplier = 1;
      scrollMultiplier = 1;
      lastScrollPosition = window.scrollY;
      lastScrollTime = performance.now();
      lastScrollEventTime = lastScrollTime;

      if (scrollReactivityEnabled) {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }
    };

    syncScrollReactivity();
    compactMedia.addEventListener("change", syncScrollReactivity);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      compactMedia.removeEventListener("change", syncScrollReactivity);
    };
  }, []);

  return (
    <div
      className="home__contest-wall"
      aria-hidden="true"
    >
      {Array.from({ length: 10 }, (_, rowIndex) => (
        <div className="home__contest-row" key={rowIndex}>
          <div
            className="home__contest-track"
            ref={(element) => {
              trackRefs.current[rowIndex] = element;
            }}
          >
            {Array.from({ length: 3 }, (_, groupIndex) => (
              <div className="home__contest-group" key={groupIndex}>
                {Array.from({ length: 5 }, (_, textIndex) => (
                  <span className="home__contest-word" key={textIndex}>
                    編集大会
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArchivedHome() {
  const rows = useSyncExternalStore(subscribe, getBrowserRows, () => initialRows);

  return (
    <main className="home">
      <VideoRow key={rows.top.join("|")} videos={rows.top} direction="left" />

      <section className="home__logo" aria-label="動画コンテスト">
        <Image
          src="/logo/logo.png"
          alt="動画コンテスト"
          width={666}
          height={375}
          preload
        />
      </section>

      <VideoRow key={rows.bottom.join("|")} videos={rows.bottom} direction="right" />
    </main>
  );
}

export function ArchivedCurrentHome() {
  const rows = useSyncExternalStore(subscribe, getBrowserRows, () => initialRows);

  return (
    <main className="home home--fresh">
      <VideoRow key={`fresh-top-${rows.top.join("|")}`} videos={rows.top} direction="left" />
      <VideoRow
        key={`fresh-bottom-${rows.bottom.join("|")}`}
        videos={rows.bottom}
        direction="right"
      />
      <EquipmentFlow />
      <section className="home__box" aria-label="メインコンテンツ">
        <span className="home__mesh home__mesh--top" aria-hidden="true">
          <span className="home__mesh-pattern" />
        </span>
        <span className="home__mesh home__mesh--bottom" aria-hidden="true">
          <span className="home__mesh-pattern" />
        </span>
      </section>
    </main>
  );
}

export default function Home() {
  const lenisRef = useRef<LenisRef>(null);
  const pageRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const rows = useSyncExternalStore(subscribe, getBrowserRows, () => initialRows);
  const [homeLoaderVisible, setHomeLoaderVisible] = useState(true);
  const [homeLoaderClosing, setHomeLoaderClosing] = useState(false);
  const [equipmentEnabled, setEquipmentEnabled] = useState(false);
  const [fontGuideOpen, setFontGuideOpen] = useState(false);
  const [materialDownloadOpen, setMaterialDownloadOpen] = useState(false);
  const [colorCopied, setColorCopied] = useState(false);
  const [discordAuthState, setDiscordAuthState] = useState<
    "loading" | "authenticated" | "anonymous"
  >("loading");

  const copyMainCaptionColor = async () => {
    try {
      await navigator.clipboard.writeText("#C30202");
      setColorCopied(true);
      setTimeout(() => setColorCopied(false), 2000);
    } catch {}
  };

  useEffect(() => {
    if (!fontGuideOpen && !materialDownloadOpen) return;

    const previousOverflow = document.body.style.overflow;
    const lenis = lenisRef.current?.lenis;
    const closeModal = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFontGuideOpen(false);
        setMaterialDownloadOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    lenis?.stop();
    window.addEventListener("keydown", closeModal);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", closeModal);
    };
  }, [fontGuideOpen, materialDownloadOpen]);

  useEffect(() => {
    const minimumDuration = 700;
    const startedAt = performance.now();
    const previousOverflow = document.body.style.overflow;
    let hideTimer = 0;
    let cancelled = false;

    document.body.style.overflow = "hidden";

    const bannerImages = ["/banner/back.png", "/banner/front.png"];
    let loadedCount = 0;

    const checkAndBeginClosing = () => {
      if (cancelled) return;
      loadedCount++;
      if (loadedCount >= bannerImages.length) {
        const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));
        hideTimer = window.setTimeout(() => {
          if (!cancelled) setHomeLoaderClosing(true);
        }, remaining);
      }
    };

    bannerImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      if (img.complete) {
        checkAndBeginClosing();
      } else {
        img.onload = checkAndBeginClosing;
        img.onerror = checkAndBeginClosing;
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(hideTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (homeLoaderVisible) return;

    const section = aboutSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEquipmentEnabled(true);
        observer.disconnect();
      },
      { rootMargin: "50% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [homeLoaderVisible]);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as { authenticated?: boolean };
        if (active) {
          setDiscordAuthState(payload.authenticated ? "authenticated" : "anonymous");
        }
      } catch {
        if (active) setDiscordAuthState("anonymous");
      }
    };

    void loadSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const updateEffects = (scrollPosition: number) => {
      const safeScroll = Math.max(scrollPosition, 0);
      const progress = Math.min(safeScroll / (window.innerHeight * 0.9), 1);
      const isPhone = window.innerWidth <= 640;
      const hasTouchInput = coarsePointer.matches || navigator.maxTouchPoints > 0;
      const stabilizeHeroImage = hasTouchInput || window.innerWidth <= 1024;
      const baseScale = isPhone ? 1.12 : 1.08;

      if (reducedMotion.matches) {
        page.style.setProperty("--home-image-y", "0px");
        page.style.setProperty("--home-image-scale", `${baseScale}`);
        page.style.setProperty("--home-image-dim", "0");
        page.style.setProperty("--home-wave-y", "0px");
        page.style.setProperty("--home-title-y", "0px");
        return;
      }

      page.style.setProperty(
        "--home-image-y",
        stabilizeHeroImage ? "0px" : `${safeScroll * 0.2}px`,
      );
      page.style.setProperty(
        "--home-image-scale",
        `${stabilizeHeroImage ? baseScale : baseScale + progress * 0.035}`,
      );
      page.style.setProperty("--home-image-dim", `${progress * 0.52}`);
      page.style.setProperty(
        "--home-wave-y",
        `${-Math.min(safeScroll * (isPhone ? 0.028 : 0.04), isPhone ? 26 : 38)}px`,
      );
      page.style.setProperty(
        "--home-title-y",
        `${-Math.min(safeScroll * (isPhone ? 0.05 : 0.075), isPhone ? 38 : 54)}px`,
      );
    };

    const handleScroll = () => {
      updateEffects(window.scrollY);
    };

    const handleResize = () => {
      updateEffects(window.scrollY);
    };

    updateEffects(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {homeLoaderVisible ? (
        <div
          className={`home-loading-screen${
            homeLoaderClosing ? " home-loading-screen--closing" : ""
          }`}
          role="status"
          aria-label="ホームページを読み込んでいます"
          aria-hidden={homeLoaderClosing}
          onTransitionEnd={(event) => {
            if (
              !homeLoaderClosing ||
              event.target !== event.currentTarget ||
              event.propertyName !== "opacity"
            ) {
              return;
            }

            document.body.style.overflow = "";
            setHomeLoaderVisible(false);
          }}
        >
          <div className={`${zakkuriGothic.className} home-loading-screen__grid`}>
            <span className="home-loading-screen__char home-loading-screen__char--1">
              か
            </span>
            <span className="home-loading-screen__char home-loading-screen__char--2">
              や
            </span>
            <span className="home-loading-screen__char home-loading-screen__char--3">
              わ
            </span>
            <span className="home-loading-screen__char home-loading-screen__char--4">
              ま
            </span>
          </div>
        </div>
      ) : null}
      <Script
        id="adobe-fonts-source-han-sans"
        src="https://use.typekit.net/cwv7vdu.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.Typekit?.load({
            kitId: "cwv7vdu",
            scriptTimeout: 3000,
            async: true,
          });
        }}
      />
      <ReactLenis ref={lenisRef} root />
      <main ref={pageRef} className="home-page home--blank">
        <section className="home home--hero" aria-labelledby="home-hero-title">
          <div className="home__banner-visual">
            <Image
              className="home__layer home__banner-layer home__banner-layer--back"
              src="/banner/back.png"
              alt=""
              fill
              sizes="100vw"
              priority
            />
            <EditingContestWall />
            <Image
              className="home__layer home__banner-layer home__banner-layer--front"
              src="/banner/front.png"
              alt=""
              fill
              sizes="100vw"
              priority
            />
          </div>

          <div className="home-hero__topbar">
            <p className={`${lineSeedExtraBold.className} home-hero__brand`}>
              <span className="home-hero__brand-desktop">やまかわ動画編集大会</span>
              <span className="home-hero__brand-mobile">編集大会</span>
            </p>
            <nav
              className={`${lineSeedExtraBold.className} home-social`}
              aria-label="ソーシャルメディア"
            >
              <a
                className="home-social__link"
                href="https://youtube.com/@yamakawateruki?si=Hb3Fn6Wdkz4tyfs5"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTubeを開く"
              >
                <YouTubeLogo />
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

          <h1
            id="home-hero-title"
            className={`${lineSeedExtraBold.className} home-hero__callout`}
          >
            <span>編集者よ</span>
            <span>集まれ!!</span>
          </h1>

          <nav
            className={`${lineSeedExtraBold.className} home-hero__actions`}
            aria-label="ページ内メニュー"
          >
            <HeroReelLink href="#entry-card-title" label="エントリー　→" />
            <HeroReelLink href="#home-vote-title" label="投票　→" />
          </nav>
        </section>

      <section
        className="home-about"
        aria-labelledby="home-about-title"
        ref={aboutSectionRef}
      >
        <svg
          className="home-about__wave"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="none"
            d="M0 206C166 82 326-16 530 28C735 72 820 205 1054 224C1222 238 1340 198 1440 142V280H0Z"
          />
        </svg>

        {equipmentEnabled ? <EquipmentFlow direction="diagonal" /> : null}

        <h2
          id="home-about-title"
          className={`${leagueGothic.className} home-about__title`}
        >
          <span>ABOUT</span>
          <span
            className={`${lineSeedExtraBold.className} home-about__title-tag`}
          >
            大会について
          </span>
        </h2>
        <div className={`${lineSeedExtraBold.className} home-about__body`}>
          <div className="home-about__content">
            <p className="home-about__lead">
              <span>「良い編集者を見つける」を目的で始めたイベントです。</span>
            </p>

            <article className="home-about__card">
              <VideoRow
                key={`about-top-${rows.top.join("|")}`}
                videos={rows.top}
                direction="left"
                variant="card"
                scrollReactive
              />

              <div className="home-about__card-content">
                <h3 className="home-about__label">応募動画</h3>
                <p className="home-about__card-title">
                  指定された動画素材を、あなたの世界観で自由に編集してください!!
                </p>
                <p className="home-about__card-note">
                  YouTube風・MADなど、条件を満たしていれば表現方法は自由です
                </p>
                <p className="home-about__software-note">
                  ※編集ソフトに指定はありません
                </p>
                <div
                  className="home-about__app-icons"
                  aria-label="対応する動画編集ソフトの例"
                >
                  {editingAppIcons.map(({ name, image }) => (
                    <span className="home-about__app-icon" key={name}>
                      <Image src={image} alt={name} width={64} height={64} />
                    </span>
                  ))}
                </div>
                <div className="home-about__resources" aria-label="応募用資料">
                  <button
                    className="home-about__label home-about__label--small home-reel-trigger"
                    type="button"
                    aria-label="応募条件と素材説明を確認する"
                    onClick={() => setFontGuideOpen(true)}
                  >
                    <ReelText label="応募条件・素材説明" />
                  </button>
                  <button
                    className="home-about__label home-about__label--small home-reel-trigger"
                    type="button"
                    aria-label="素材ダウンロードを開く"
                    onClick={() => setMaterialDownloadOpen(true)}
                  >
                    <ReelText label="素材ダウンロード" />
                  </button>
                </div>
              </div>

              <VideoRow
                key={`about-bottom-${rows.bottom.join("|")}`}
                videos={rows.bottom}
                direction="right"
                variant="card"
                scrollReactive
              />
            </article>

            <section className="home-about__details" aria-label="開催情報">
              <div className="home-about__overview">
                <h3 className="home-about__label">開催概要</h3>
                <dl className="home-about__dates">
                  <div>
                    <dt>応募締め切り：</dt>
                    <dd>2026年8月28日 23:59</dd>
                  </div>
                  <div>
                    <dt>投票期間：</dt>
                    <dd>2026年8月29日 20:00 ～ 9月4日 23:59</dd>
                  </div>
                  <div>
                    <dt>結果生放送：</dt>
                    <dd>2026年9月5日 21:00</dd>
                  </div>
                </dl>
              </div>

              <div className="home-about__prize">
                <h3 className="home-about__label">賞金</h3>
                <p>10,000円</p>
              </div>
            </section>

            <section
              className="home-about__entry-card"
              aria-labelledby="entry-card-title"
            >
              <EntryVideoTitle videos={rows.top} />
              <div className="home-about__entry-content">
                <h3 id="entry-card-title" className="home-about__label">
                  エントリー
                </h3>
                <p className="home-about__entry-heading">事前に準備すること</p>
                <p className="home-about__entry-copy">
                  <span className="home-about__youtube-name">
                    <YouTubeLogo />
                    YouTube
                  </span>
                  にエントリー動画を
                  <span className="home-about__entry-highlight">
                    公開又は限定公開
                  </span>
                  でアップロードしURLを取得する
                </p>
                <p className="home-about__entry-warning">
                  ※非公開動画ではエントリー不可能です
                </p>

                <a
                  className="home-about__entry-cta home-reel-trigger"
                  href="https://forms.gle/gPpYALDNRB7av6iP6"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Googleフォームにてエントリーする！！"
                >
                  <Image
                    className="home-about__forms-svg"
                    src="/button/google-forms.svg"
                    alt="Googleフォーム"
                    width={64}
                    height={88}
                  />
                  <ReelText label="にてエントリーする！！" />
                </a>
              </div>
            </section>
          </div>
        </div>

        <div className="home-about__closing-videos">
          <VideoRow
            key={`closing-${rows.bottom.join("|")}`}
            videos={rows.bottom.filter(
              (video) => !video.endsWith("/8.mp4"),
            )}
            direction="right"
            variant="closing"
            scrollReactive
          />
        </div>
      </section>

      <section
        className={`${lineSeedExtraBold.className} home-after-about`}
        aria-labelledby="home-vote-title"
      >
        <MovingGrid />
        <div className="home-vote__curve" aria-hidden="true" />
        <div
          className={`${leagueGothic.className} home-vote__word-ring`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 300 300">
            <defs>
              <path
                id="home-vote-word-ring-path"
                d="M 150,150 m -111,0 a 111,111 0 1,1 222,0 a 111,111 0 1,1 -222,0"
              />
            </defs>
            <text textLength="696" lengthAdjust="spacing">
              <textPath href="#home-vote-word-ring-path" startOffset="0%">
                YAMAKAWATERUKI YAMAKAWATERUKI
              </textPath>
            </text>
          </svg>
        </div>
        <h2
          id="home-vote-title"
          className={`${leagueGothic.className} home-vote__title`}
        >
          <span className="home-vote__word">VOTE</span>
          <span
            className={`${lineSeedExtraBold.className} home-vote__title-tag`}
          >
            投票の流れ
          </span>
        </h2>

        <div className="home-vote__flow">
          <article className="home-vote__step">
            <h3 className="home-vote__step-label">
              <span>1</span>
              Discordアカウントの用意
            </h3>
            <div className="home-vote__step-body">
              <p>
                重複投票・不正投票対策として
                <strong>Discordアカウントのログインを必須</strong>
                としています
              </p>
              <p>
                アカウントを持っていない方は
                <a
                  className="home-reel-trigger"
                  href="https://discord.com/login"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discordアカウント作成ページを開く"
                >
                  <ReelText label="https://discord.com/login" />
                </a>
                にて取得する必要があります
              </p>
            </div>
          </article>

          <article className="home-vote__step">
            <h3 className="home-vote__step-label">
              <span>2</span>
              注意事項の確認
            </h3>
            <div className="home-vote__step-body">
              <ul>
                <li>
                  <strong>不正投票は禁止</strong>とします
                </li>
                <li>
                  順位は<strong>Web投票のみ</strong>で決定します
                </li>
                <li>
                  途中経過とランキングは非公開です。結果は
                  <strong>2026年9月5日 21:00の結果生放送</strong>
                  で発表します
                </li>
              </ul>
            </div>
          </article>

          <article className="home-vote__step">
            <h3 className="home-vote__step-label">
              <span>3</span>
              Discordでログイン
            </h3>
            <div className="home-vote__step-body">
              <p>
                <strong>Discordでログイン</strong>
                して投票ページにアクセスしてください
              </p>
              <p className="home-vote__step-note">
                ※ログインをしなくても閲覧は可能です
              </p>
              <div className="home-vote__actions">
                <button
                  className={`home-vote__discord-button home-reel-trigger${
                    discordAuthState === "authenticated"
                      ? " home-vote__discord-button--authenticated"
                      : ""
                  }`}
                  type="button"
                  aria-label={
                    discordAuthState === "authenticated"
                      ? "Discordでログイン中です"
                      : "Discordでログイン"
                  }
                  disabled={discordAuthState === "loading"}
                  onClick={() => {
                    window.location.assign(
                      discordAuthState === "authenticated"
                        ? "/vote"
                        : "/api/auth/discord/start?returnTo=%2Fvote",
                    );
                  }}
                >
                  <DiscordLogo />
                  <ReelText
                    label={
                      discordAuthState === "authenticated"
                        ? "Discordでログイン中です"
                        : discordAuthState === "loading"
                          ? "ログイン状態を確認中です"
                          : "Discordでログイン"
                    }
                  />
                </button>
                {discordAuthState === "anonymous" ? (
                  <a
                    className="home-vote__browse-link home-reel-trigger"
                    href="/vote"
                    aria-label="ログインせずに閲覧する"
                  >
                    <ReelText label="ログインせずに閲覧する" />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </div>

        <section className="home-qa" aria-labelledby="home-qa-title">
          <div className="home-qa__surface">
            <svg
              className="home-qa__wave"
              viewBox="0 0 1440 280"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                fill="#fff"
                d="M0 206C166 82 326-16 530 28C735 72 820 205 1054 224C1222 238 1340 198 1440 142V280H0Z"
              />
            </svg>
            <div className="home-qa__backdrop" aria-hidden="true">
              <div className="home-qa__backdrop-field">
                {Array.from({ length: 38 }, (_, rowIndex) => (
                  <div className="home-qa__backdrop-row" key={rowIndex}>
                    <div
                      className={`${lineSeedExtraBold.className} home-qa__backdrop-track ${
                        rowIndex % 2 === 0 ? "" : "home-qa__backdrop-track--reverse"
                      }`}
                      style={{
                        "--home-qa-row-duration": `${22 + (rowIndex % 6) * 2}s`,
                      } as CSSProperties}
                    >
                      {Array.from({ length: 2 }, (_, groupIndex) => (
                        <div className="home-qa__backdrop-group" key={groupIndex}>
                          {homeQaBackdropWords.map((word, wordIndex) => (
                            <span key={wordIndex}>{word}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h2
              id="home-qa-title"
              className={`${leagueGothic.className} home-qa__title`}
            >
              <span className="home-qa__word">Q&amp;A</span>
              <span className={`${lineSeedExtraBold.className} home-qa__title-tag`}>
                よくある質問
              </span>
            </h2>

            <div className="home-qa__body">
              <div className="home-qa__list">
                {homeQaItems.map((item, index) => (
                  <article className="home-qa__card" key={item.question}>
                    <div className="home-qa__question-row">
                      <span className={`${leagueGothic.className} home-qa__number`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className={`${lineSeedExtraBold.className} home-qa__question`}>
                        <span className={`${leagueGothic.className} home-qa__marker`}>Q</span>
                        {item.question}
                      </h3>
                    </div>
                    <p className="home-qa__answer">
                      <span className={`${leagueGothic.className} home-qa__marker home-qa__marker--answer`}>
                        A
                      </span>
                      <span>{item.answer}</span>
                    </p>
                  </article>
                ))}
              </div>

              <div className="home-qa__contact-card">
                <p className="home-qa__contact-note">
                  その他ご質問がある場合は
                  <a
                    href="https://x.com/YamakawaTeruki"
                    target="_blank"
                    rel="noreferrer"
                    className="home-qa__x-button home-reel-trigger"
                    aria-label="Xのやまかわてるきアカウント"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <ReelText label="やまかわてるき" />
                  </a>
                  のDM、リプライ、
                  <br />
                  あるいは{" "}
                  <a
                    href="mailto:yamakawadayone@gmail.com"
                    className="home-qa__email-link home-reel-trigger"
                  >
                    <ReelText label="yamakawadayone@gmail.com" />
                  </a>{" "}
                  までお願いします。
                </p>
              </div>
            </div>
          </div>
        </section>
        </section>
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
          <Image
            src="/logo/logo.png"
            alt="やまかわ動画編集大会"
            width={540}
            height={180}
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
      </main>
      {fontGuideOpen ? (
        <div
          className="home-font-modal"
          role="presentation"
          data-lenis-prevent
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setFontGuideOpen(false);
          }}
        >
          <section
            className={`${lineSeedExtraBold.className} home-font-modal__card`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-font-modal-title"
            data-lenis-prevent
          >
            <h2 id="home-font-modal-title"><span>応募条件</span>・素材説明</h2>

            <section className="home-font-modal__section">
              <h3>必須条件</h3>
              <ul className="home-font-modal__conditions">
                <li>動画時間は<strong>5分以下</strong>にしてください。</li>
                <li>配布された映像素材を<strong>必ず使用</strong>してください。</li>
                {/* <li>
                  字幕は<strong>源ノ角ゴシック</strong>、カラーは
                  <button
                    className="home-font-modal__color-copy"
                    type="button"
                    onClick={() => void copyMainCaptionColor()}
                    aria-label="カラーコード #C30202 をコピー"
                  >
                    #C30202
                    {colorCopied ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                  、<strong>白縁取り</strong>を使うと本人動画のようになります!!
                </li> */}
              </ul>
              {/* <a
                className="home-font-modal__font-link home-reel-trigger"
                href="https://myfont.jp/fonts/16"
                target="_blank"
                rel="noreferrer"
                aria-label="源ノ角ゴシックのダウンロードページを開く"
              >
                <ReelText label="源ノ角ゴシックをダウンロード　→" />
              </a> */}
            </section>

            <section className="home-font-modal__section home-font-modal__section--optional">
              <h3>自由に使えるもの</h3>
              <p>
                それ以外の字幕・効果音・BGMの使用はすべて任意です。編集ソフトの指定もありません。
              </p>
              <p>上記の条件を満たしていれば、編集スタイルは自由です。</p>
            </section>

            <section className="home-font-modal__section">
              <h3>素材説明</h3>
              <ol className="home-font-modal__materials">
                <li>
                  <code>C690/C691.MP4</code>
                  <span>顔の映像です。音質の良いピンマイク音声を収録しています。</span>
                </li>
                <li>
                  <code>DJI~.MP4</code>
                  <span>主観カメラの映像です。</span>
                </li>
              </ol>
              <button
                className="home-font-modal__font-link home-reel-trigger"
                type="button"
                aria-label="動画素材のダウンロードを開く"
                onClick={() => {
                  setFontGuideOpen(false);
                  setMaterialDownloadOpen(true);
                }}
              >
                <ReelText label="動画素材をダウンロード　→" />
              </button>
            </section>
          </section>
        </div>
      ) : null}

      {materialDownloadOpen ? (
        <div
          className="home-font-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMaterialDownloadOpen(false);
          }}
        >
          <section
            className={`${lineSeedExtraBold.className} home-font-modal__card home-download-modal__card`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-download-modal-title"
            data-lenis-prevent
          >
            <span className="home__mesh home__mesh--top" aria-hidden="true">
              <span className="home__mesh-pattern" />
            </span>
            <span className="home__mesh home__mesh--bottom" aria-hidden="true">
              <span className="home__mesh-pattern" />
            </span>

            <div className="home-download-modal__content">
              <h2 id="home-download-modal-title">素材のダウンロード</h2>

              <p className="home-download-modal__notice">
                アクセス集中による負荷を分散させるため、ファイルを分割してご提供しております。<br />
                ファイルの内容に違いはございませんので、あらかじめご了承ください。
              </p>

              <div className="home-download-modal__buttons">
                <a
                  className="home-font-modal__font-link home-reel-trigger home-download-modal__button"
                  href="https://drive.google.com/file/d/11qLbmj333A-cC2XTCip2_S14ut0gdMEG"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Driveで動画素材をダウンロード"
                >
                  <ReelText label="Drive" />
                </a>
                <a
                  className="home-font-modal__font-link home-reel-trigger home-download-modal__button"
                  href="https://xgf.nu/tTLaU"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="ギガファイル便で動画素材をダウンロード"
                >
                  <ReelText label="ギガファイル便" />
                </a>
                <a
                  className="home-font-modal__font-link home-reel-trigger home-download-modal__button"
                  href="https://d.kuku.lu/pu4rta848"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="ファイルなうで動画素材をダウンロード"
                >
                  <ReelText label="ファイルなう" />
                </a>
              </div>

              <p className="home-download-modal__info">
                サイズ: 1.79 GB ファイル数: 4
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
