import { FORMATS, dimsFor, lerpDims, type Dims, type Format } from '../lib/formats';
import { bump, clamp, damp, mod, smoothstep, wrapCentered } from '../lib/math';
import { prefersReducedMotion } from '../lib/motion';

export interface TapeEls {
  readonly root: HTMLElement;
  readonly spine: HTMLElement;
  readonly cover: HTMLElement;
}

export interface EngineEls {
  readonly section: HTMLElement;
  readonly stage: HTMLElement;
  readonly probe: HTMLElement;
  readonly play: HTMLElement;
  readonly cursor: HTMLElement | null;
}

export interface EngineEvents {
  onActive(index: number, dir: 1 | -1): void;
  onOpenRequest(): void;
  onCloseRequest(): void;
}

type CursorState = '' | 'spine' | 'btn' | 'open';

const K_SPRING = 5.2;
const K_DRAG = 18;
const K_LIFT = 12;
const K_TILT = 7;
const K_CURSOR = 16;
const K_FORMAT = 6;
const DRAG_THRESHOLD = 5;
const WHEEL_SNAP_MS = 160;
const ROT_Z = -4.5;
const TILT_Y_COVER = 9;
const TILT_X_COVER = 6;
const TILT_Y_IDLE = 5;
/** Minimum number of tapes in the wrap loop, so wrapping always happens off-screen. */
const MIN_LOOP = 48;

/**
 * Imperative motion engine for the shelf: one rAF loop drives every tape,
 * the play ring and the custom cursor. React only renders the static DOM.
 */
export class ShelfEngine {
  readonly count: number;
  readonly copies: number;
  /** Loop length in tapes (count x copies). */
  readonly loop: number;

  private s: number;
  private T: number;
  private active: number;
  private hover = -1;
  private lifts: Float32Array;

  private mx = innerWidth / 2;
  private my = innerHeight / 2;
  private cx = this.mx;
  private cy = this.my;
  private tiltX = 0;
  private tiltY = 0;
  private onCover = false;
  private overButton = false;
  private isOpen = false;
  private cursorState: CursorState = '';

  private format: Format = 'vhs';
  private formatT = 0;
  private dimsByFormat: Readonly<Record<Format, Dims>>;
  private dims: Dims;
  private vw = innerWidth;
  private vh = innerHeight;

  private drag: { x: number; T0: number; id: number; moved: boolean } | null = null;
  /** Tape under the pointer at pointerdown; clicked on pointerup if no drag happened. */
  private pendingTape = -1;
  private wheelTimer = 0;
  private raf = 0;
  private last = 0;

  private els: EngineEls | null = null;
  private tapes: (TapeEls | undefined)[] = [];
  private hidden: boolean[] = [];

  constructor(
    count: number,
    initial: number,
    private readonly events: EngineEvents,
  ) {
    this.count = count;
    this.copies = Math.max(1, Math.ceil(MIN_LOOP / count));
    this.loop = count * this.copies;
    this.s = this.T = initial + count * Math.floor(this.copies / 2);
    this.active = initial;
    this.lifts = new Float32Array(this.loop);
    this.dimsByFormat = { vhs: dimsFor(0, FORMATS.vhs), book: dimsFor(0, FORMATS.book) };
    this.dims = this.dimsByFormat.vhs;
  }

  // ───────────────────────── public API ─────────────────────────

  registerTape(v: number, els: TapeEls | null): void {
    this.tapes[v] = els ?? undefined;
  }

  attach(els: EngineEls): () => void {
    this.els = els;
    this.measure();
    const { section } = els;
    const opts = { passive: false } as const;

    const listeners: [EventTarget, string, EventListener, AddEventListenerOptions?][] = [
      [window, 'resize', this.measure],
      [window, 'pointermove', this.onPointerMove as EventListener],
      [window, 'pointerover', this.onPointerOver as EventListener],
      [window, 'wheel', this.onWheel as EventListener, opts],
      [window, 'keydown', this.onKey as EventListener],
      [section, 'pointerdown', this.onPointerDown as EventListener],
      [window, 'pointerup', this.onPointerUp as EventListener],
      [window, 'pointercancel', this.onPointerUp as EventListener],
    ];
    for (const [t, type, fn, o] of listeners) t.addEventListener(type, fn, o);

    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);

