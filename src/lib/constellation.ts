// DESIGN.MD §6 hero constellation, drawn on a 2D canvas with a hand-rolled perspective projection (140
// points need no WebGL). Loaded with import() by HeroCanvas, so it stays out of the main bundle and is
// never fetched for reduced motion. The points and links are built once; a frame only moves the camera and
// sways the field, so nothing is allocated per frame.
const CAMERA_Z = 10;
const FOV = 50;
const LINK_DISTANCE = 2.2; // world units: points closer than this may be joined
const MAX_LINKS = 3; // per point
const PARALLAX = 0.6; // max camera offset toward the mouse (about 3.4° at CAMERA_Z)
const EASE_SECONDS = 0.4; // time constant of the camera following the mouse
const DRIFT_SECONDS = 30; // camera drift loop
const SWAY_SECONDS = 40; // field sway loop
const SWAY_RAD = 0.1; // about ±6°
const POINT_SIZE = 0.08; // world units
const FRAME_MS = 1000 / 60; // cap: high-refresh screens render every other frame

// Returns the teardown: stops the loop and drops the canvas.
export function mountConstellation(container: HTMLElement) {
  const accent = getComputedStyle(container).getPropertyValue("--accent").trim();
  const canvas = document.createElement("canvas");
  canvas.className = "block size-full";
  const ctx = canvas.getContext("2d")!;
  container.append(canvas);

  // Spread the points over the visible frustum (plus a margin), 70 of them below md, 140 above.
  const { clientWidth: width, clientHeight: height } = container;
  const count = width < 768 ? 70 : 140;
  const halfH = Math.tan(((FOV / 2) * Math.PI) / 180) * CAMERA_Z * 1.1;
  const halfW = halfH * (width / height);
  const points = Array.from({ length: count }, () => [
    (Math.random() * 2 - 1) * halfW,
    (Math.random() * 2 - 1) * halfH,
    (Math.random() * 2 - 1) * 3,
  ]);

  // Join near pairs once (O(n²) on at most 140 points), at most MAX_LINKS per point.
  const links: [number, number][] = [];
  const degree = new Array(count).fill(0);
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count && degree[i] < MAX_LINKS; j++) {
      if (degree[j] >= MAX_LINKS) continue;
      const [ax, ay, az] = points[i];
      const [bx, by, bz] = points[j];
      if (Math.hypot(ax - bx, ay - by, az - bz) < LINK_DISTANCE) {
        links.push([i, j]);
        degree[i]++;
        degree[j]++;
      }
    }
  }

  let w = 0;
  let h = 0;
  let focal = 0; // px per world unit at depth 1
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    w = container.clientWidth;
    h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    focal = h / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
  };
  resize();

  // Mouse parallax: the camera eases toward the pointer. Touch and pen never move it.
  const target = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    target.x = ((e.clientX / window.innerWidth) * 2 - 1) * PARALLAX;
    target.y = -((e.clientY / window.innerHeight) * 2 - 1) * PARALLAX;
  };

  const screen = points.map(() => [0, 0, 0]); // x, y, radius in px
  let t = 0; // own clock, so pausing off-screen doesn't make the drift jump
  let last = 0;
  const offset = { x: 0, y: 0 };
  const draw = (now: number) => {
    if (now - last < FRAME_MS * 0.9) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    t += dt;

    const follow = 1 - Math.exp(-dt / EASE_SECONDS);
    offset.x += (target.x - offset.x) * follow;
    offset.y += (target.y - offset.y) * follow;
    const drift = (t / DRIFT_SECONDS) * Math.PI * 2;
    const camX = Math.sin(drift) * 0.4 + offset.x;
    const camY = Math.cos(drift) * 0.25 + offset.y;
    const sway = Math.sin((t / SWAY_SECONDS) * Math.PI * 2) * SWAY_RAD;
    const cos = Math.cos(sway);
    const sin = Math.sin(sway);

    // Camera at (camX, camY, CAMERA_Z) looking at the origin: a small-angle lookAt keeps the origin centred.
    points.forEach(([x, y, z], k) => {
      const rx = x * cos + z * sin; // field turned about Y
      const rz = -x * sin + z * cos;
      const depth = CAMERA_Z - rz;
      screen[k][0] = w / 2 + focal * ((rx - camX) / depth + camX / CAMERA_Z);
      screen[k][1] = h / 2 - focal * ((y - camY) / depth + camY / CAMERA_Z);
      screen[k][2] = ((POINT_SIZE / 2) * focal) / depth;
    });

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    for (const [a, b] of links) {
      ctx.moveTo(screen[a][0], screen[a][1]);
      ctx.lineTo(screen[b][0], screen[b][1]);
    }
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    for (const [x, y, r] of screen) {
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill();
  };

  // Draw only while the hero is on screen (hidden tabs already stop requestAnimationFrame).
  let frame = 0;
  const loop = (now: number) => {
    draw(now);
    frame = requestAnimationFrame(loop);
  };
  const visibility = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);
    last = 0;
    if (entry.isIntersecting) frame = requestAnimationFrame(loop);
  });
  visibility.observe(container);
  const sizing = new ResizeObserver(resize);
  sizing.observe(container);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.animate({ opacity: [0, 1] }, { duration: 600, easing: "ease-out" });

  return () => {
    cancelAnimationFrame(frame);
    visibility.disconnect();
    sizing.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    canvas.remove();
  };
}
