import { useLayoutEffect, useRef, type RefObject } from 'react';
import { EASE, prefersReducedMotion } from '../lib/motion';

const SWAP_MS = 650;
/** Travel distance: clears the mask including its accent padding. */
const OFF = 130;

const span = (text: string): HTMLSpanElement => {
  const el = document.createElement('span');
  el.textContent = text;
  return el;
};

/**
 * Slides `text` through an overflow mask whenever it changes. The new line enters
 * from `dir * 105%` while every line still on screen leaves the opposite way, so
 * flipping quickly shows each intermediate value in turn.
 */
export const useMaskSwap = (ref: RefObject<HTMLElement | null>, text: string, dir: 1 | -1): void => {
  const shown = useRef<string | null>(null);

  useLayoutEffect(() => {
    const mask = ref.current;
    if (!mask) return;
    if (shown.current === text) return;
    const first = shown.current === null;
    shown.current = text;
    if (first || prefersReducedMotion()) {
      mask.replaceChildren(span(text));
      return;
    }

    const timing: KeyframeAnimationOptions = { duration: SWAP_MS, easing: EASE, fill: 'both' };
    for (const old of Array.from(mask.children) as HTMLElement[]) {
      if (old.dataset.leaving) continue;
      old.dataset.leaving = '1';
      const from = getComputedStyle(old).transform;
      old.getAnimations().forEach((a) => a.cancel());
      old
        .animate([{ transform: from === 'none' ? 'translateY(0)' : from }, { transform: `translateY(${-dir * OFF}%)` }], timing)
        .finished.then(() => old.remove(), () => old.remove());
    }
    const next = span(text);
    mask.append(next);
    next.animate([{ transform: `translateY(${dir * OFF}%)` }, { transform: 'translateY(0)' }], timing);
  }, [ref, text, dir]);
};
