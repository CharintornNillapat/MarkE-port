import {
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
} from "three";

// DESIGN.MD §6 hero constellation. Loaded with import() by HeroCanvas, so three.js stays out of the main
// bundle and is never fetched for reduced motion. Geometry is built once; a frame only moves the camera
// and sways the field, so nothing is allocated per frame.
const CAMERA_Z = 10;
const FOV = 50;
const LINK_DISTANCE = 2.2; // world units: points closer than this may be joined
const MAX_LINKS = 3; // per point
const PARALLAX = 0.6; // max camera offset toward the mouse (about 3.4° at CAMERA_Z)
const EASE_SECONDS = 0.4; // time constant of the camera following the mouse
const DRIFT_SECONDS = 30; // camera drift loop
const SWAY_SECONDS = 40; // field sway loop
const SWAY_RAD = 0.1; // about ±6°
const FRAME_MS = 1000 / 60; // cap: high-refresh screens render every other frame

// Returns the teardown: stops the loop, frees GPU resources, drops the WebGL context and the canvas.
export function mountConstellation(container: HTMLElement) {
  const accent = getComputedStyle(container).getPropertyValue("--accent").trim();
  const { clientWidth: width, clientHeight: height } = container;

  // Spread the points over the visible frustum (plus a margin), 70 of them below md, 140 above.
  const count = width < 768 ? 70 : 140;
  const halfH = Math.tan(((FOV / 2) * Math.PI) / 180) * CAMERA_Z * 1.1;
  const halfW = halfH * (width / height);
  const points = Array.from({ length: count }, () => [
    (Math.random() * 2 - 1) * halfW,
    (Math.random() * 2 - 1) * halfH,
    (Math.random() * 2 - 1) * 3,
  ]);

  // Join near pairs once (O(n²) on at most 140 points), at most MAX_LINKS per point.
  const links: number[] = [];
  const degree = new Array(count).fill(0);
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count && degree[i] < MAX_LINKS; j++) {
      if (degree[j] >= MAX_LINKS) continue;
      const [ax, ay, az] = points[i];
      const [bx, by, bz] = points[j];
      if (Math.hypot(ax - bx, ay - by, az - bz) < LINK_DISTANCE) {
        links.push(ax, ay, az, bx, by, bz);
        degree[i]++;
        degree[j]++;
      }
    }
  }

  // Round point sprite drawn in the accent token (points are square without a map).
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  const ctx = sprite.getContext("2d")!;
  ctx.fillStyle = accent;
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();
  const texture = new CanvasTexture(sprite);
  texture.colorSpace = SRGBColorSpace;

  const pointGeometry = new BufferGeometry().setAttribute(
    "position",
    new Float32BufferAttribute(points.flat(), 3),
  );
  const lineGeometry = new BufferGeometry().setAttribute("position", new Float32BufferAttribute(links, 3));
  const pointMaterial = new PointsMaterial({
    map: texture,
    size: 0.08,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const lineMaterial = new LineBasicMaterial({
    color: new Color(accent),
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
  });

  const field = new Group().add(new Points(pointGeometry, pointMaterial), new LineSegments(lineGeometry, lineMaterial));
  const scene = new Scene().add(field);
  const camera = new PerspectiveCamera(FOV, width / height, 0.1, 50);
  camera.position.z = CAMERA_Z;

  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.className = "block size-full";
  container.append(renderer.domElement);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  // Mouse parallax: the camera eases toward the pointer. Touch and pen never move it.
  const target = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    target.x = ((e.clientX / window.innerWidth) * 2 - 1) * PARALLAX;
    target.y = -((e.clientY / window.innerHeight) * 2 - 1) * PARALLAX;
  };

  let t = 0; // own clock, so pausing off-screen doesn't make the drift jump
  let last = 0;
  const offset = { x: 0, y: 0 };
  const tick = (now: number) => {
    if (now - last < FRAME_MS * 0.9) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    t += dt;

    const follow = 1 - Math.exp(-dt / EASE_SECONDS);
    offset.x += (target.x - offset.x) * follow;
    offset.y += (target.y - offset.y) * follow;
    const drift = (t / DRIFT_SECONDS) * Math.PI * 2;
    camera.position.x = Math.sin(drift) * 0.4 + offset.x;
    camera.position.y = Math.cos(drift) * 0.25 + offset.y;
    camera.lookAt(0, 0, 0);
    field.rotation.y = Math.sin((t / SWAY_SECONDS) * Math.PI * 2) * SWAY_RAD;

    renderer.render(scene, camera);
  };

  // Render only while the hero is on screen (hidden tabs already stop requestAnimationFrame).
  const visibility = new IntersectionObserver(([entry]) => {
    last = 0;
    renderer.setAnimationLoop(entry.isIntersecting ? tick : null);
  });
  visibility.observe(container);
  const sizing = new ResizeObserver(resize);
  sizing.observe(container);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  renderer.domElement.animate({ opacity: [0, 1] }, { duration: 600, easing: "ease-out" });

  return () => {
    renderer.setAnimationLoop(null);
    visibility.disconnect();
    sizing.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    pointGeometry.dispose();
    lineGeometry.dispose();
    pointMaterial.dispose();
    lineMaterial.dispose();
    texture.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
