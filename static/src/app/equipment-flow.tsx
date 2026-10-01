"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { editingAppIcons } from "./equipment-data";

type EquipmentKind =
  | "mouse"
  | "cursor"
  | "microphone"
  | "monitor"
  | "keyboard"
  | "headphones";

const equipmentKinds: EquipmentKind[] = [
  "cursor",
  "microphone",
  "monitor",
  "keyboard",
];

const pinkPalette = [
  "#ffefee",
  "#fc7f81",
];

type RenderQuality = "low" | "balanced" | "high";

type NavigatorWithDeviceHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function getRenderProfile() {
  const deviceNavigator = navigator as NavigatorWithDeviceHints;
  const userAgent = navigator.userAgent;
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const isIPad =
    /iPad/.test(userAgent) ||
    (userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const isCompactViewport = window.matchMedia("(max-width: 1024px)").matches;
  const isAndroidTablet =
    /Android/.test(userAgent) && Math.min(window.innerWidth, window.innerHeight) >= 600;
  const isTablet = isIPad || isAndroidTablet;
  const logicalCores = navigator.hardwareConcurrency || 4;
  const deviceMemory = deviceNavigator.deviceMemory;
  const pixelWorkload =
    window.innerWidth *
    window.innerHeight *
    Math.min(window.devicePixelRatio || 1, 2) ** 2;
  const shouldSaveResources =
    deviceNavigator.connection?.saveData === true ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let quality: RenderQuality = "high";

  if (
    isMobile ||
    shouldSaveResources ||
    logicalCores <= 4 ||
    (deviceMemory !== undefined && deviceMemory <= 4)
  ) {
    quality = "low";
  } else if (
    isTablet ||
    isCompactViewport ||
    logicalCores <= 8 ||
    (deviceMemory !== undefined && deviceMemory <= 8) ||
    pixelWorkload >= 8_000_000
  ) {
    quality = "balanced";
  }

  return {
    quality,
    isMobile,
    isTablet,
    logicalCores,
    deviceMemory,
  };
}

function createRoundedSquare(size: number, radius: number) {
  const half = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half + radius, -half);
  shape.lineTo(half - radius, -half);
  shape.quadraticCurveTo(half, -half, half, -half + radius);
  shape.lineTo(half, half - radius);
  shape.quadraticCurveTo(half, half, half - radius, half);
  shape.lineTo(-half + radius, half);
  shape.quadraticCurveTo(-half, half, -half, half - radius);
  shape.lineTo(-half, -half + radius);
  shape.quadraticCurveTo(-half, -half, -half + radius, -half);
  return shape;
}

function createIconFace(shape: THREE.Shape, size: number) {
  const geometry = new THREE.ShapeGeometry(shape, 10);
  const positions = geometry.getAttribute("position");
  const uvs = new Float32Array(positions.count * 2);
  for (let index = 0; index < positions.count; index += 1) {
    uvs[index * 2] = positions.getX(index) / size + 0.5;
    uvs[index * 2 + 1] = positions.getY(index) / size + 0.5;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

function createAppIcon(
  config: (typeof editingAppIcons)[number],
  renderer: THREE.WebGLRenderer,
  maxAnisotropy: number,
) {
  const group = new THREE.Group();
  const size = 1.82;
  const depth = 0.36;
  const shape = createRoundedSquare(size, 0.2);
  const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 10,
  });
  bodyGeometry.translate(0, 0, -depth / 2);
  group.add(
    new THREE.Mesh(
      bodyGeometry,
      new THREE.MeshBasicMaterial({ color: config.sideColor }),
    ),
  );

  const texture = new THREE.TextureLoader().load(config.image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(
    renderer.capabilities.getMaxAnisotropy(),
    maxAnisotropy,
  );
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
  });
  const faceGeometry = createIconFace(shape, size);
  const front = new THREE.Mesh(faceGeometry, material);
  front.position.z = depth / 2 + 0.002;
  group.add(front);
  const backGeometry = faceGeometry.clone();
  const backUvs = backGeometry.getAttribute("uv");
  for (let index = 0; index < backUvs.count; index += 1) {
    backUvs.setX(index, 1 - backUvs.getX(index));
  }
  const back = new THREE.Mesh(backGeometry, material);
  back.position.z = -depth / 2 - 0.002;
  back.rotation.y = Math.PI;
  group.add(back);
  return group;
}

