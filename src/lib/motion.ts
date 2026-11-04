/** Shared easing curves (every transition and text slide uses EASE). */
export const EASE = 'cubic-bezier(.2,.8,.2,1)';
export const SHEET_EASE = 'cubic-bezier(.76,0,.18,1)';

const query = typeof window === 'undefined' ? undefined : window.matchMedia('(prefers-reduced-motion: reduce)');

/** Live check, so toggling the OS setting applies without a reload. */
export const prefersReducedMotion = (): boolean => query?.matches ?? false;

/** Duration / delay helper that collapses to 1ms under reduced motion. */
export const ms = (value: number): number => (prefersReducedMotion() ? 1 : value);
export const delay = (value: number): number => (prefersReducedMotion() ? 0 : value);
