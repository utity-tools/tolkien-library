import { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import { cropSvgImage, type ArtImage } from '../art';
import { clamp, easeOutCubic } from '../lib/math';
import { prefersReducedMotion } from '../lib/motion';

export const POSTER_H = 900;
/** Blob layout designed on a 474-wide poster; x is scaled for wider covers. */
const BASE_W = 474;
const BLOBS: readonly (readonly [cx: number, cy: number, delay: number])[] = [
  [150, 330, 0],
  [340, 600, 120],
  [250, 120, 220],
  [90, 760, 300],
  [400, 250, 360],
  [260, 860, 420],
  [230, 470, 180],
];
const GROW_MS = 1250;
const MAX_R = 720;
const LOOP_MS = 2400;

export interface InkPosterHandle {
  reset(): void;
  /** Starts the ink bleed after `startDelay` ms. */
  bleed(startDelay: number): void;
}

interface Props {
  readonly art: ArtImage | null;
  readonly width: number;
}

/** The detail poster: the cover crop revealed through ragged, spreading ink blots. */
export const InkPoster = forwardRef<InkPosterHandle, Props>(({ art, width }, ref) => {
  const uid = useId().replace(/:/g, '');
  const circles = useRef<(SVGCircleElement | null)[]>([]);
  const raf = useRef(0);

  const setR = (r: (i: number) => number) =>
    circles.current.forEach((c, i) => c?.setAttribute('r', r(i).toFixed(1)));

  useImperativeHandle(ref, () => ({
    reset() {
      cancelAnimationFrame(raf.current);
      setR(() => 0);
    },
    bleed(startDelay) {
      cancelAnimationFrame(raf.current);
      const start = performance.now() + startDelay - (prefersReducedMotion() ? 5000 : 0);
      const tick = (now: number) => {
        const t = now - start;
        setR((i) => MAX_R * easeOutCubic(clamp((t - (BLOBS[i]?.[2] ?? 0)) / GROW_MS, 0, 1)));
        if (t < LOOP_MS) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    },
  }));

  const sx = width / BASE_W;
  return (
    <svg viewBox={`0 0 ${width} ${POSTER_H}`} className="block h-full w-full" aria-hidden>
      <defs>
        <clipPath id={`clip${uid}`}>
          <rect width={width} height={POSTER_H} />
        </clipPath>
        <filter id={`ink${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves={3} seed={7} />
          <feDisplacementMap in="SourceGraphic" scale={120} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={`mask${uid}`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={width + 400} height={POSTER_H + 400}>
          <g filter={`url(#ink${uid})`}>
            {BLOBS.map(([cx, cy], i) => (
              <circle
                key={i}
                ref={(el) => {
                  circles.current[i] = el;
                }}
                cx={cx * sx}
                cy={cy}
                r={0}
                fill="#fff"
              />
            ))}
          </g>
        </mask>
      </defs>
      <g clipPath={`url(#clip${uid})`} mask={`url(#mask${uid})`}>
        {art && <image {...cropSvgImage(art, width, POSTER_H)} preserveAspectRatio="none" />}
      </g>
    </svg>
  );
});
InkPoster.displayName = 'InkPoster';
