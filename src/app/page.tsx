"use client";

import Image from "next/image";
import { League_Gothic } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ReactLenis } from "lenis/react";
import EquipmentFlow, { editingAppIcons } from "./equipment-flow";
import DiscordLogo from "./discord-logo";
import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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

const videoPaths = Array.from({ length: 20 }, (_, index) =>
  `/video-preview/${index + 1}.mp4`,
);

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

          return (
            <foreignObject
              x={letterCenters[index] - 120}
              y="0"
              width="240"
              height="620"
              clipPath={`url(#entry-video-letter-${index})`}
              key={letter}
            >
              <video
                className="home-about__entry-video"
                src={video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(event) => {
                  const player = event.currentTarget;

                  if (Number.isFinite(player.duration) && player.duration > 0) {
                    player.currentTime = Math.random() * player.duration;
                  }
                }}
              />
            </foreignObject>
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

    const handleScroll = () => {
      if (!scrollReactive) return;

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

    if (scrollReactive) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

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

      if (scrollReactive) {
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
          {Array.from({ length: 3 }, (_, groupIndex) =>
            <div className="video-row__group" key={groupIndex}>
              {cards.map(({ id, src, variant, leftSlope, rightSlope, verticalOffset }) => {
                const clipId = `video-clip-${groupIndex}-${id.replace(/[^a-z0-9-]/gi, "-")}`;

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
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        disablePictureInPicture
                      >
                        <source src={src} type="video/mp4" />
                      </video>
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

    const handleScroll = () => {
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

      if (now - lastScrollEventTime > 90) {
        targetScrollMultiplier +=
          (1 - targetScrollMultiplier) * Math.min(elapsedSeconds * 5.5, 1);
      }

      scrollMultiplier +=
        (targetScrollMultiplier - scrollMultiplier) *
        Math.min(elapsedSeconds * 10, 1);

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
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
  const pageRef = useRef<HTMLElement>(null);
  const homeEquipmentReadyRef = useRef(false);
  const rows = useSyncExternalStore(subscribe, getBrowserRows, () => initialRows);
  const [homeLoaderVisible, setHomeLoaderVisible] = useState(true);
  const [homeLoaderClosing, setHomeLoaderClosing] = useState(false);
  const [discordAuthState, setDiscordAuthState] = useState<
    "loading" | "authenticated" | "anonymous"
  >("loading");

  useEffect(() => {
    const minimumDuration = 1200;
    const startedAt = performance.now();
    const previousOverflow = document.body.style.overflow;
    let hideTimer = 0;
    let removeTimer = 0;
    let safetyTimer = 0;
    let readyFrame = 0;
    let scheduled = false;
    let initialRenderReady = false;
    let equipmentReady = homeEquipmentReadyRef.current;

    document.body.style.overflow = "hidden";

    const scheduleHide = () => {
      if (scheduled) return;
      scheduled = true;
      const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));

      hideTimer = window.setTimeout(() => {
        setHomeLoaderClosing(true);
        removeTimer = window.setTimeout(() => {
          document.body.style.overflow = previousOverflow;
          setHomeLoaderVisible(false);
        }, 500);
      }, remaining);
    };

    const tryFinish = () => {
      equipmentReady = equipmentReady || homeEquipmentReadyRef.current;
      if (initialRenderReady && equipmentReady) scheduleHide();
    };

    void document.fonts.ready.then(() => {
      readyFrame = window.requestAnimationFrame(() => {
        readyFrame = window.requestAnimationFrame(() => {
          initialRenderReady = true;
          tryFinish();
        });
      });
    });

    const handleEquipmentReady = () => {
      equipmentReady = true;
      tryFinish();
    };

    window.addEventListener("home-equipment-ready", handleEquipmentReady);

    safetyTimer = window.setTimeout(scheduleHide, 8000);

    return () => {
      window.removeEventListener("home-equipment-ready", handleEquipmentReady);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(safetyTimer);
      window.cancelAnimationFrame(readyFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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
      const isMobile = coarsePointer.matches || window.innerWidth <= 640;
      const imageTravel = isMobile ? 0.14 : 0.2;
      const baseScale = isMobile ? 1.12 : 1.08;

      if (reducedMotion.matches) {
        page.style.setProperty("--home-image-y", "0px");
        page.style.setProperty("--home-image-scale", `${baseScale}`);
        page.style.setProperty("--home-image-dim", "0");
        page.style.setProperty("--home-wave-y", "0px");
        page.style.setProperty("--home-title-y", "0px");
        return;
      }

      page.style.setProperty("--home-image-y", `${safeScroll * imageTravel}px`);
      page.style.setProperty("--home-image-scale", `${baseScale + progress * 0.035}`);
      page.style.setProperty("--home-image-dim", `${progress * 0.52}`);
      page.style.setProperty(
        "--home-wave-y",
        `${-Math.min(safeScroll * (isMobile ? 0.028 : 0.04), isMobile ? 26 : 38)}px`,
      );
      page.style.setProperty(
        "--home-title-y",
        `${-Math.min(safeScroll * (isMobile ? 0.05 : 0.075), isMobile ? 38 : 54)}px`,
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
      <ReactLenis root />
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

      <section className="home-about" aria-labelledby="home-about-title">
        <svg
          className="home-about__wave"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="home-about-wave-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity="0.58" />
              <stop offset="62%" stopColor="#000" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#000" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#home-about-wave-fill)"
            d="M0 206C166 82 326-16 530 28C735 72 820 205 1054 224C1222 238 1340 198 1440 142V280H0Z"
          />
        </svg>

        <EquipmentFlow
          direction="diagonal"
          onReady={() => {
            homeEquipmentReadyRef.current = true;
            window.dispatchEvent(new Event("home-equipment-ready"));
          }}
        />

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
                  指定された動画をYoutubeっぽく編集していただきます!!
                </p>
                <p className="home-about__card-note">
                  一部テロップの色・フォントのおおまかな指定があります
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
                  <a
                    className="home-about__label home-about__label--small home-reel-trigger"
                    href="https://drive.google.com/file/d/1pFrnL11yfvQ_0ZzK03jkp2T9NdixLYJP/view?usp=drivesdk"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="素材ダウンロード"
                  >
                    <ReelText label="素材ダウンロード" />
                  </a>
                  <span
                    className="home-about__label home-about__label--small home-reel-trigger"
                    aria-label="指定フォントURL"
                  >
                    <ReelText label="指定フォントURL" />
                  </span>
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
                    <dt>応募日時：</dt>
                    <dd>2026年XX/XX ～ XX/XX</dd>
                  </div>
                  <div>
                    <dt>投票日時：</dt>
                    <dd>2026年XX/XX ～ XX/XX</dd>
                  </div>
                  <div>
                    <dt>最終結果生放送：</dt>
                    <dd>2026年08/28</dd>
                  </div>
                </dl>
              </div>

              <div className="home-about__prize">
                <h3 className="home-about__label">賞金</h3>
                <p>10000円</p>
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
                    Youtube
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
                  Webで行われるのは予選投票であり、最終投票は
                  <strong>
                    2026年08/28のやまかわてるきの生放送のYoutube内投票で行われます
                  </strong>
                </li>
                <li>
                  投票は<strong>一人X回</strong>まですることができます
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
          <h2
            id="home-qa-title"
            className={`${leagueGothic.className} home-qa__title`}
          >
            <span className="home-qa__word">Q&amp;A</span>
            <span
              className={`${lineSeedExtraBold.className} home-qa__title-tag`}
            >
              よくある質問
            </span>
          </h2>
          <div className="home-qa__body">
            <p className={`${leagueGothic.className} home-qa__coming-soon`}>
              COMING SOON
            </p>
          </div>

          <footer className="home-footer">
            <div className="home-footer__inner">
              <div className={`${lineSeedExtraBold.className} home-footer__brand`}>
                <p>やまかわてるき</p>
                <span>
                  編集大会
                  <br />
                  投票サイト
                </span>
              </div>

              <nav className="home-footer__nav" aria-label="フッターナビゲーション">
                <a className="home-reel-trigger" href="#home-about-title" aria-label="ABOUT">
                  <ReelText label="ABOUT" />
                </a>
                <a className="home-reel-trigger" href="#home-vote-title" aria-label="VOTE">
                  <ReelText label="VOTE" />
                </a>
                <a className="home-reel-trigger" href="#home-qa-title" aria-label="Q&A">
                  <ReelText label="Q&A" />
                </a>
              </nav>

              <small className={lineSeedExtraBold.className}>© 2026 ymkw.top</small>
            </div>
          </footer>
        </section>
      </section>
      </main>
    </>
  );
}
