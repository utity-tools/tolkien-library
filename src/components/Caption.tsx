import { useRef } from 'react';
import { subtitleLine, type Work } from '../data/works';
import { useMaskSwap } from '../hooks/useMaskSwap';

interface LineProps {
  readonly text: string;
  readonly dir: 1 | -1;
  readonly className: string;
}

const Line = ({ text, dir, className }: LineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useMaskSwap(ref, text, dir);
  return <div ref={ref} className={`mask w-[min(92vw,760px)] text-center ${className}`} />;
};

interface Props {
  readonly work: Work;
  readonly dir: 1 | -1;
}

export const Caption = ({ work, dir }: Props) => (
  <div
    aria-live="polite"
    className="pointer-events-none fixed top-[calc(50%_+_var(--H)/2_+_30px)] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-[9px]"
  >
    <Line text={work.title} dir={dir} className="font-serif text-[31px] leading-[1.12] tracking-[-.01em] max-md:text-[24px]" />
    <Line text={subtitleLine(work)} dir={dir} className="lbl font-medium text-cobalt" />
    <Line text={String(work.year)} dir={dir} className="text-[11px] leading-none font-medium tracking-[.08em]" />
  </div>
);
