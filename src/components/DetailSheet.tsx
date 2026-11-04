import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { artFor } from '../art';
import { creditLine, metaLine, subtitleLine, WORKS, type Work } from '../data/works';
import { FORMATS, type Format } from '../lib/formats';
import { delay, EASE, ms, SHEET_EASE } from '../lib/motion';
import { InkPoster, POSTER_H, type InkPosterHandle } from './InkPoster';
import { Logo } from './Logo';

const TILT = 'rotate(-4.5deg)';
const OPEN_MS = 1050;
const CLOSE_MS = 850;
const RISE_MS = 900;
const RISE_DELAY = 620;
const RISE_STAGGER = 75;
const INK_DELAY = 520;
/** Below the mask, including its accent padding. */
const HIDDEN = '130%';

export interface DetailHandle {
  open(index: number, format: Format, from: DOMRect | null): void;
  close(to: DOMRect | null): Promise<void>;
}

/** clip-path inset that matches `r` on screen (full screen when null). */
const insetOf = (r: DOMRect | null): string =>
  r
    ? `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 3px)`
    : 'inset(50% 50% 50% 50% round 3px)';
const FULL = 'inset(0px 0px 0px 0px round 0px)';

/** Masked line whose child rises into place on open. */
const Rise = ({ className = '', children }: { readonly className?: string; readonly children: ReactNode }) => (
  <div className="mask">
    <div data-rise className={className}>
      {children}
    </div>
  </div>
);

interface Props {
  readonly onClose: () => void;
}

export const DetailSheet = forwardRef<DetailHandle, Props>(({ onClose }, ref) => {
  const sheet = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const poster = useRef<InkPosterHandle>(null);
  const [view, setView] = useState<{ work: Work; index: number; format: Format } | null>(null);

  useImperativeHandle(ref, () => ({
    open(index, format, from) {
      const el = sheet.current;
      const work = WORKS[index];
      if (!el || !work) return;
      flushSync(() => setView({ work, index, format }));
      poster.current?.reset();

      el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      el.style.transformOrigin = from ? `${from.left + from.width / 2}px ${from.top + from.height / 2}px` : '50% 50%';
      el.dataset.open = 'true';
      el.scrollTop = 0;
      el.animate(
        [
          { clipPath: insetOf(from), transform: TILT },
          { clipPath: FULL, transform: 'rotate(0deg)' },
        ],
        { duration: ms(OPEN_MS), easing: SHEET_EASE, fill: 'both' },
      );
      el.querySelectorAll<HTMLElement>('[data-rise]').forEach((line, i) =>
        line.animate([{ transform: `translateY(${HIDDEN})` }, { transform: 'translateY(0)' }], {
          duration: ms(RISE_MS),
          delay: delay(RISE_DELAY + i * RISE_STAGGER),
          easing: EASE,
          fill: 'both',
        }),
      );
      poster.current?.bleed(delay(INK_DELAY));
      closeBtn.current?.focus({ preventScroll: true });
    },
    async close(to) {
      const el = sheet.current;
      if (!el) return;
      const anim = el.animate(
        [
          { clipPath: FULL, transform: 'rotate(0deg)' },
          { clipPath: insetOf(to), transform: TILT },
        ],
        { duration: ms(CLOSE_MS), easing: SHEET_EASE, fill: 'both' },
      );
      await anim.finished.catch(() => undefined);
      el.dataset.open = 'false';
      el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      poster.current?.reset();
      (document.activeElement as HTMLElement | null)?.blur();
    },
  }));

  const spec = view ? FORMATS[view.format] : FORMATS.vhs;
  const posterW = (POSTER_H * spec.cover[0]) / spec.cover[1];
  const art = view ? artFor(view.work, view.index, view.format, 'cover') : null;

  return (
    <div
      ref={sheet}
      role="dialog"
      aria-modal="true"
      aria-label={view?.work.title ?? 'Work'}
      data-open="false"
      className="detail fixed inset-0 z-60 grid grid-cols-2 gap-[4vw] overflow-hidden bg-sheet px-[6vw] pt-[110px] pb-14 pl-[7vw] max-md:grid-cols-1 max-md:content-start max-md:gap-6 max-md:overflow-y-auto max-md:px-[22px] max-md:pt-[84px] max-md:pb-10"
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        className="lbl box absolute top-[31px] left-8 z-10 text-ink outline-none max-md:top-[21px] max-md:left-4"
      >
        Close / Cerrar
      </button>
      <div className="absolute inset-x-0 top-0 grid h-[84px] place-items-center max-md:h-16">
        <Logo />
      </div>

      <div className="flex max-w-[520px] flex-col justify-center gap-[18px] self-center max-md:order-2">
        {view && (
          <>
            <Rise className="lbl font-medium text-cobalt">{subtitleLine(view.work)}</Rise>
            <Rise className="font-serif text-[clamp(44px,5.4vw,84px)] leading-none tracking-[-.025em] text-balance max-md:text-[42px]">
              {view.work.title}
            </Rise>
            <Rise className="lbl text-muted">{metaLine(view.work)}</Rise>
            <Rise className="max-w-[42ch] font-serif text-[17px] leading-[1.5] max-md:text-[16px]">{view.work.synopsis}</Rise>
            <Rise className="font-serif text-[15px] text-muted italic">{creditLine(view.work)}</Rise>
            <Rise className="pt-2.5">
              <button
                type="button"
                className="lbl box h-11 border-cobalt px-5 text-cobalt"
              >
                {spec.cta} / {spec.ctaEs}
              </button>
            </Rise>
          </>
        )}
      </div>

      <div className="grid place-items-center max-md:order-1 md:min-h-0">
        <div className="h-[min(100%,78vh)] max-md:h-[46svh]" style={{ aspectRatio: `${posterW} / ${POSTER_H}` }}>
          <InkPoster ref={poster} art={art} width={posterW} />
        </div>
      </div>
    </div>
  );
});
DetailSheet.displayName = 'DetailSheet';
