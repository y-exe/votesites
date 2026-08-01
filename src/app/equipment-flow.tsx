"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type EquipmentKind =
  | "mouse"
  | "cursor"
  | "microphone"
  | "monitor"
  | "keyboard"
  | "headphones";

const equipmentKinds: EquipmentKind[] = [
  "mouse",
  "cursor",
  "microphone",
  "monitor",
  "keyboard",
  "headphones",
];

const pinkPalette = [
  "#ffefee",
  "#fc7f81",
];

export const editingAppIcons = [
  { name: "DaVinci Resolve", image: "/model-icons/davinci.png", sideColor: "#17191d" },
  { name: "Adobe Premiere Pro", image: "/model-icons/premiere.png", sideColor: "#00005b" },
  { name: "Adobe After Effects", image: "/model-icons/after-effects.png", sideColor: "#00005b" },
  { name: "CapCut", image: "/model-icons/capcut.jpg", sideColor: "#f6f6f6" },
  { name: "iMovie", image: "/model-icons/imovie.jpg", sideColor: "#7c42db" },
  { name: "Filmora", image: "/model-icons/filmora.jpg", sideColor: "#15191d" },
  { name: "KineMaster", image: "/model-icons/kinemaster.jpg", sideColor: "#e34664" },
  { name: "YMM4", image: "/model-icons/ymm4.png", sideColor: "#242424" },
  { name: "Canva", image: "/model-icons/canva.jpg", sideColor: "#6552c9" },
];

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
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
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

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 2, -2, 0.1, 30);
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    const isMobile = window.innerWidth < 640;
    const equipmentCount = direction === "diagonal"
      ? (isMobile ? 54 : 88)
      : (isMobile ? 34 : 52);
    const appCount = direction === "diagonal"
      ? (isMobile ? 8 : 14)
      : (isMobile ? 6 : 9);
    const count = equipmentCount + appCount;
    const diagonalColumns = isMobile ? 8 : 12;
    const diagonalRows = Math.ceil(count / diagonalColumns);
    let nextApp = 0;
    const items = Array.from({ length: count }, (_, index) => {
      const isApp = index % 7 === 3 && nextApp < appCount;
      const group = isApp
        ? createAppIcon(
            editingAppIcons[nextApp++ % editingAppIcons.length],
            renderer,
          )
        : createEquipment(
            equipmentKinds[index % equipmentKinds.length],
            pinkPalette[index % pinkPalette.length],
          );
      const baseScale = isApp
        ? 0.32 + Math.random() * 0.14
        : 0.18 + Math.random() * 0.14;
      const scale = baseScale * (direction === "diagonal" && isMobile ? 0.64 : 1);
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
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

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

    if (direction === "diagonal") {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    const clock = new THREE.Clock();
    let frame = 0;
    let readyReported = false;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.04);

      if (direction === "diagonal") {
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
      observer.disconnect();
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
