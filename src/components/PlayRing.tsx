import { forwardRef } from 'react';

/** Pops in at the open cover's lower-left corner once the shelf settles; the engine positions it. */
export const PlayRing = forwardRef<HTMLButtonElement, { readonly onOpen: () => void }>(({ onOpen }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Open work"
    onClick={onOpen}
    className="fixed top-0 left-0 z-30 grid size-[42px] place-items-center rounded-full border border-cobalt bg-[rgba(237,235,230,.75)] text-cobalt will-change-transform"
  >
    <svg width="12" height="12" viewBox="0 0 12 12" className="translate-x-[2px]" aria-hidden>
      <path d="M1 0 L12 6 L1 12Z" fill="currentColor" />
    </svg>
  </button>
));
PlayRing.displayName = 'PlayRing';
