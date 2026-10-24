import { useEffect, useRef } from "react";

/*
  Hero particle sphere — the brand's signature element (use once).
  • Real 3D: points on a Fibonacci sphere, rotated about Y with a slight tilt,
    so particles orbit rather than a flat disc spinning.
  • Dense at the rim, dissolving toward the centre (alpha ∝ rim³), as in the
    reference. Front-facing points use --color-arc-cyan, back-facing points
    --color-signal-blue — both read from the theme, nothing hard-coded.
  • Cost control: one canvas, ~1,100 points, DPR capped at 2, loop paused when
    off-screen or tab hidden, a single static frame for reduced motion, and a
    gentle pointer tilt only on fine pointers.
*/

const COUNT = 1100;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

const POINTS = Array.from({ length: COUNT }, (_, i) => {
  const y = 1 - (i / (COUNT - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const a = GOLDEN * i;
  return [Math.cos(a) * r, y, Math.sin(a) * r] as const;
});

export default function ParticleSphere({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    const cyan = token("--color-arc-cyan", "#34fcff");
    const blue = token("--color-signal-blue", "#0428cb");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let dpr = 1;
    let angle = 0.6;
    let tiltX = 0.35;
    let tiltY = 0;
    let targetX = 0.35;
    let targetY = 0;
    let visible = true;
    let raf = 0;
    let last = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.height = Math.round(canvas.clientWidth * dpr);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const c = canvas.width / 2;
      const R = canvas.width * 0.4;
      const cosY = Math.cos(angle + tiltY);
      const sinY = Math.sin(angle + tiltY);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      for (const front of [false, true]) {
        ctx.fillStyle = front ? cyan : blue;
        for (const [px, py, pz] of POINTS) {
          const x1 = px * cosY + pz * sinY;
          const z1 = -px * sinY + pz * cosY;
          const y2 = py * cosX - z1 * sinX;
          const z2 = py * sinX + z1 * cosX;
          if (z2 > 0 !== front) continue;

          const rim = Math.hypot(x1, y2); // 0 centre → 1 silhouette edge
          ctx.globalAlpha = (0.06 + 0.94 * rim ** 3) * (front ? 1 : 0.6);
          ctx.beginPath();
          ctx.arc(c + x1 * R, c + y2 * R, (0.6 + rim * 1.2) * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      angle += dt * 0.00014; // ≈ one turn per 45s
      tiltX += (targetX - tiltX) * 0.04;
      tiltY += (targetY - tiltY) * 0.04;
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || reduce || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointer = (e: PointerEvent) => {
      targetY = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetX = 0.35 + (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });

    resize();
    draw();
    resizeObserver.observe(canvas);
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}