function createEquipment(kind: EquipmentKind, color: string) {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshBasicMaterial({
    color,
  });
  const detailMaterial = new THREE.MeshBasicMaterial({
    color,
  });

  const addBox = (
    size: [number, number, number],
    position: [number, number, number],
    material = bodyMaterial,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    group.add(mesh);
    return mesh;
  };

  if (kind === "mouse") {
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 10, 6),
      bodyMaterial,
    );
    body.scale.set(0.86, 0.55, 1.16);
    group.add(body);
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.14, 8),
      detailMaterial,
    );
    wheel.position.set(0, 0.36, -0.18);
    wheel.rotation.z = Math.PI / 2;
    group.add(wheel);
  }

  if (kind === "cursor") {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.05);
    shape.lineTo(-0.62, -0.55);
    shape.lineTo(-0.18, -0.4);
    shape.lineTo(0.12, -1.02);
    shape.lineTo(0.45, -0.86);
    shape.lineTo(0.15, -0.27);
    shape.lineTo(0.64, -0.13);
    shape.closePath();
    const cursor = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: false,
        curveSegments: 1,
      }),
      bodyMaterial,
    );
    cursor.geometry.center();
    group.add(cursor);
  }

  if (kind === "microphone") {
    const head = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.35, 0.48, 3, 8),
      bodyMaterial,
    );
    head.position.y = 0.4;
    group.add(head);
    addBox([0.16, 0.75, 0.16], [0, -0.32, 0], detailMaterial);
    addBox([1.05, 0.12, 0.62], [0, -0.78, 0]);
    addBox([0.12, 0.9, 0.12], [-0.55, 0.05, 0], detailMaterial);
    addBox([0.12, 0.9, 0.12], [0.55, 0.05, 0], detailMaterial);
  }

  if (kind === "monitor") {
    addBox([1.95, 1.18, 0.2], [0, 0.22, 0]);
    addBox([1.62, 0.84, 0.035], [0, 0.26, 0.118], detailMaterial);
    addBox([0.18, 0.58, 0.18], [0, -0.62, 0]);
    addBox([1.05, 0.12, 0.55], [0, -0.92, 0]);
  }

  if (kind === "keyboard") {
    const slab = addBox([2.15, 0.18, 0.92], [0, 0, 0]);
    slab.rotation.x = -0.08;
    addBox([1.82, 0.05, 0.64], [0, 0.13, 0], detailMaterial).rotation.x = -0.08;
  }

  if (kind === "headphones") {
    group.add(
      new THREE.Mesh(
        new THREE.TorusGeometry(0.72, 0.13, 4, 10, Math.PI),
        bodyMaterial,
      ),
    );
    const leftCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.34, 8),
      detailMaterial,
    );
    leftCup.position.set(-0.72, -0.18, 0);
    leftCup.rotation.z = Math.PI / 2;
    group.add(leftCup);
    const rightCup = leftCup.clone();
    rightCup.position.x = 0.72;
    group.add(rightCup);
    addBox([0.12, 0.42, 0.12], [-0.72, 0.25, 0]);
    addBox([0.12, 0.42, 0.12], [0.72, 0.25, 0]);
  }

  return group;
}

