"use client";

import localFont from "next/font/local";
import { Google_Sans, League_Gothic } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { flushSync } from "react-dom";
import { ReactLenis, type LenisRef } from "lenis/react";
import DiscordLogo from "../discord-logo";
import YouTubeLogo from "../youtube-logo";
import { getVotingPhase, type VotingPhase } from "@/data/schedule";

const lineSeedExtraBold = localFont({
  src: "../fonts/LINESeedJP-ExtraBold.ttf",
  weight: "800",
  display: "swap",
});

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const entryPreviewVideos = Array.from(
  { length: 10 },
  (_, index) => `/video-preview/${index + 11}.mp4`,
);
const ENTRY_LOADING_PLACEHOLDERS = 16;

type CircuitPoint = { x: number; y: number };

type CircuitLayout = {
  width: number;
  height: number;
  paths: string[];
  rings: CircuitPoint[];
  labels: CircuitPoint[];
};

type VoteEntry = {
  id: string;
  youtubeId: string;
  submittedAt?: string;
  viewCount?: number;
  title?: string;
  channelTitle?: string;
  description?: string;
  channelIcon?: string;
};

type EntrySort = "newest" | "oldest" | "random";

const entrySortOptions: { value: EntrySort; label: string }[] = [
  { value: "newest", label: "新しい順" },
  { value: "oldest", label: "古い順" },
  { value: "random", label: "ランダム順" },
];

