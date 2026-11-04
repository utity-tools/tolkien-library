interface Props {
  readonly onStep: (dir: 1 | -1) => void;
}

const SIDES = [
  { dir: -1, label: 'Previous work', side: 'left-5 max-md:left-1.5', d: 'M5 1 L1 5 L5 9 M1 5 H17' },
  { dir: 1, label: 'Next work', side: 'right-5 max-md:right-1.5', d: 'M13 1 L17 5 L13 9 M17 5 H1' },
] as const;

export const Arrows = ({ onStep }: Props) => (
  <>
    {SIDES.map(({ dir, label, side, d }) => (
      <button
        key={dir}
        type="button"
        aria-label={label}
        onClick={() => onStep(dir)}
        className={`fixed top-[calc(50%_+_var(--H)/2_+_40px)] z-20 grid size-11 place-items-center text-ink ${side}`}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
          <path d={d} />
        </svg>
      </button>
    ))}
  </>
);
