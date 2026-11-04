export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Cubic Hermite smoothstep on [0, 1]. */
export const smoothstep = (x: number): number => x * x * (3 - 2 * x);

/** Positive modulo. */
export const mod = (n: number, m: number): number => ((n % m) + m) % m;

/** `v` wrapped into [-L/2, L/2). */
export const wrapCentered = (v: number, L: number): number => mod(v + L / 2, L) - L / 2;

/** Frame-rate independent exponential smoothing factor. */
export const damp = (k: number, dt: number): number => 1 - Math.exp(-k * dt);

/**
 * Continuous step from -1/2 to 1/2 across |r| < 1. It pushes the open cover's
 * neighbours apart by half its extra width on each side, with no jumps.
 */
export const bump = (r: number): number =>
  Math.abs(r) < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) * 0.5;

export const easeOutCubic = (p: number): number => 1 - (1 - p) ** 3;