    return () => {
      cancelAnimationFrame(this.raf);
      clearTimeout(this.wheelTimer);
      for (const [t, type, fn, o] of listeners) t.removeEventListener(type, fn, o);
      this.els = null;
    };
  }

  /** Work currently centred (the one the caption shows). */
  get activeIndex(): number {
    return this.active;
  }

  /** Move one tape left (-1) or right (+1). */
  step(dir: 1 | -1): void {
    this.T = Math.round(this.T) + dir;
  }

  /** Glide to a work by the shortest way round the loop. */
  goTo(index: number): void {
    const base = Math.round(this.T);
    this.T = base + wrapCentered(index - mod(base, this.count), this.count);
  }

  setFormat(f: Format): void {
    this.format = f;
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
    if (open) this.T = Math.round(this.T);
  }

  /** Projected screen rect of the open cover (the sheet grows out of it). */
  activeCoverRect(): DOMRect | null {
    let best: TapeEls | undefined;
    let bestR = Infinity;
    this.tapes.forEach((t, v) => {
      const r = Math.abs(wrapCentered(v - this.s, this.loop));
      if (t && r < bestR) {
        bestR = r;
        best = t;
      }
    });
    return best?.cover.getBoundingClientRect() ?? null;
  }

  // ───────────────────────── input ─────────────────────────

  private measure = (): void => {
    if (!this.els) return;
    this.vw = innerWidth;
    this.vh = innerHeight;
    const H = this.els.probe.getBoundingClientRect().height;
    this.dimsByFormat = { vhs: dimsFor(H, FORMATS.vhs), book: dimsFor(H, FORMATS.book) };
  };

  private tapeIndexOf(target: EventTarget | null): number {
    const el = target instanceof Element ? target.closest<HTMLElement>('[data-v]') : null;
    return el ? Number(el.dataset.v) : -1;
  }

  private onPointerOver = (e: PointerEvent): void => {
    this.hover = this.tapeIndexOf(e.target);
    const t = e.target instanceof Element ? e.target : null;
    this.overButton = !!t?.closest('button, a') && this.hover < 0;
  };

  private onPointerMove = (e: PointerEvent): void => {
    this.mx = e.clientX;
    this.my = e.clientY;
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      this.els?.section.setPointerCapture(e.pointerId);
    }
    if (d.moved) this.T = d.T0 - dx / (this.dims.ws + this.dims.gap);
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (this.isOpen || e.button !== 0) return;
    this.drag = { x: e.clientX, T0: this.T, id: e.pointerId, moved: false };
    this.pendingTape = this.tapeIndexOf(e.target);
  };

  private onPointerUp = (e: PointerEvent): void => {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.drag = null;
    if (d.moved) {
      this.T = Math.round(this.T);
      return;
    }
    if (e.type === 'pointerup' && this.pendingTape >= 0) this.clickTape(this.pendingTape);
  };

  private clickTape(v: number): void {
    const r = wrapCentered(v - this.s, this.loop);
    if (Math.abs(r) < 0.5) this.events.onOpenRequest();
    else this.T = Math.round(this.T + r);
  }

  private onWheel = (e: WheelEvent): void => {
    if (this.isOpen) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    this.T += (delta / (this.dims.ws + this.dims.gap)) * 0.5;
    clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => {
      this.T = Math.round(this.T);
    }, WHEEL_SNAP_MS);
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.isOpen) {
      this.events.onCloseRequest();
      return;
    }
    if (this.isOpen) return;
    if (e.key === 'ArrowLeft') this.step(-1);
    else if (e.key === 'ArrowRight') this.step(1);
    else if (e.key === 'Enter' && (document.activeElement === document.body || document.activeElement === null)) {
      // Focus moves to the Close button on open; without this the same Enter would press it.
      e.preventDefault();
      this.events.onOpenRequest();
    }
  };

  // ───────────────────────── frame ─────────────────────────

  private frame = (now: number): void => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const reduced = prefersReducedMotion();
    const instant = (k: number): number => (reduced ? 1 : damp(k, dt));

    this.updateFormat(instant(K_FORMAT));
    this.updateScroll(instant(this.drag?.moved ? K_DRAG : K_SPRING));
    this.updateTilt(instant(K_TILT));
    this.renderTapes(instant(K_LIFT));
    this.renderPlay();
    this.renderCursor(damp(K_CURSOR, dt));
  };

  private updateFormat(a: number): void {
    const target = this.format === 'book' ? 1 : 0;
    const prev = this.formatT;
    this.formatT += (target - this.formatT) * a;
    if (Math.abs(target - this.formatT) < 1e-3) this.formatT = target;
    this.dims = lerpDims(this.dimsByFormat.vhs, this.dimsByFormat.book, smoothstep(this.formatT));
    const stage = this.els?.stage;
    if (stage && (prev !== this.formatT || stage.dataset.h !== String(this.dims.H))) {
      stage.dataset.h = String(this.dims.H);
      stage.style.setProperty('--ws', `${this.dims.ws}px`);
      stage.style.setProperty('--d', `${this.dims.d}px`);
    }
  }

  private updateScroll(a: number): void {
    this.s += (this.T - this.s) * a;
    if (Math.abs(this.T - this.s) < 1e-4) this.s = this.T;

    const span = this.loop * 4;
    if (Math.abs(this.s) > span) {
      const shift = Math.round(this.s / this.loop) * this.loop;
      this.s -= shift;
      this.T -= shift;
      if (this.drag) this.drag.T0 -= shift;
    }

    const active = mod(Math.round(this.s), this.count);
    if (active !== this.active) {
      this.active = active;
      this.events.onActive(active, this.T - this.s < 0 ? -1 : 1);
    }
  }

  private updateTilt(a: number): void {
    const { d, H } = this.dims;
    const half = this.vw / 2;
    const shelfY = this.vh / 2;
    this.onCover =
      !this.isOpen &&
      Math.abs(this.mx - half) < 0.55 * d &&
      Math.abs(this.my - shelfY) < 0.55 * H &&
      Math.abs(this.T - this.s) < 0.3;

    const ty = this.onCover ? clamp((this.mx - half) / (0.55 * d), -1, 1) * TILT_Y_COVER : ((this.mx - half) / this.vw) * TILT_Y_IDLE;
    const tx = this.onCover ? clamp(-(this.my - shelfY) / (H / 2), -1, 1) * TILT_X_COVER : 0;
    this.tiltY += (ty - this.tiltY) * a;
    this.tiltX += (tx - this.tiltX) * a;
  }

  private renderTapes(a: number): void {
    const { ws, d, gap, H } = this.dims;
    const limit = this.vw / 2 + 1.5 * d;
    const step = ws + gap;
    const push = d - ws + 1.6 * gap;

    for (let v = 0; v < this.loop; v++) {
      const t = this.tapes[v];
      if (!t) continue;
      const r = wrapCentered(v - this.s, this.loop);
      const x = r * step + push * bump(r);

      const off = Math.abs(x) > limit;
      if (off !== this.hidden[v]) {
        this.hidden[v] = off;
        t.root.style.visibility = off ? 'hidden' : '';
      }
      if (off) {
        this.lifts[v] = 0;
        continue;
      }

      const liftTarget = v === this.hover && Math.abs(r) > 0.5 && !this.isOpen ? 1 : 0;
      const lift = (this.lifts[v] ?? 0) + (liftTarget - (this.lifts[v] ?? 0)) * a;
      this.lifts[v] = lift;

      const o = smoothstep(Math.max(0, 1 - Math.abs(r)));
      const y = -o * 0.025 * H - lift * 0.045 * H;
      const z = o * 0.2 * H;
      t.root.style.transform =
        `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) ` +
        `rotateZ(${(ROT_Z * o).toFixed(3)}deg) rotateX(${(this.tiltX * o).toFixed(3)}deg) rotateY(${(-90 * o + this.tiltY * o).toFixed(3)}deg)`;
      t.root.style.zIndex = String(Math.round(100 - Math.abs(r) * 4));
      t.spine.style.setProperty('--shade', (o * 0.55).toFixed(3));
      t.cover.style.setProperty('--shade', ((1 - o) * 0.5).toFixed(3));
    }
  }

  private renderPlay(): void {
    const play = this.els?.play;
    if (!play) return;
    const { d, H } = this.dims;
    const scale = this.isOpen ? 0 : smoothstep(Math.max(0, 1 - Math.abs(this.T - this.s) * 3));
    const left = this.vw / 2 - 0.5 * d - 6;
    const top = this.vh / 2 + 0.36 * H;
    play.style.transform = `translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
    play.style.visibility = scale < 0.01 ? 'hidden' : '';
  }

  private renderCursor(a: number): void {
    const cursor = this.els?.cursor;
    if (!cursor) return;
    this.cx += (this.mx - this.cx) * a;
    this.cy += (this.my - this.cy) * a;
    cursor.style.transform = `translate3d(${this.cx.toFixed(1)}px,${this.cy.toFixed(1)}px,0)`;

    let state: CursorState = '';
    if (this.isOpen) state = this.overButton ? 'btn' : '';
    else if (this.onCover) state = 'open';
    else if (this.hover >= 0 && Math.abs(wrapCentered(this.hover - this.s, this.loop)) > 0.5) state = 'spine';
    else if (this.overButton) state = 'btn';
    if (state !== this.cursorState) {
      this.cursorState = state;
      cursor.dataset.state = state;
    }
  }
}