export default function EquipmentFlow({
  direction = "horizontal",
  onReady,
}: {
  direction?: "horizontal" | "diagonal";
  onReady?: () => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const element = mount.current;
    if (!element) return;

    const {
      quality,
      isMobile,
      isTablet,
      logicalCores,
      deviceMemory,
    } = getRenderProfile();
    const isResourceLimited = quality !== "high";
    const pixelRatioLimit = quality === "low" ? 1 : quality === "balanced" ? 1.25 : 2;
    const frameRateLimit = quality === "low" ? 24 : quality === "balanced" ? 30 : 60;
    element.dataset.renderQuality = quality;
    element.dataset.logicalCores = String(logicalCores);
    element.dataset.deviceMemory = deviceMemory === undefined ? "unknown" : String(deviceMemory);
    element.dataset.tablet = String(isTablet);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 2, -2, 0.1, 30);
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({
      antialias: quality === "high",
      alpha: true,
      powerPreference: isResourceLimited ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioLimit));
    renderer.setClearColor(0x000000, 0);
    element.appendChild(renderer.domElement);

    let leftEdge = -4;
    let rightEdge = 4;
    let trackSpan = 9.4;
    let travelOffset = 0;
    let lastScrollPosition = window.scrollY;
    let lastScrollTime = performance.now();
    let lastScrollEventTime = lastScrollTime;
    let targetScrollInfluence = 0;
    let scrollInfluence = 0;
    const lowQuality = quality === "low";
    const balancedQuality = quality === "balanced";
    const equipmentCount = direction === "diagonal"
      ? (isMobile ? 12 : lowQuality ? 20 : balancedQuality ? 30 : 88)
      : (isMobile ? 9 : lowQuality ? 15 : balancedQuality ? 20 : 52);
    const appCount = direction === "diagonal"
      ? (isMobile ? 12 : lowQuality ? 4 : balancedQuality ? 5 : 14)
      : (isMobile ? 9 : lowQuality ? 3 : balancedQuality ? 4 : 9);
    const count = equipmentCount + appCount;
    element.dataset.modelCount = String(count);
    element.dataset.frameRate = String(frameRateLimit);
    element.dataset.pixelRatioLimit = String(pixelRatioLimit);
    const diagonalColumns = isMobile ? 4 : lowQuality ? 5 : balancedQuality ? 6 : 12;
    const diagonalRows = Math.ceil(count / diagonalColumns);
    const appInterval = Math.max(2, Math.floor(count / appCount));
    const appOffset = Math.floor(appInterval / 2);
    let nextApp = 0;
    let nextEquipment = 0;
    const items = Array.from({ length: count }, (_, index) => {
      const isApp = isMobile
        ? index % 2 === 1
        : index % appInterval === appOffset && nextApp < appCount;
      let group: THREE.Group;

      if (isApp) {
        group = createAppIcon(
          editingAppIcons[nextApp++ % editingAppIcons.length],
          renderer,
          quality === "low" ? 1 : quality === "balanced" ? 2 : Number.POSITIVE_INFINITY,
        );
      } else {
        group = createEquipment(
          equipmentKinds[nextEquipment % equipmentKinds.length],
          pinkPalette[nextEquipment % pinkPalette.length],
        );
        nextEquipment += 1;
      }
      const baseScale = isApp
        ? 0.32 + Math.random() * 0.14
        : 0.18 + Math.random() * 0.14;
      const scale = baseScale *
        (direction === "diagonal" && isMobile ? 0.8 : lowQuality ? 0.9 : 1);
      group.scale.setScalar(scale);
      group.position.set(
        0,
        (isApp ? -1.05 : -1.25) + Math.random() * (isApp ? 2.1 : 2.5),
        -0.8 + Math.random() * 1.6,
      );
      group.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );
      scene.add(group);
      return {
        group,
        diagonalXPhase:
          ((index % diagonalColumns) + 0.16 + Math.random() * 0.68) /
          diagonalColumns,
        diagonalYPhase:
          (Math.floor(index / diagonalColumns) + 0.16 + Math.random() * 0.68) /
          diagonalRows,
        spin: new THREE.Vector3(
          -1.1 + Math.random() * 2.2,
          -1.1 + Math.random() * 2.2,
          -0.8 + Math.random() * 1.6,
        ),
      };
    });

    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height, false);
      const vertical = direction === "diagonal" ? 3.2 : 2;
      const aspect = width / height;
      leftEdge = -vertical * aspect;
      rightEdge = vertical * aspect;
      camera.left = leftEdge;
      camera.right = rightEdge;
      camera.top = vertical;
      camera.bottom = -vertical;
      camera.updateProjectionMatrix();
      trackSpan = rightEdge - leftEdge + 1.8;
      items.forEach(({ group, diagonalXPhase, diagonalYPhase }, index) => {
        if (direction === "diagonal") {
          const travelProgress = travelOffset / trackSpan;
          const xProgress = (diagonalXPhase - travelProgress + 1) % 1;
          const yProgress = (diagonalYPhase + travelProgress + 1) % 1;
          group.position.x = leftEdge - 1 + xProgress * (rightEdge - leftEdge + 2);
          group.position.y = -vertical - 1 + yProgress * (vertical * 2 + 2);
        } else {
          const phase =
            ((index * trackSpan) / items.length + travelOffset) % trackSpan;
          group.position.x = rightEdge + 0.9 - phase;
        }
      });
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    resize();

    let isNearViewport = false;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;
      },
      { rootMargin: "300px 0px" },
    );
    visibilityObserver.observe(element);

    const handleScroll = () => {
      if (direction !== "diagonal") return;

      const now = performance.now();
      const elapsed = Math.min(Math.max(now - lastScrollTime, 8), 80);
      const scrollPosition = window.scrollY;
      const velocity = ((scrollPosition - lastScrollPosition) / elapsed) * 1000;
      const velocityRatio = Math.min(Math.abs(velocity) / 1400, 1);

      if (velocity > 2) {
        targetScrollInfluence = 0.35 + velocityRatio * 3.4;
      } else if (velocity < -2) {
        targetScrollInfluence = -(1.05 + velocityRatio * 3.4);
      }

      lastScrollPosition = scrollPosition;
      lastScrollTime = now;
      lastScrollEventTime = now;
    };

    const scrollReactive = direction === "diagonal" && !isMobile && !isTablet;

    if (scrollReactive) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    const timer = new THREE.Timer();
    timer.connect(document);
    let frame = 0;
    let readyReported = false;
    let previousFrameTime = performance.now();
    let renderAccumulator = 0;
    const renderInterval = 1000 / frameRateLimit;
    const animate = (timestamp = performance.now()) => {
      frame = requestAnimationFrame(animate);

      const frameElapsed = Math.min(timestamp - previousFrameTime, 100);
      previousFrameTime = timestamp;

      if (!isNearViewport || document.visibilityState === "hidden") {
        renderAccumulator = 0;
        return;
      }

      renderAccumulator += frameElapsed;
      if (renderAccumulator < renderInterval) return;
      renderAccumulator %= renderInterval;

      timer.update(timestamp);
      const delta = Math.min(timer.getDelta(), 0.06);

      if (scrollReactive) {
        if (performance.now() - lastScrollEventTime > 90) {
          targetScrollInfluence +=
            (0 - targetScrollInfluence) * Math.min(delta * 5.5, 1);
        }

        scrollInfluence +=
          (targetScrollInfluence - scrollInfluence) * Math.min(delta * 10, 1);
      }

      const travelSpeed = 0.68 + scrollInfluence;
      travelOffset =
        ((travelOffset + delta * travelSpeed) % trackSpan + trackSpan) % trackSpan;
      items.forEach(({ group, diagonalXPhase, diagonalYPhase, spin }, index) => {
        if (direction === "diagonal") {
          const travelProgress = travelOffset / trackSpan;
          const xProgress = (diagonalXPhase - travelProgress + 1) % 1;
          const yProgress = (diagonalYPhase + travelProgress + 1) % 1;
          group.position.x = leftEdge - 1 + xProgress * (rightEdge - leftEdge + 2);
          group.position.y = camera.bottom - 1 + yProgress * (camera.top - camera.bottom + 2);
        } else {
          const phase =
            ((index * trackSpan) / items.length + travelOffset) % trackSpan;
          group.position.x = rightEdge + 0.9 - phase;
        }

        group.rotation.x += spin.x * delta;
        group.rotation.y += spin.y * delta;
        group.rotation.z += spin.z * delta;
      });
      renderer.render(scene, camera);
      if (!readyReported) {
        readyReported = true;
        onReadyRef.current?.();
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      timer.dispose();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      renderer.dispose();
      items.forEach(({ group }) => {
        group.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material instanceof THREE.MeshBasicMaterial) material.map?.dispose();
            material.dispose();
          });
        });
      });
      element.replaceChildren();
    };
  }, [direction]);

  return (
    <div
      className={`home__equipment-flow home__equipment-flow--${direction}`}
      ref={mount}
      aria-hidden="true"
    />
  );
}
