"use client";

import localFont from "next/font/local";
import { Google_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import DiscordLogo from "../discord-logo";

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
};

function YouTubeThumbnail({ youtubeId, alt }: { youtubeId: string; alt: string }) {
  const [resolution, setResolution] = useState<
    "maxresdefault" | "sddefault" | "hqdefault"
  >("maxresdefault");

  return (
    <Image
      src={`https://i.ytimg.com/vi/${youtubeId}/${resolution}.jpg`}
      alt={alt}
      fill
      sizes="(max-width: 640px) calc(100vw - 2.5rem), 44vw"
      onError={() => {
        setResolution((current) =>
          current === "maxresdefault" ? "sddefault" : "hqdefault",
        );
      }}
    />
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

function toPath(points: CircuitPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join("");
}

function findCircuitIntersections(paths: CircuitPoint[][], minimumY: number, width: number) {
  const intersections: CircuitPoint[] = [];

  for (let firstPathIndex = 0; firstPathIndex < paths.length; firstPathIndex += 1) {
    const firstPath = paths[firstPathIndex];
    for (let secondPathIndex = firstPathIndex + 1; secondPathIndex < paths.length; secondPathIndex += 1) {
      const secondPath = paths[secondPathIndex];

      for (let firstSegment = 0; firstSegment + 1 < firstPath.length; firstSegment += 1) {
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
          const firstVertical = Math.abs(firstDx) < 0.001 && Math.abs(firstDy) > 0.001;
          const secondVertical = Math.abs(secondDx) < 0.001 && Math.abs(secondDy) > 0.001;
          const firstDiagonal = Math.abs(firstDx) > 0.001 && Math.abs(firstDy) > 0.001;
          const secondDiagonal = Math.abs(secondDx) > 0.001 && Math.abs(secondDy) > 0.001;

          if (
            !((firstVertical && secondDiagonal) || (firstDiagonal && secondVertical))
          ) {
            continue;
          }

          const denominator = firstDx * secondDy - firstDy * secondDx;

          if (Math.abs(denominator) < 0.001) continue;

          const offsetX = c.x - a.x;
          const offsetY = c.y - a.y;
          const firstProgress = (offsetX * secondDy - offsetY * secondDx) / denominator;
          const secondProgress = (offsetX * firstDy - offsetY * firstDx) / denominator;

          const firstInside = firstProgress > 0.025 && firstProgress < 0.975;
          const secondInside = secondProgress > 0.025 && secondProgress < 0.975;
          const firstOnSegment = firstProgress >= -0.001 && firstProgress <= 1.001;
          const secondOnSegment = secondProgress >= -0.001 && secondProgress <= 1.001;

          // A branch may begin or end on the middle of another line. Ignore
          // only endpoint-to-endpoint contacts, which are ordinary bends.
          if (!firstOnSegment || !secondOnSegment || (!firstInside && !secondInside)) {
            continue;
          }

          const point = {
            x: a.x + firstProgress * firstDx,
            y: a.y + firstProgress * firstDy,
          };
          if (point.y <= minimumY || point.x < 30 || point.x > width - 30) continue;

          const alreadyAdded = intersections.some(
            (existing) => Math.hypot(existing.x - point.x, existing.y - point.y) < 3,
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
  const sourceElements = Array.from(page.querySelectorAll<HTMLElement>(selector));

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
          rect.left - pageRect.left +
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
  const clampToTitle = (x: number) => Math.min(safeRight, Math.max(safeLeft, x));

  const paths = anchors.map((anchor) => [anchor]);
  const rings: CircuitPoint[] = [];
  const labels: CircuitPoint[] = [];
  let currentX = anchors.map((anchor) => anchor.x);
  const maxAnchorY = Math.max(...anchors.map((anchor) => anchor.y));

  // The opening viewport is deliberately self-contained: every line stays
  // inside the title width and no junction rings are drawn here.
  const heroTurnStart = maxAnchorY + Math.max(72, (fieldTop - maxAnchorY) * 0.26);
  const heroTurnEnd = Math.max(heroTurnStart + 100, fieldTop - (mobile ? 70 : 95));
  const heroOrdered = currentX
    .map((x, index) => ({ x, index }))
    .sort((a, b) => a.x - b.x);
  const heroTargets = [...currentX];

  for (let index = 0; index + 1 < heroOrdered.length; index += 2) {
    const first = heroOrdered[index];
    const second = heroOrdered[index + 1];
    const gap = second.x - first.x;

    // One line remains vertical while the other crosses it diagonally. This
    // keeps every intersection in the straight-line × diagonal-line form.
    heroTargets[first.index] = clampToTitle(first.x);
    heroTargets[second.index] = clampToTitle(first.x - gap * 0.42);
  }

  paths.forEach((points, lineIndex) => {
    points.push({ x: clampToTitle(currentX[lineIndex]), y: heroTurnStart });
    points.push({ x: heroTargets[lineIndex], y: heroTurnEnd });
    points.push({ x: heroTargets[lineIndex], y: fieldTop });
  });
  currentX = heroTargets;

  // Once the hero has left the viewport, release the title-width constraint
  // and fan the same uninterrupted paths out into the full-page circuit.
  const spreadLeft = width * (mobile ? 0.13 : 0.11);
  const spreadRight = width * (mobile ? 0.87 : 0.89);
  const spreadLanes = currentX.map((_, index) =>
    currentX.length === 1
      ? width / 2
      : spreadLeft + ((spreadRight - spreadLeft) * index) / (currentX.length - 1),
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
    const targetCandidates = sameSideCandidates.length > 0
      ? sameSideCandidates
      : activeLines;
    const targetLine = targetCandidates.reduce((nearest, candidate) =>
      Math.abs(currentX[candidate] - lineX) < Math.abs(currentX[nearest] - lineX)
        ? candidate
        : nearest,
    );
    const turnY = fieldTop + 175 + inactiveIndex * 90;
    const intersectionY = turnY + 110;

    // A discarded lane first runs straight, then ends exactly where its
    // diagonal meets a continuing vertical lane. It never ends at a lone ring.
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
      laneIndex === 0
        ? 36
        : (orderedAtEnd[laneIndex - 1].x + lane.x) / 2,
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

    // Keep the labelled section uninterrupted. Once the word has cleared,
    // every lane must change direction before one straight run grows too long.
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
      const horizontalShift = Math.min(
        mobile ? 38 : 72,
        corridorWidth * 0.22,
      );
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
    const targetIndex = laneIndex < lanes.length / 2
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
      Math.max(
        lane.minimumX + 12,
        lane.x + towardTarget * laneGap * 0.32,
      ),
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
          <path key={index} d={path} pathLength="1" />
        ))}
      </g>
      <g className="vote-circuit__rings">
        {layout.rings.map((ring, index) => (
          <circle key={index} cx={ring.x} cy={ring.y} r="18" />
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
  const [circuitLayout, setCircuitLayout] = useState<CircuitLayout | null>(null);
  const [entries, setEntries] = useState<VoteEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<VoteEntry | null>(null);
  const [pendingVoteEntry, setPendingVoteEntry] = useState<VoteEntry | null>(null);
  const [voteHoldActive, setVoteHoldActive] = useState(false);
  const [voteConfirmClosing, setVoteConfirmClosing] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "anonymous">(
    "loading",
  );
  const [entriesState, setEntriesState] = useState<
    "loading" | "ready" | "unconfigured" | "error"
  >("loading");

  const cancelVoteHold = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setVoteHoldActive(false);
  };

  const closeVoteConfirmation = () => {
    if (voteConfirmClosing) return;
    cancelVoteHold();
    setVoteConfirmClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setPendingVoteEntry(null);
      setVoteConfirmClosing(false);
      closeTimerRef.current = null;
    }, 260);
  };

  const startVoteHold = () => {
    if (holdTimerRef.current !== null || voteConfirmClosing) return;

    setVoteHoldActive(true);
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      setVoteHoldActive(false);
      closeVoteConfirmation();
    }, 800);
  };

  useEffect(() => {
    let active = true;

    const loadEntries = async () => {
      try {
        const response = await fetch("/api/entries", { cache: "no-store" });
        const payload = (await response.json()) as {
          entries?: VoteEntry[];
          configured?: boolean;
        };

        if (!active) return;
        if (!response.ok) {
          setEntriesState("error");
          return;
        }

        const nextEntries = Array.isArray(payload.entries) ? payload.entries : [];
        setEntries((currentEntries) =>
          currentEntries.map((entry) => entry.youtubeId).join(",") ===
          nextEntries.map((entry) => entry.youtubeId).join(",")
            ? currentEntries
            : nextEntries,
        );
        setEntriesState(payload.configured === false ? "unconfigured" : "ready");
      } catch {
        if (active) setEntriesState("error");
      }
    };

    void loadEntries();
    const refreshTimer = window.setInterval(loadEntries, 60_000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as { authenticated?: boolean };
        if (active) {
          setAuthState(payload.authenticated ? "authenticated" : "anonymous");
        }
      } catch {
        if (active) setAuthState("anonymous");
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
    const updateCircuit = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const page = pageRef.current;
        if (page) setCircuitLayout(buildCircuit(page));
      });
    };

    updateCircuit();
    void document.fonts.ready.then(updateCircuit);
    window.addEventListener("resize", updateCircuit);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateCircuit);
    };
  }, [entries.length]);

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
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
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
      data-circuit={criteriaReady ? (circuitSynced ? "synced" : "shifting") : "initial"}
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
                <span data-circuit-mobile="true" data-circuit-anchor="center">W</span>
                <span data-circuit-desktop="true" data-circuit-anchor="left">E</span>
                <span data-circuit-desktop="true" data-circuit-anchor="left">L</span>
                <span>C</span>
                <span>O</span>
                <span data-circuit-desktop="true" data-circuit-anchor="left">M</span>
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
                <span data-circuit-desktop="true" data-circuit-anchor="center">T</span>
                <span>O</span>
              </span>
              <span className="vote-hero__title-space" aria-hidden="true" />
              <span className="vote-hero__word" aria-hidden="true">
                <span data-circuit-mobile="true" data-circuit-anchor="center">V</span>
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
            <article className="vote-criteria" aria-labelledby="vote-criteria-title">
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
              <p className="vote-criteria__notice">
                <strong>不快な内容</strong>が含まれる動画を発見した場合は、
                <strong>通報ボタン</strong>で通報のご協力をお願い致します。
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
      <section className="vote-line-field" aria-labelledby="vote-entries-title">
        <div className="vote-entries">
          <h2 id="vote-entries-title" className="vote-entries__title">
            ENTRY VIDEOS
          </h2>
          {entries.length > 0 ? (
            <div className="vote-entries__grid">
              {entries.map((entry, index) => (
                <article className="vote-entry-item" key={entry.id}>
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
                      />
                    </span>
                  </button>
                  <div className="vote-entry__actions">
                    <button
                      className="vote-entry__vote-button home-reel-trigger"
                      type="button"
                      aria-label={
                        authState === "authenticated"
                          ? `エントリー作品 ${index + 1} に投票`
                          : `Discordでログインしてエントリー作品 ${index + 1} に投票`
                      }
                      onClick={() => {
                        if (authState !== "authenticated") {
                          window.location.assign(
                            "/api/auth/discord/start?returnTo=%2Fvote",
                          );
                        } else {
                          setVoteConfirmClosing(false);
                          setPendingVoteEntry(entry);
                        }
                      }}
                    >
                      {authState === "authenticated" ? (
                        <VoteReelText label="投票する" />
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
                    >
                      <VoteReelText label="⚑" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : entriesState === "loading" ? (
            <div className="vote-entries__grid" role="status" aria-busy="true">
              <span className="vote-sr-only">応募作品を読み込んでいます</span>
              {Array.from({ length: 4 }, (_, index) => (
                <span className="vote-entry-skeleton" aria-hidden="true" key={index} />
              ))}
            </div>
          ) : (
            <p className="vote-entries__status" role="status">
              {entriesState === "error"
                ? "応募作品を読み込めませんでした"
                : "応募作品は準備中です"}
            </p>
          )}
        </div>
      </section>
      {selectedEntry ? (
        <div
          className="vote-video-modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedEntry(null);
          }}
        >
          <div
            className="vote-video-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-label="エントリー動画"
          >
            <div className="vote-video-modal__video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedEntry.youtubeId}?autoplay=1`}
                title="エントリー動画"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
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
            <span className="home__mesh home__mesh--bottom" aria-hidden="true">
              <span className="home__mesh-pattern" />
            </span>
            <div className="vote-confirm-card__content">
              <div>
                <h2 id="vote-confirm-title">
                  <span>投票を続行しますか？</span>
                </h2>
                <p id="vote-confirm-note">※取り消し・投票の移動は可能です</p>
              </div>
              <div className="vote-confirm-card__actions">
                <button
                  ref={continueButtonRef}
                  className={`vote-confirm-card__continue home-reel-trigger${
                    voteHoldActive ? " vote-confirm-card__continue--holding" : ""
                  }`}
                  type="button"
                  aria-label="続行する。長押ししてください"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    startVoteHold();
                  }}
                  onPointerUp={cancelVoteHold}
                  onPointerCancel={cancelVoteHold}
                  onPointerLeave={cancelVoteHold}
                  onKeyDown={(event) => {
                    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
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
                  <VoteReelText label="続行する" />
                </button>
                <button
                  className="vote-confirm-card__cancel home-reel-trigger"
                  type="button"
                  onClick={closeVoteConfirmation}
                >
                  <VoteReelText label="キャンセル" />
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
    </>
  );
}
