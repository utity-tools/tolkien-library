import { FIRST_YEAR, LAST_YEAR } from '../data/works';
import { FORMAT_ORDER, FORMATS, type Format } from '../lib/formats';
import { Logo } from './Logo';
import { Segmented } from './Segmented';

const FORMAT_ITEMS = FORMAT_ORDER.map((f) => ({
  key: f,
  label: (
    <>
      {FORMATS[f].label}
      <span className="max-md:hidden"> / {FORMATS[f].labelEs}</span>
    </>
  ),
}));

interface Props {
  readonly format: Format;
  readonly onFormat: (f: Format) => void;
}

export const TopBar = ({ format, onFormat }: Props) => (
  <header className="fixed inset-x-0 top-0 z-30 grid h-[84px] grid-cols-[1fr_auto_1fr] items-center px-8 max-md:h-16 max-md:px-4">
    <a href="#" className="lbl box justify-self-start text-ink no-underline">
      Back / Volver
    </a>
    <Logo />
    <div className="flex items-center gap-4 justify-self-end">
      <span className="lbl max-md:hidden">
        Works {FIRST_YEAR}–{LAST_YEAR}
      </span>
      <Segmented ariaLabel="Shelf format" items={FORMAT_ITEMS} active={format} onSelect={onFormat} />
    </div>
  </header>
);