function YouTubeThumbnail({
  youtubeId,
  alt,
  eager = false,
}: {
  youtubeId: string;
  alt: string;
  eager?: boolean;
}) {
  const [resolution, setResolution] = useState<
    "maxresdefault" | "sddefault" | "hqdefault"
  >("maxresdefault");
  const [isHovered, setIsHovered] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);

  return (
    <div
      className="pv-video-thumb relative w-full h-full overflow-hidden"
      onMouseEnter={() => {
        setIsHovered(true);
        setHasHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={() => {
        setIsHovered(true);
        setHasHovered(true);
      }}
    >
      <div
        className="pvt-inner w-full h-full relative"
        style={{
          transform: isHovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {hasHovered && (
          <div className="pvt-preview-wrap absolute inset-0 z-0">
            <iframe
              className="pvt-preview-iframe-placeholder w-full h-full border-0"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=0&rel=0&playsinline=1&mute=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              style={{
                pointerEvents: "none",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.4s",
              }}
              title={alt}
            />
          </div>
        )}

        <div
          className="pvt-cover absolute inset-0 z-10 transition-opacity duration-500"
          style={{ opacity: isHovered ? 0 : 1 }}
          aria-hidden="true"
        >
          <Image
            className="pvt-cover-img object-cover"
            src={`https://i.ytimg.com/vi/${youtubeId}/${resolution}.jpg`}
            alt={alt}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 640px) calc(100vw - 2.5rem), 44vw"
            onError={() => {
              setResolution((current) =>
                current === "maxresdefault" ? "sddefault" : "hqdefault",
              );
            }}
          />
        </div>

        <div
          className="pvt-playbtn absolute inset-0 z-20 grid place-items-center pointer-events-none transition-transform duration-300"
          style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
          aria-hidden="true"
        >
          <div className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoteReelText({ label }: { label: string }) {
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

function VoteEntryEnding() {
  const endingRef = useRef<HTMLDivElement>(null);
  const letters = [..."ENTRY"];
  const letterCenters = letters.map((_, index) => 600 + (index - 2) * 205);

  useEffect(() => {
    const ending = endingRef.current;
    if (!ending) return;

    const videos = Array.from(ending.querySelectorAll("video"));
    const observer = new IntersectionObserver(
      ([entry]) => {
        videos.forEach((video) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "35% 0px" },
    );

    observer.observe(ending);
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, []);

  return (
    <div className="vote-entry-ending" ref={endingRef}>
      <article className="vote-entry-cta-card">
        <div className="vote-entry-cta-card__video-title" aria-hidden="true">
          <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid meet">
            <defs>
              {letters.map((letter, index) => (
                <clipPath id={`vote-entry-video-letter-${index}`} key={letter}>
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
            {letters.map((letter, index) => (
              <foreignObject
                x={letterCenters[index] - 120}
                y="0"
                width="240"
                height="620"
                clipPath={`url(#vote-entry-video-letter-${index})`}
                key={letter}
              >
                <video
                  className="vote-entry-cta-card__letter-video"
                  src={entryPreviewVideos[index % entryPreviewVideos.length]}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </foreignObject>
            ))}
          </svg>
        </div>
        <div className="vote-entry-cta-card__content">
          <h3>投票動画はここまでです！！</h3>
          <p>
            あなたも<strong>エントリー</strong>してみませんか？
          </p>
          <Link
            className="vote-entry-cta-card__link home-reel-trigger"
            href="/#entry-card-title"
            aria-label="エントリーページへ戻る"
          >
            <VoteReelText label="エントリーページへ戻る →" />
          </Link>
        </div>
      </article>

      <div className="vote-entry-ending__videos" aria-hidden="true">
        <div className="vote-entry-ending__track">
          {Array.from({ length: 2 }, (_, groupIndex) => (
            <div className="vote-entry-ending__group" key={groupIndex}>
              {entryPreviewVideos.map((src) => (
                <video
                  src={src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  key={`${groupIndex}-${src}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function toPath(points: CircuitPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join("");
}

function findCircuitIntersections(
  paths: CircuitPoint[][],
  minimumY: number,
  width: number,
) {
  const intersections: CircuitPoint[] = [];

  for (
    let firstPathIndex = 0;
    firstPathIndex < paths.length;
    firstPathIndex += 1
  ) {
    const firstPath = paths[firstPathIndex];
    for (
      let secondPathIndex = firstPathIndex + 1;
      secondPathIndex < paths.length;
      secondPathIndex += 1
    ) {
      const secondPath = paths[secondPathIndex];

      for (
        let firstSegment = 0;
        firstSegment + 1 < firstPath.length;
        firstSegment += 1
      ) {
        const a = firstPath[firstSegment];
        const b = firstPath[firstSegment + 1];
        const firstDx = b.x - a.x;
        const firstDy = b.y - a.y;

        for (
          let secondSegment = 0;
          secondSegment + 1 < secondPath.length;
          secondSegment += 1
        ) {
          const c = secondPath[secondSegment];
          const d = secondPath[secondSegment + 1];
          const secondDx = d.x - c.x;
          const secondDy = d.y - c.y;
          const firstVertical =
            Math.abs(firstDx) < 0.001 && Math.abs(firstDy) > 0.001;
          const secondVertical =
            Math.abs(secondDx) < 0.001 && Math.abs(secondDy) > 0.001;
          const firstDiagonal =
            Math.abs(firstDx) > 0.001 && Math.abs(firstDy) > 0.001;
          const secondDiagonal =
            Math.abs(secondDx) > 0.001 && Math.abs(secondDy) > 0.001;

          if (!(
            (firstVertical && secondDiagonal) ||
            (firstDiagonal && secondVertical)
          )) {
            continue;
          }

          const denominator = firstDx * secondDy - firstDy * secondDx;

          if (Math.abs(denominator) < 0.001) continue;

          const offsetX = c.x - a.x;
          const offsetY = c.y - a.y;
          const firstProgress =
            (offsetX * secondDy - offsetY * secondDx) / denominator;
          const secondProgress =
            (offsetX * firstDy - offsetY * firstDx) / denominator;

          const firstInside = firstProgress > 0.025 && firstProgress < 0.975;
          const secondInside = secondProgress > 0.025 && secondProgress < 0.975;
          const firstOnSegment =
            firstProgress >= -0.001 && firstProgress <= 1.001;
          const secondOnSegment =
            secondProgress >= -0.001 && secondProgress <= 1.001;

          // A branch may begin or end on the middle of another line. Ignore
          // only endpoint-to-endpoint contacts, which are ordinary bends.
          if (
            !firstOnSegment ||
            !secondOnSegment ||
            (!firstInside && !secondInside)
          ) {
            continue;
          }

          const point = {
            x: a.x + firstProgress * firstDx,
            y: a.y + firstProgress * firstDy,
          };
          if (point.y <= minimumY || point.x < 30 || point.x > width - 30)
            continue;

          const alreadyAdded = intersections.some(
            (existing) =>
              Math.hypot(existing.x - point.x, existing.y - point.y) < 3,
          );
          if (!alreadyAdded) intersections.push(point);
        }
      }
    }
  }

  return intersections;
}

function buildCircuit(page: HTMLElement): CircuitLayout | null {
  const mobile = window.innerWidth <= 640;
  const pageRect = page.getBoundingClientRect();
  const field = page.querySelector<HTMLElement>(".vote-line-field");
  const selector = mobile ? "[data-circuit-mobile]" : "[data-circuit-desktop]";
  const sourceElements = Array.from(
    page.querySelectorAll<HTMLElement>(selector),
  );

  if (!field || sourceElements.length < 2) return null;

  const width = page.clientWidth;
  const height = page.scrollHeight;
  const fieldTop = field.getBoundingClientRect().top - pageRect.top;
  const anchors = sourceElements
    .map((source) => {
      const rect = source.getBoundingClientRect();
      const fontSize = Number.parseFloat(getComputedStyle(source).fontSize);
      const anchor = source.dataset.circuitAnchor;

      return {
        x:
          rect.left -
          pageRect.left +
          (anchor === "left" ? fontSize * 0.13 : rect.width / 2),
        y: rect.top - pageRect.top + rect.height * 0.6,
      };
    })
    .sort((a, b) => a.x - b.x);

  const title = page.querySelector<HTMLElement>(".vote-hero__title");
  if (!title) return null;

  const titleRect = title.getBoundingClientRect();
  const titleLeft = titleRect.left - pageRect.left;
  const titleRight = titleRect.right - pageRect.left;
  const safeLeft = Math.max(18, titleLeft + 4);
  const safeRight = Math.min(width - 18, titleRight - 4);
  const clampToTitle = (x: number) =>
    Math.min(safeRight, Math.max(safeLeft, x));

  const paths = anchors.map((anchor) => [anchor]);
  const rings: CircuitPoint[] = [];
  const labels: CircuitPoint[] = [];
  let currentX = anchors.map((anchor) => anchor.x);
  const maxAnchorY = Math.max(...anchors.map((anchor) => anchor.y));

  const heroTurnStart =
    maxAnchorY + Math.max(72, (fieldTop - maxAnchorY) * 0.26);
  const heroTurnEnd = Math.max(
    heroTurnStart + 100,
    fieldTop - (mobile ? 70 : 95),
  );
  const heroOrdered = currentX
    .map((x, index) => ({ x, index }))
    .sort((a, b) => a.x - b.x);
  const heroTargets = [...currentX];

  for (let index = 0; index + 1 < heroOrdered.length; index += 2) {
    const first = heroOrdered[index];
    const second = heroOrdered[index + 1];
    const gap = second.x - first.x;

    heroTargets[first.index] = clampToTitle(first.x);
    heroTargets[second.index] = clampToTitle(first.x - gap * 0.42);
  }

  paths.forEach((points, lineIndex) => {
    points.push({ x: clampToTitle(currentX[lineIndex]), y: heroTurnStart });
    points.push({ x: heroTargets[lineIndex], y: heroTurnEnd });
    points.push({ x: heroTargets[lineIndex], y: fieldTop });
  });
  currentX = heroTargets;

  const spreadLeft = width * (mobile ? 0.13 : 0.11);
  const spreadRight = width * (mobile ? 0.87 : 0.89);
  const spreadLanes = currentX.map((_, index) =>
    currentX.length === 1
      ? width / 2
      : spreadLeft +
        ((spreadRight - spreadLeft) * index) / (currentX.length - 1),
  );
  const currentOrder = currentX
    .map((x, index) => ({ x, index }))
    .sort((a, b) => a.x - b.x);
  const expandedX = [...currentX];
  currentOrder.forEach((line, orderIndex) => {
    expandedX[line.index] = spreadLanes[orderIndex];
  });
  paths.forEach((points, lineIndex) => {
    points.push({ x: expandedX[lineIndex], y: fieldTop + 125 });
  });
  currentX = expandedX;

  const orderedAtRelease = currentX
    .map((x, index) => ({ x, index }))
    .sort((a, b) => a.x - b.x);
  const orderedLineIndices = orderedAtRelease.map((line) => line.index);
  const maximumActiveLines = mobile ? 3 : 5;
  const activeCount = Math.min(maximumActiveLines, orderedLineIndices.length);
  const activeLines = Array.from({ length: activeCount }, (_, activeIndex) => {
    const orderedIndex =
      activeCount === 1
        ? Math.floor(orderedLineIndices.length / 2)
        : Math.round(
            (activeIndex * (orderedLineIndices.length - 1)) / (activeCount - 1),
          );
    return orderedLineIndices[orderedIndex];
  });
  const inactiveLines = orderedLineIndices.filter(
    (lineIndex) => !activeLines.includes(lineIndex),
  );
  const labelLine = activeLines[Math.floor(activeLines.length / 2)];

  inactiveLines.forEach((lineIndex, inactiveIndex) => {
    const lineX = currentX[lineIndex];
    const sameSideCandidates = activeLines.filter((activeLineIndex) =>
      lineX < width / 2
        ? currentX[activeLineIndex] < lineX
        : currentX[activeLineIndex] > lineX,
    );
    const targetCandidates =
      sameSideCandidates.length > 0 ? sameSideCandidates : activeLines;
    const targetLine = targetCandidates.reduce((nearest, candidate) =>
      Math.abs(currentX[candidate] - lineX) <
      Math.abs(currentX[nearest] - lineX)
        ? candidate
        : nearest,
    );
    const turnY = fieldTop + 175 + inactiveIndex * 90;
    const intersectionY = turnY + 110;

    paths[lineIndex].push({ x: lineX, y: turnY });
    paths[lineIndex].push({ x: currentX[targetLine], y: intersectionY });
  });

  if (labelLine !== undefined) {
    labels.push({ x: currentX[labelLine] + 22, y: fieldTop + 285 });
  }

  const orderedAtEnd = activeLines
    .map((lineIndex) => ({ lineIndex, x: currentX[lineIndex] }))
    .sort((a, b) => a.x - b.x);
  const fieldHeight = height - fieldTop;
  const laneBoundaries = orderedAtEnd.map((lane, laneIndex) => ({
    minimumX:
      laneIndex === 0 ? 36 : (orderedAtEnd[laneIndex - 1].x + lane.x) / 2,
    maximumX:
      laneIndex === orderedAtEnd.length - 1
        ? width - 36
        : (lane.x + orderedAtEnd[laneIndex + 1].x) / 2,
  }));
  const labelExemptUntil = fieldTop + (mobile ? 565 : 785);
  const lanes = orderedAtEnd.map(({ lineIndex, x }, laneIndex) => ({
    x,
    baseX: x,
    pathIndex: lineIndex,
    lastY: fieldTop + 125,
    bendDirection: laneIndex % 2 === 0 ? 1 : -1,
    minimumX: laneBoundaries[laneIndex].minimumX,
    maximumX: laneBoundaries[laneIndex].maximumX,
    exemptUntil: lineIndex === labelLine ? labelExemptUntil : fieldTop + 125,
  }));
  const maximumStraightLength = mobile ? 310 : 430;
  const bendHeight = mobile ? 52 : 68;

  const appendLanePoint = (
    lane: (typeof lanes)[number],
    point: CircuitPoint,
  ) => {
    const lanePath = paths[lane.pathIndex];
    const previous = lanePath[lanePath.length - 1];
    if (
      Math.abs(previous.x - point.x) > 0.001 ||
      Math.abs(previous.y - point.y) > 0.001
    ) {
      lanePath.push(point);
    }
  };

  const advanceLane = (lane: (typeof lanes)[number], targetY: number) => {
    if (targetY <= lane.lastY) return;

    if (lane.lastY < lane.exemptUntil) {
      const exemptEnd = Math.min(targetY, lane.exemptUntil);
      appendLanePoint(lane, { x: lane.x, y: exemptEnd });
      lane.lastY = exemptEnd;
      if (targetY <= lane.exemptUntil) return;
    }

    while (targetY - lane.lastY > maximumStraightLength + bendHeight) {
      const bendStartY = lane.lastY + maximumStraightLength;
      appendLanePoint(lane, { x: lane.x, y: bendStartY });

      const corridorWidth = lane.maximumX - lane.minimumX;
      const horizontalShift = Math.min(mobile ? 38 : 72, corridorWidth * 0.22);
      const inset = Math.min(20, corridorWidth * 0.12);
      const minimumX = lane.minimumX + inset;
      const maximumX = lane.maximumX - inset;
      let nextX = Math.min(
        maximumX,
        Math.max(minimumX, lane.baseX + lane.bendDirection * horizontalShift),
      );

      if (Math.abs(nextX - lane.x) < horizontalShift * 0.55) {
        lane.bendDirection *= -1;
        nextX = Math.min(
          maximumX,
          Math.max(minimumX, lane.baseX + lane.bendDirection * horizontalShift),
        );
      }

      appendLanePoint(lane, { x: nextX, y: bendStartY + bendHeight });
      lane.x = nextX;
      lane.lastY = bendStartY + bendHeight;
      lane.bendDirection *= -1;
    }

    appendLanePoint(lane, { x: lane.x, y: targetY });
    lane.lastY = targetY;
  };
  const crossingOrder = mobile
    ? [0, lanes.length - 1, Math.floor(lanes.length / 2)]
    : [0, lanes.length - 1, 1, lanes.length - 2, Math.floor(lanes.length / 2)];

  crossingOrder.forEach((laneIndex, crossingIndex) => {
    const lane = lanes[laneIndex];
    const targetIndex =
      laneIndex < lanes.length / 2
        ? Math.min(lanes.length - 1, laneIndex + 1)
        : Math.max(0, laneIndex - 1);
    const targetLane = lanes[targetIndex];
    const eventSpacing = mobile ? 0.22 : 0.14;
    const turnY = fieldTop + fieldHeight * (0.2 + crossingIndex * eventSpacing);
    const intersectionHeight = mobile
      ? Math.min(fieldHeight * 0.05, 48)
      : fieldHeight * 0.05;
    const replacementGap = mobile
      ? Math.min(fieldHeight * 0.065, 72)
      : fieldHeight * 0.065;
    const replacementBendHeight = mobile
      ? Math.min(fieldHeight * 0.025, 28)
      : fieldHeight * 0.025;
    const intersectionY = turnY + intersectionHeight;

    lanes.forEach((activeLane) => advanceLane(activeLane, turnY));

    appendLanePoint(lane, { x: targetLane.x, y: intersectionY });

    const replacementStart = {
      x: targetLane.x,
      y: intersectionY + replacementGap,
    };
    const laneGap = Math.abs(targetLane.x - lane.x);
    const towardTarget = lane.x < targetLane.x ? 1 : -1;
    const replacementX = Math.min(
      lane.maximumX - 12,
      Math.max(lane.minimumX + 12, lane.x + towardTarget * laneGap * 0.32),
    );
    const replacementSettle = {
      x: replacementX,
      y: replacementStart.y + replacementBendHeight,
    };
    appendLanePoint(targetLane, { x: targetLane.x, y: replacementSettle.y });
    targetLane.lastY = replacementSettle.y;
    paths.push([replacementStart, replacementSettle]);
    lane.pathIndex = paths.length - 1;
    lane.x = replacementX;
    lane.lastY = replacementSettle.y;
  });

  lanes.forEach((lane) => {
    advanceLane(lane, height - 12);
  });

  const allPaths = paths;
  rings.push(...findCircuitIntersections(allPaths, fieldTop + 16, width));

  return {
    width,
    height,
    paths: allPaths.map(toPath),
    rings,
    labels,
  };
}

function VoteCircuit({ layout }: { layout: CircuitLayout }) {
  return (
    <svg
      className="vote-circuit"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className="vote-circuit__paths">
        {layout.paths.map((path, index) => (
          <path
            key={index}
            d={path}
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: "var(--vote-circuit-stroke)" }}
            onAnimationEnd={(event) => {
              if (event.animationName !== "vote-line-draw") return;

              // The dash is only needed while the line grows. Leaving it on
              // very long paths can render as visible gaps in mobile Safari.
              event.currentTarget.style.strokeDasharray = "none";
              event.currentTarget.style.strokeDashoffset = "0";
            }}
          />
        ))}
      </g>
      <g className="vote-circuit__rings">
        {layout.rings.map((ring, index) => (
          <circle
            key={index}
            cx={ring.x}
            cy={ring.y}
            r="18"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: "var(--vote-circuit-stroke)" }}
          />
        ))}
      </g>
      <g className="vote-circuit__labels">
        {layout.labels.map((label, index) => (
          <text
            key={index}
            x={label.x}
            y={label.y}
            transform={`rotate(90 ${label.x} ${label.y})`}
          >
            YAMAKAWA
          </text>
        ))}
      </g>
    </svg>
  );
}

export default function VotePage() {
  const pageRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);
  const landingYRef = useRef<number | null>(null);
  const [introReady, setIntroReady] = useState(false);
  const [criteriaReady, setCriteriaReady] = useState(false);
  const [circuitSynced, setCircuitSynced] = useState(true);
  const [topTrim, setTopTrim] = useState(0);
  const [circuitLayout, setCircuitLayout] = useState<CircuitLayout | null>(
    null,
  );
  const [entries, setEntries] = useState<VoteEntry[]>([]);
  const [entrySort, setEntrySort] = useState<EntrySort>("newest");
  const [randomSeed, setRandomSeed] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<VoteEntry | null>(null);
  const [pendingVoteEntry, setPendingVoteEntry] = useState<VoteEntry | null>(
    null,
  );
  const [voteHoldActive, setVoteHoldActive] = useState(false);
  const [voteConfirmClosing, setVoteConfirmClosing] = useState(false);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [currentVoteId, setCurrentVoteId] = useState<string | null>(null);
  const [voteState, setVoteState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [votingPhase, setVotingPhase] = useState<VotingPhase | "checking">(
    "checking",
  );
  const holdTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "anonymous"
  >("loading");
  const [entriesState, setEntriesState] = useState<
    "loading" | "ready" | "unconfigured" | "error"
  >("loading");
  const [pendingReportEntry, setPendingReportEntry] =
    useState<VoteEntry | null>(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportToastVisible, setReportToastVisible] = useState(false);
  const [reportHoldActive, setReportHoldActive] = useState(false);
  const reportHoldTimerRef = useRef<number | null>(null);

  const [searchFilter, setSearchFilter] = useState("");

  const withGridAnimation = useCallback(
    (applyChange: () => void) => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const compactPointer = window.matchMedia(
        "(max-width: 760px), (hover: none), (pointer: coarse)",
      ).matches;

      if (entries.length < 2 || reducedMotion) {
        applyChange();
        return;
      }

      if (!compactPointer && document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(applyChange);
        });
        return;
      }

      const previousPositions = new Map(
        Array.from(
          pageRef.current?.querySelectorAll<HTMLElement>(
            "[data-vote-entry-id]",
          ) ?? [],
        ).map((element) => [
          element.dataset.voteEntryId ?? "",
          element.getBoundingClientRect(),
        ]),
      );

      flushSync(applyChange);

      window.requestAnimationFrame(() => {
        pageRef.current
          ?.querySelectorAll<HTMLElement>("[data-vote-entry-id]")
          .forEach((element) => {
            const previous = previousPositions.get(
              element.dataset.voteEntryId ?? "",
            );
            if (!previous) return;
            const current = element.getBoundingClientRect();
            const offsetX = previous.left - current.left;
            const offsetY = previous.top - current.top;
            if (Math.abs(offsetX) < 0.5 && Math.abs(offsetY) < 0.5) return;

            element.animate(
              [
                { transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` },
                { transform: "translate3d(0, 0, 0)" },
              ],
              {
                duration: 480,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              },
            );
          });
      });
    },
    [entries.length],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchFilter !== searchQuery) {
        withGridAnimation(() => setSearchFilter(searchQuery));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchFilter, withGridAnimation]);

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    if (searchFilter.trim() !== "") {
      const lowerQuery = searchFilter.toLowerCase().trim();
      const extractedId = (() => {
        const match = lowerQuery.match(
          /(?:v=|youtu\.be\/|embed\/|\/v\/|shorts\/)([^&?\n\s]+)/,
        );
        if (match && match[1] && match[1].length === 11) return match[1];
        if (/^[A-Za-z0-9_-]{11}$/.test(lowerQuery)) return lowerQuery;
        return null;
      })();

      const normalizeForSearch = (str: string) => {
        return str
          .normalize("NFKC")
          .toLowerCase()
          .replace(/[\u3041-\u3096]/g, (m) =>
            String.fromCharCode(m.charCodeAt(0) + 0x60),
          ) // Hiragana to Katakana
          .replace(/[\s　]+/g, ""); // Remove spaces
      };

      const normalizedQuery = normalizeForSearch(searchFilter);

      result = result.filter((entry) => {
        if (
          extractedId &&
          entry.youtubeId.toLowerCase() === extractedId.toLowerCase()
        )
          return true;
        if (entry.youtubeId.toLowerCase().includes(lowerQuery)) return true;
        if (
          entry.title &&
          normalizeForSearch(entry.title).includes(normalizedQuery)
        )
          return true;
        if (
          entry.channelTitle &&
          normalizeForSearch(entry.channelTitle).includes(normalizedQuery)
        )
          return true;
        return false;
      });
    }

    const sourceOrder = new Map(
      entries.map((entry, index) => [entry.youtubeId, index]),
    );
    const entryTime = (entry: VoteEntry) => {
      const timestamp = entry.submittedAt
        ? Date.parse(entry.submittedAt)
        : Number.NaN;
      return Number.isFinite(timestamp)
        ? timestamp
        : (sourceOrder.get(entry.youtubeId) ?? 0);
    };

    if (entrySort === "random") {
      let currentSeed = randomSeed;
      const random = () => {
        const x = Math.sin(currentSeed++) * 10000;
        return x - Math.floor(x);
      };
      result.sort((a, b) => {
        const hashA = random();
        const hashB = random();
        return hashA - hashB;
      });
    } else {
      result.sort((left, right) => {
        const timeDifference = entryTime(left) - entryTime(right);
        return entrySort === "oldest" ? timeDifference : -timeDifference;
      });
    }

    return result;
  }, [entries, entrySort, randomSeed, searchFilter]);

  const changeEntrySort = (nextSort: EntrySort) => {
    if (nextSort === entrySort && nextSort !== "random") return;

    withGridAnimation(() => {
      if (nextSort === "random") setRandomSeed(Date.now());
      setEntrySort(nextSort);
    });
  };

  const changeSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  const startReportHold = () => {
    if (
      reportHoldTimerRef.current !== null ||
      reportSubmitting ||
      !pendingReportEntry
    ) {
      return;
    }

    const entry = pendingReportEntry;
    setReportHoldActive(true);
    reportHoldTimerRef.current = window.setTimeout(() => {
      reportHoldTimerRef.current = null;
      setReportHoldActive(false);
      void submitReport(entry);
    }, 800);
  };

  const cancelReportHold = () => {
    if (reportHoldTimerRef.current !== null) {
      window.clearTimeout(reportHoldTimerRef.current);
      reportHoldTimerRef.current = null;
    }
    setReportHoldActive(false);
  };

  const [reportToastMessage, setReportToastMessage] =
    useState("通報を記録しました");

  const submitReport = async (entry: VoteEntry) => {
    setReportSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: entry.youtubeId }),
      });
      const payload = (await response.json()) as { error?: string };

      setPendingReportEntry(null);
      if (response.ok) {
        setReportToastMessage("通報を記録しました");
        setReportToastVisible(true);
        setTimeout(() => setReportToastVisible(false), 1800);
      } else if (payload.error === "already_reported") {
        setReportToastMessage("すでに対象の作品を通報済みです");
        setReportToastVisible(true);
        setTimeout(() => setReportToastVisible(false), 2200);
      } else {
        alert("通報を送信できませんでした。もう一度お試しください。");
      }
    } catch {
      alert("通信エラーが発生しました。");
    } finally {
      setReportSubmitting(false);
    }
  };

  const cancelVoteHold = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setVoteHoldActive(false);
  };

  const closeVoteConfirmation = () => {
    if (voteConfirmClosing || voteSubmitting) return;
    cancelVoteHold();
    setVoteConfirmClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setPendingVoteEntry(null);
      setVoteConfirmClosing(false);
      closeTimerRef.current = null;
    }, 260);
  };

  const submitVote = async (entry: VoteEntry) => {
    setVoteSubmitting(true);
    setVoteError(null);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: entry.youtubeId }),
      });
      const payload = (await response.json()) as {
        vote?: { videoId?: string };
        error?: string;
        message?: string;
        phase?: VotingPhase;
      };

      if (response.status === 401) {
        setAuthState("anonymous");
        setCurrentVoteId(null);
        throw new Error(
          "ログインの有効期限が切れました。再度ログインしてください",
        );
      }
      if (payload.error === "voting_not_open") {
        const nextPhase = payload.phase ?? getVotingPhase();
        setVotingPhase(nextPhase);
        throw new Error(
          nextPhase === "before"
            ? "投票期間はまだ始まっていません"
            : "投票期間は終了しました",
        );
      }
      if (!response.ok || payload.vote?.videoId !== entry.youtubeId) {
        throw new Error(
          payload.message ??
            "投票を保存できませんでした。もう一度お試しください",
        );
      }

      setCurrentVoteId(entry.youtubeId);
      setVoteState("ready");
      setVoteSubmitting(false);
      closeVoteConfirmation();
    } catch (error) {
      setVoteError(
        error instanceof Error
          ? error.message
          : "投票を保存できませんでした。もう一度お試しください",
      );
      setVoteSubmitting(false);
    }
  };

  useEffect(() => {
    const updateVotingPhase = () => setVotingPhase(getVotingPhase());
    updateVotingPhase();
    const timer = window.setInterval(updateVotingPhase, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const startVoteHold = () => {
    if (
      holdTimerRef.current !== null ||
      voteConfirmClosing ||
      voteSubmitting ||
      !pendingVoteEntry
    ) {
      return;
    }

    const entry = pendingVoteEntry;
    setVoteHoldActive(true);
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      setVoteHoldActive(false);
      void submitVote(entry);
    }, 800);
  };

  useEffect(() => {
    let active = true;

    const loadEntries = async () => {
      try {
        const response = await fetch("/api/entries");
        const payload = (await response.json()) as {
          entries?: VoteEntry[];
          configured?: boolean;
        };

        if (!active) return;
        if (!response.ok) {
          setEntriesState("error");
          return;
        }

        const nextEntries = Array.isArray(payload.entries)
          ? payload.entries
          : [];
        setEntries((currentEntries) =>
          JSON.stringify(currentEntries) === JSON.stringify(nextEntries)
            ? currentEntries
            : nextEntries,
        );
        setEntriesState(
          payload.configured === false ? "unconfigured" : "ready",
        );
      } catch {
        if (active) setEntriesState("error");
      }
    };

    void loadEntries();
    const refreshTimer = window.setInterval(loadEntries, 60 * 60_000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const payload = (await response.json()) as { authenticated?: boolean };
        if (active) {
          if (!payload.authenticated) {
            setAuthState("anonymous");
            setCurrentVoteId(null);
            setVoteState("idle");
            return;
          }

          setAuthState("authenticated");
          setVoteState("loading");

          const voteResponse = await fetch("/api/vote", { cache: "no-store" });
          const votePayload = (await voteResponse.json()) as {
            vote?: { videoId?: string } | null;
          };
          if (!active) return;
          if (!voteResponse.ok) {
            setVoteState("error");
            return;
          }

          setCurrentVoteId(votePayload.vote?.videoId ?? null);
          setVoteState("ready");
        }
      } catch {
        if (active) {
          setAuthState("anonymous");
          setCurrentVoteId(null);
          setVoteState("error");
        }
      }
    };

    void loadSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedEntry) return;

    const previousOverflow = document.body.style.overflow;
    const lenis = lenisRef.current?.lenis;
    const closeModal = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedEntry(null);
    };

    document.body.style.overflow = "hidden";
    lenis?.stop();
    window.addEventListener("keydown", closeModal);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", closeModal);
    };
  }, [selectedEntry]);

  useEffect(() => {
    if (!pendingVoteEntry) return;

    const previousOverflow = document.body.style.overflow;
    const lenis = lenisRef.current?.lenis;
    const focusFrame = window.requestAnimationFrame(() => {
      continueButtonRef.current?.focus();
    });
    const closeModal = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (closeTimerRef.current !== null) return;
        if (holdTimerRef.current !== null) {
          window.clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        setVoteHoldActive(false);
        setVoteConfirmClosing(true);
        closeTimerRef.current = window.setTimeout(() => {
          setPendingVoteEntry(null);
          setVoteConfirmClosing(false);
          closeTimerRef.current = null;
        }, 260);
      }
    };

    document.body.style.overflow = "hidden";
    lenis?.stop();
    window.addEventListener("keydown", closeModal);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", closeModal);
    };
  }, [pendingVoteEntry]);

  useLayoutEffect(() => {
    let frame = 0;
    let lastPageWidth = 0;
    let lastPageHeight = 0;
    let lastViewportWidth = window.innerWidth;

    const updateCircuit = (force = false) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const page = pageRef.current;
        if (!page) return;

        const pageWidth = page.clientWidth;
        const pageHeight = page.scrollHeight;
        const sizeChanged =
          Math.abs(pageWidth - lastPageWidth) >= 1 ||
          Math.abs(pageHeight - lastPageHeight) >= 1;

        if (!force && !sizeChanged) return;

        lastPageWidth = pageWidth;
        lastPageHeight = pageHeight;
        setCircuitLayout(buildCircuit(page));
      });
    };

    const handleViewportResize = () => {
      const viewportWidth = window.innerWidth;

      // Mobile browser chrome continuously changes the viewport height while
      // scrolling. Rebuilding the full-page SVG for those height-only resizes
      // can leave transient gaps in Safari, so only react to width changes.
      if (Math.abs(viewportWidth - lastViewportWidth) < 2) return;

      lastViewportWidth = viewportWidth;
      updateCircuit(true);
    };

    updateCircuit(true);
    void document.fonts.ready.then(() => updateCircuit(true));
    window.addEventListener("resize", handleViewportResize);

    const resizeObserver = new ResizeObserver(() => updateCircuit());
    const page = pageRef.current;
    if (page) resizeObserver.observe(page);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleViewportResize);
    };
  }, [entries.length, entriesState]);

  useLayoutEffect(() => {
    if (!criteriaReady) return;

    if (landingYRef.current !== null) {
      const adjustedY = Math.max(0, landingYRef.current - topTrim);
      const lenis = lenisRef.current?.lenis;
      if (lenis) {
        lenis.scrollTo(adjustedY, { immediate: true, force: true });
      } else {
        window.scrollTo(0, adjustedY);
      }
      landingYRef.current = null;
    }

    const frame = window.requestAnimationFrame(() => {
      const page = pageRef.current;
      if (page) setCircuitLayout(buildCircuit(page));
      setCircuitSynced(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [criteriaReady, topTrim]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const completeIntro = () => {
      const page = pageRef.current;
      const eyebrow = page?.querySelector<HTMLElement>(".vote-hero__eyebrow");
      if (eyebrow) {
        const eyebrowTop = eyebrow.getBoundingClientRect().top + window.scrollY;
        setTopTrim(Math.max(0, eyebrowTop - 72));
      }
      setCircuitSynced(false);
      setCriteriaReady(true);
    };

    const readyFrame = window.requestAnimationFrame(() => {
      setIntroReady(true);
      if (reducedMotion.matches) completeIntro();
    });

    if (reducedMotion.matches) {
      return () => window.cancelAnimationFrame(readyFrame);
    }

    const scrollTimer = window.setTimeout(() => {
      const page = pageRef.current;
      if (!page) return;

      const hero = page.querySelector<HTMLElement>(".vote-hero");
      if (!hero) return;

      const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const targetY = Math.min(heroBottom + 20, maxScroll);
      const lenis = lenisRef.current?.lenis;
      landingYRef.current = targetY;

      if (lenis) {
        lenis.scrollTo(targetY, {
          duration: 0.9,
          easing: (progress) => 1 - Math.pow(1 - progress, 3),
          lock: true,
          force: true,
          onComplete: completeIntro,
        });
      } else {
        window.scrollTo(0, targetY);
        completeIntro();
      }
    }, 1340);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <>
      <ReactLenis ref={lenisRef} root />
      <main
        ref={pageRef}
        className={`${lineSeedExtraBold.className} home--blank vote-page`}
        data-intro={introReady ? "ready" : "idle"}
        data-scroll={criteriaReady ? "complete" : "pending"}
        data-circuit={
          criteriaReady ? (circuitSynced ? "synced" : "shifting") : "initial"
        }
        style={{ "--vote-top-trim": `${topTrim}px` } as CSSProperties}
      >
        {circuitLayout ? <VoteCircuit layout={circuitLayout} /> : null}
        <section className="vote-hero" aria-labelledby="vote-welcome-title">
          <div className="vote-hero__intro">
            <p className="vote-hero__eyebrow">
              <span aria-hidden="true" />
              投票ページへようこそ！
              <span aria-hidden="true" />
            </p>

            <div className="vote-hero__title-wrap">
              <h1
                id="vote-welcome-title"
                className={`${googleSans.className} vote-hero__title`}
                aria-label="WELCOME TO VOTE!"
              >
                <span className="vote-hero__word" aria-hidden="true">
                  <span data-circuit-mobile="true" data-circuit-anchor="center">
                    W
                  </span>
                  <span data-circuit-desktop="true" data-circuit-anchor="left">
                    E
                  </span>
                  <span data-circuit-desktop="true" data-circuit-anchor="left">
                    L
                  </span>
                  <span>C</span>
                  <span>O</span>
                  <span data-circuit-desktop="true" data-circuit-anchor="left">
                    M
                  </span>
                  <span
                    data-circuit-desktop="true"
                    data-circuit-mobile="true"
                    data-circuit-anchor="left"
                  >
                    E
                  </span>
                </span>
                <span className="vote-hero__title-space" aria-hidden="true" />
                <span className="vote-hero__word" aria-hidden="true">
                  <span
                    data-circuit-desktop="true"
                    data-circuit-anchor="center"
                  >
                    T
                  </span>
                  <span>O</span>
                </span>
                <span className="vote-hero__title-space" aria-hidden="true" />
                <span className="vote-hero__word" aria-hidden="true">
                  <span data-circuit-mobile="true" data-circuit-anchor="center">
                    V
                  </span>
                  <span>O</span>
                  <span
                    data-circuit-desktop="true"
                    data-circuit-mobile="true"
                    data-circuit-anchor="center"
                  >
                    T
                  </span>
                  <span
                    data-circuit-desktop="true"
                    data-circuit-mobile="true"
                    data-circuit-anchor="left"
                  >
                    E
                  </span>
                  <span>!</span>
                </span>
              </h1>
            </div>
          </div>

          {criteriaReady ? (
            <>
              <article
                className="vote-criteria"
                aria-labelledby="vote-criteria-title"
              >
                <h2 id="vote-criteria-title" className="vote-criteria__label">
                  評価する基準
                </h2>
                <p className="vote-criteria__copy">
                  自分が見ていて
                  <br className="vote-criteria__mobile-break" />
                  <strong>面白いな</strong>と思った作品を
                  <br className="vote-criteria__mobile-break" />
                  <strong>投票してください</strong>
                </p>
                <p className="vote-criteria__rule">
                  投票期間：2026年8月29日 20:00 ～ 9月4日 23:59
                </p>
              </article>
              <div className="vote-home-link-wrap">
                <Link
                  className="vote-home-link home-reel-trigger"
                  href="/"
                  aria-label="ホームページに戻る"
                >
                  <VoteReelText label="ホームページに戻る →" />
                </Link>
              </div>
            </>
          ) : null}
        </section>
        <section
          className="vote-line-field"
          aria-labelledby="vote-entries-title"
        >
          <div className="relative w-[min(88%,78rem)] mx-auto pt-[clamp(1.5rem,4svh,3rem)] pb-0 max-sm:w-[calc(100%-2.5rem)] max-sm:pt-6">
            <div className="vote-entry-heading">
              <h2 id="vote-entries-title">エントリー作品一覧</h2>
              <p aria-live="polite">
                エントリー作品合計 :{" "}
                <span className="vote-entry-heading__count">
                  {entriesState === "loading" ? "—" : `${entries.length}件`}
                </span>
              </p>
            </div>
            <div
              className="vote-entry-playlist-wrap"
              style={{
                flexWrap: "wrap-reverse",
                gap: "clamp(0.6rem, 1.5vw, 1.2rem)",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="タイトル、動画リンク、チャンネル名"
                  value={searchQuery}
                  onChange={(e) => changeSearchQuery(e.target.value)}
                  className="vote-entry-search-input"
                  style={{
                    paddingLeft: "calc(clamp(1.2rem, 3vw, 1.8rem) + 1.2rem)",
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0b0b0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: "absolute",
                    left: "1.2rem",
                    pointerEvents: "none",
                  }}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <a
                className="vote-entry-playlist-button home-reel-trigger"
                href="https://www.youtube.com/playlist?list=PLJk526wi3vaA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube再生リストを開く"
                style={{ margin: 0 }}
              >
                <YouTubeLogo className="vote-entry-playlist-button__logo" />
                <VoteReelText label="YouTube再生リスト →" />
              </a>
            </div>
            <div
              className="vote-entry-sort"
              role="radiogroup"
              aria-label="エントリー作品の並び順"
            >
              {entrySortOptions.map((option) => (
                <button
                  className="vote-entry-sort__button home-reel-trigger"
                  type="button"
                  role="radio"
                  data-active={entrySort === option.value}
                  aria-checked={entrySort === option.value}
                  aria-label={`${option.label}で並び替え`}
                  onClick={() => changeEntrySort(option.value)}
                  key={option.value}
                >
                  <VoteReelText label={option.label} />
                </button>
              ))}
            </div>
            {filteredAndSortedEntries.length > 0 ? (
              <>
                <div className="vote-entry-grid">
                  {filteredAndSortedEntries.map((entry, index) => (
                    <article
                      className="vote-entry-item"
                      data-vote-entry-id={entry.youtubeId}
                      style={{
                        viewTransitionName: `vote-entry-${entry.youtubeId}`,
                      }}
                      key={entry.id}
                    >
                      <button
                        className="vote-entry"
                        type="button"
                        onClick={() => setSelectedEntry(entry)}
                        aria-label={`エントリー作品 ${index + 1} を再生`}
                      >
                        <span className="vote-entry__thumbnail">
                          <YouTubeThumbnail
                            youtubeId={entry.youtubeId}
                            alt={`エントリー作品 ${index + 1} のサムネイル`}
                            eager={index < 2}
                          />
                        </span>
                      </button>
                      <div className="vote-entry__actions">
                        <button
                          className={`vote-entry__vote-button home-reel-trigger${
                            authState === "authenticated" &&
                            currentVoteId === entry.youtubeId
                              ? " vote-entry__vote-button--current"
                              : ""
                          }${
                            votingPhase !== "open" &&
                            !(
                              authState === "authenticated" &&
                              currentVoteId === entry.youtubeId
                            )
                              ? " vote-entry__vote-button--unavailable"
                              : ""
                          }`}
                          type="button"
                          disabled={
                            votingPhase !== "open" ||
                            authState === "loading" ||
                            (authState === "authenticated" &&
                              (voteState === "loading" ||
                                currentVoteId === entry.youtubeId))
                          }
                          aria-label={
                            authState === "authenticated" &&
                            currentVoteId === entry.youtubeId
                              ? `エントリー作品 ${index + 1} にすでに投票しています`
                              : votingPhase === "checking"
                                ? "投票期間を確認中"
                                : votingPhase === "before"
                                  ? "投票期間は2026年8月29日20時からです"
                                  : votingPhase === "closed"
                                    ? "投票期間は終了しました"
                                    : authState === "loading"
                                      ? "ログイン状態を確認中"
                                      : authState === "authenticated" &&
                                          currentVoteId
                                        ? `エントリー作品 ${index + 1} に投票を移行する`
                                        : authState === "authenticated"
                                          ? `エントリー作品 ${index + 1} に投票`
                                          : `Discordでログインしてエントリー作品 ${index + 1} に投票`
                          }
                          onClick={() => {
                            if (
                              votingPhase !== "open" ||
                              authState === "loading"
                            )
                              return;
                            if (authState === "anonymous") {
                              window.location.assign(
                                "/api/auth/discord/start?returnTo=%2Fvote",
                              );
                            } else if (currentVoteId !== entry.youtubeId) {
                              setVoteConfirmClosing(false);
                              setVoteError(null);
                              setPendingVoteEntry(entry);
                            }
                          }}
                        >
                          {authState === "authenticated" &&
                          currentVoteId === entry.youtubeId ? (
                            <span className="vote-entry__current-label">
                              すでにこの動画に投票しています
                            </span>
                          ) : votingPhase === "checking" ? (
                            <VoteReelText label="投票期間を確認中" />
                          ) : votingPhase === "before" ? (
                            <VoteReelText label="8月29日 20:00 投票開始" />
                          ) : votingPhase === "closed" ? (
                            <VoteReelText label="投票期間は終了しました" />
                          ) : authState === "loading" ? (
                            <VoteReelText label="確認中" />
                          ) : authState === "authenticated" ? (
                            <VoteReelText
                              label={
                                currentVoteId ? "投票を移行する" : "投票する"
                              }
                            />
                          ) : (
                            <>
                              <DiscordLogo className="vote-entry__discord-icon" />
                              <span className="vote-entry__login-label vote-entry__login-label--desktop">
                                <VoteReelText label="Discordでログインして投票する" />
                              </span>
                              <span className="vote-entry__login-label vote-entry__login-label--mobile">
                                <VoteReelText label="ログインして投票" />
                              </span>
                            </>
                          )}
                        </button>
                        <button
                          className="vote-entry__report-button home-reel-trigger"
                          type="button"
                          aria-label={`エントリー作品 ${index + 1} を通報`}
                          onClick={() => setPendingReportEntry(entry)}
                        >
                          <VoteReelText label="⚑" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <VoteEntryEnding />
              </>
            ) : entriesState === "loading" ? (
              <div className="vote-entry-grid" role="status" aria-busy="true">
                <span className="sr-only">応募作品を読み込んでいます</span>
                {Array.from(
                  { length: ENTRY_LOADING_PLACEHOLDERS },
                  (_, index) => (
                    <span
                      className="vote-entry-status-card"
                      aria-hidden="true"
                      key={index}
                    >
                      <span className="vote-entry-status-card__label">
                        (ºдº≡ºдº)
                      </span>
                    </span>
                  ),
                )}
              </div>
            ) : (
              <>
                <div className="vote-entry-grid" role="status">
                  <span className="sr-only">
                    {entriesState === "error"
                      ? "応募作品の読み込みに失敗しました"
                      : searchQuery !== ""
                        ? "検索結果がありません"
                        : "作品がまだありません"}
                  </span>
                  {Array.from({ length: 2 }, (_, index) => (
                    <span
                      className="vote-entry-status-card"
                      aria-hidden="true"
                      key={index}
                    >
                      <span className="vote-entry-status-card__label">
                        {entriesState === "error"
                          ? "読み込みに失敗しました"
                          : searchQuery !== ""
                            ? "見つかりませんでした"
                            : "|•́ω•̀ )ﾏﾀﾞﾅｲﾖ"}
                      </span>
                    </span>
                  ))}
                </div>
                <VoteEntryEnding />
              </>
            )}
          </div>
        </section>
        <footer
          style={{
            position: "relative",
            zIndex: 100,
            backgroundColor: "#000000",
            borderTop: "none",
            padding: "4rem 1.5rem 5rem",
            textAlign: "center",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
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
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
        {selectedEntry ? (
          <div
            className="fixed z-[1000] inset-0 grid place-items-center p-[clamp(1rem,4vw,3rem)] bg-[rgb(0_0_0_/_82%)] backdrop-blur-[10px]"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedEntry(null);
            }}
          >
            <div
              className="relative w-[min(92vw,74rem)] h-[90vh] sm:h-auto py-[2vh] sm:py-0 flex flex-col justify-between sm:justify-center sm:gap-[clamp(0.8rem,2vw,1.5rem)]"
              onClick={(event) => {
                if (event.target === event.currentTarget)
                  setSelectedEntry(null);
              }}
              role="dialog"
              aria-modal="true"
              aria-label="エントリー動画"
            >
              {/* チャンネル＆概要欄 */}
              <div
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 text-white shrink-0"
                style={{
                  textShadow:
                    "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 2px 5px rgba(0,0,0,0.8)",
                }}
              >
                <div className="flex items-center gap-3 shrink-0">
                  {selectedEntry.channelIcon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={selectedEntry.channelIcon}
                      alt={selectedEntry.channelTitle}
                      className="w-[clamp(2.5rem,4.5vw,3.5rem)] h-[clamp(2.5rem,4.5vw,3.5rem)] rounded-full shadow-[0_0_0_1px_rgba(0,0,0,1)] object-cover bg-neutral-900"
                    />
                  ) : (
                    <div className="w-[clamp(2.5rem,4.5vw,3.5rem)] h-[clamp(2.5rem,4.5vw,3.5rem)] rounded-full shadow-[0_0_0_1px_rgba(0,0,0,1)] bg-neutral-800 flex items-center justify-center font-bold text-xl">
                      {selectedEntry.channelTitle?.charAt(0) || "?"}
                    </div>
                  )}
                  <h3 className="font-bold text-[clamp(1.1rem,2vw,1.5rem)] line-clamp-1">
                    {selectedEntry.channelTitle || "Unknown Channel"}
                  </h3>
                </div>
                <p
                  className="text-[clamp(0.85rem,1.5vw,1rem)] font-medium line-clamp-4 sm:line-clamp-2 sm:text-right sm:max-w-[60%]"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {selectedEntry.description || selectedEntry.title}
                </p>
              </div>

              <div className="relative w-full aspect-video overflow-hidden rounded-[clamp(0.9rem,2vw,1.7rem)] bg-black shadow-[0_1.5rem_5rem_rgb(0_0_0_/_55%)] shrink-0 my-auto sm:my-0">
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${selectedEntry.youtubeId}?autoplay=1`}
                  title="エントリー動画"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              {/* YouTubeで見る ボタン */}
              <div className="flex justify-center mt-2 shrink-0">
                <a
                  className="vote-entry-playlist-button home-reel-trigger"
                  href={`https://youtube.com/watch?v=${selectedEntry.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTubeで見る"
                  style={{ margin: 0 }}
                >
                  <YouTubeLogo className="vote-entry-playlist-button__logo" />
                  <VoteReelText label="YouTubeで見る →" />
                </a>
              </div>
            </div>
          </div>
        ) : null}
        {pendingVoteEntry ? (
          <div
            className={`vote-confirm-modal${
              voteConfirmClosing ? " vote-confirm-modal--closing" : ""
            }`}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeVoteConfirmation();
            }}
          >
            <section
              className="vote-confirm-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="vote-confirm-title"
              aria-describedby="vote-confirm-note"
            >
              <span className="home__mesh home__mesh--top" aria-hidden="true">
                <span className="home__mesh-pattern" />
              </span>
              <span
                className="home__mesh home__mesh--bottom"
                aria-hidden="true"
              >
                <span className="home__mesh-pattern" />
              </span>
              <div className="vote-confirm-card__content">
                <div>
                  <h2 id="vote-confirm-title">
                    <span>投票を続行しますか？</span>
                  </h2>
                  <p id="vote-confirm-note">
                    ※投票期間中は、あとから投票先を変更できます
                  </p>
                  {voteError ? (
                    <p className="vote-confirm-card__error" role="alert">
                      {voteError}
                    </p>
                  ) : null}
                </div>
                <div className="vote-confirm-card__actions">
                  <button
                    ref={continueButtonRef}
                    className={`vote-confirm-card__continue home-reel-trigger${
                      voteHoldActive
                        ? " vote-confirm-card__continue--holding"
                        : ""
                    }`}
                    type="button"
                    disabled={voteSubmitting}
                    aria-label="続行する。長押ししてください"
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      startVoteHold();
                    }}
                    onPointerUp={cancelVoteHold}
                    onPointerCancel={cancelVoteHold}
                    onPointerLeave={cancelVoteHold}
                    onKeyDown={(event) => {
                      if (
                        (event.key === " " || event.key === "Enter") &&
                        !event.repeat
                      ) {
                        event.preventDefault();
                        startVoteHold();
                      }
                    }}
                    onKeyUp={(event) => {
                      if (event.key === " " || event.key === "Enter") {
                        event.preventDefault();
                        cancelVoteHold();
                      }
                    }}
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    <VoteReelText
                      label={voteSubmitting ? "保存中" : "続行する"}
                    />
                  </button>
                  <button
                    className="vote-confirm-card__cancel home-reel-trigger"
                    type="button"
                    disabled={voteSubmitting}
                    onClick={closeVoteConfirmation}
                  >
                    <VoteReelText label="キャンセル" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : null}
        {pendingReportEntry ? (
          <div
            className="vote-confirm-modal"
            onClick={(event) => {
              if (event.target === event.currentTarget && !reportSubmitting) {
                setPendingReportEntry(null);
              }
            }}
          >
            <section
              className="vote-confirm-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="vote-report-title"
            >
              <span className="home__mesh home__mesh--top" aria-hidden="true">
                <span className="home__mesh-pattern" />
              </span>
              <span
                className="home__mesh home__mesh--bottom"
                aria-hidden="true"
              >
                <span className="home__mesh-pattern" />
              </span>
              <div className="vote-confirm-card__content">
                <div>
                  <h2 id="vote-report-title">
                    <span>通報の確認</span>
                  </h2>
                  <p
                    id="vote-report-note"
                    style={{
                      marginTop: "0.6rem",
                      fontSize: "0.95rem",
                      opacity: 0.85,
                    }}
                  >
                    この作品の通報を確定しますか？（長押しで確定）
                  </p>
                </div>
                <div
                  className="vote-confirm-card__actions"
                  style={{ gap: "0.8rem", marginTop: "1.2rem" }}
                >
                  <button
                    className={`vote-confirm-card__continue home-reel-trigger${
                      reportHoldActive
                        ? " vote-confirm-card__continue--holding"
                        : ""
                    }`}
                    type="button"
                    disabled={reportSubmitting}
                    aria-label="通報を確定する。長押ししてください"
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      startReportHold();
                    }}
                    onPointerUp={cancelReportHold}
                    onPointerCancel={cancelReportHold}
                    onPointerLeave={cancelReportHold}
                    onKeyDown={(event) => {
                      if (
                        (event.key === " " || event.key === "Enter") &&
                        !event.repeat
                      ) {
                        event.preventDefault();
                        startReportHold();
                      }
                    }}
                    onKeyUp={(event) => {
                      if (event.key === " " || event.key === "Enter") {
                        event.preventDefault();
                        cancelReportHold();
                      }
                    }}
                    onContextMenu={(event) => event.preventDefault()}
                    style={{ background: "#f63049", color: "#fff" }}
                  >
                    <VoteReelText
                      label={reportSubmitting ? "送信中..." : "長押しで確定"}
                    />
                  </button>
                  <button
                    className="vote-confirm-card__cancel home-reel-trigger"
                    type="button"
                    disabled={reportSubmitting}
                    onClick={() => setPendingReportEntry(null)}
                  >
                    <VoteReelText label="キャンセル" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : null}

        {reportToastVisible ? (
          <div
            style={{
              position: "fixed",
              zIndex: 1100,
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                color: "#111111",
                padding: "1rem 2.2rem",
                borderRadius: "0.85rem",
                fontWeight: 800,
                fontSize: "1.15rem",
                boxShadow: "0 0.8rem 2.5rem rgba(0,0,0,0.35)",
                animation: "vote-confirm-card-in 220ms ease-out both",
              }}
            >
              {reportToastMessage}
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
