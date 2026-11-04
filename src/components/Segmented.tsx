import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export interface SegmentItem<K extends string | number> {
  readonly key: K;
  readonly label: ReactNode;
  readonly ariaLabel?: string;
}

interface Props<K extends string | number> {
  readonly items: readonly SegmentItem<K>[];
  /** Highlighted item; `null` highlights nothing. */
  readonly active: K | null;
  readonly onSelect: (key: K) => void;
  readonly ariaLabel: string;
  readonly className?: string;
}

/**
 * Row of boxed labels sharing one border, with a cobalt block that slides and
 * stretches to the active item. Used for the decade tabs and the format switch.
 */
export const Segmented = <K extends string | number>({ items, active, onSelect, ariaLabel, className = '' }: Props<K>) => {
  const nav = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<K, HTMLButtonElement>());
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = active === null ? undefined : buttons.current.get(active);
      setBar(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
      const n = nav.current;
      if (el && n && n.scrollWidth > n.clientWidth) {
        n.scrollTo({ left: el.offsetLeft - n.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (row.current) ro.observe(row.current);
    return () => ro.disconnect();
  }, [active]);

  useLayoutEffect(() => {
    if (bar && !ready) requestAnimationFrame(() => setReady(true));
  }, [bar, ready]);

  return (
    <nav
      ref={nav}
      aria-label={ariaLabel}
      className={`max-w-[calc(100vw_-_32px)] overflow-x-auto [scrollbar-width:none] ${className}`}
    >
      <div ref={row} className="relative flex w-max pl-px">
        <span
          aria-hidden
          className={`absolute top-0 left-0 h-full bg-cobalt ${ready ? 'transition-[width,transform] duration-600 ease-paper' : ''}`}
          style={{ width: bar?.w ?? 0, transform: `translateX(${bar?.x ?? 0}px)`, visibility: bar ? 'visible' : 'hidden' }}
        />
        {items.map((it) => (
          <button
            key={it.key}
            ref={(el) => {
              if (el) buttons.current.set(it.key, el);
              else buttons.current.delete(it.key);
            }}
            type="button"
            aria-label={it.ariaLabel}
            aria-current={it.key === active ? 'true' : undefined}
            onClick={() => onSelect(it.key)}
            className={`lbl relative -ml-px flex h-[23px] items-center border border-rule bg-transparent px-[11px] transition-colors duration-450 max-md:px-[7px] ${
              it.key === active ? 'text-white' : 'text-ink'
            }`}
          >
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
