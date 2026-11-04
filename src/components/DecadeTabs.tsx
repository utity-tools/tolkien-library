import { DECADES } from '../data/works';
import { Segmented, type SegmentItem } from './Segmented';

export const ALL = 'all';
type Key = number | typeof ALL;

const ITEMS: readonly SegmentItem<Key>[] = [
  { key: ALL, label: 'All / Todas' },
  ...DECADES.map((d) => ({
    key: d,
    ariaLabel: `${d}s`,
    label: (
      <>
        <span className="max-md:hidden">{String(d).slice(0, 2)}</span>
        <span className="md:hidden">’</span>
        {String(d).slice(2)}
        <span className="lowercase">s</span>
      </>
    ),
  })),
];

interface Props {
  readonly decade: number;
  readonly onSelect: (key: Key) => void;
}

/** Floats above the shelf; the active decade always follows the active work ("All" is never lit). */
export const DecadeTabs = ({ decade, onSelect }: Props) => (
  <Segmented
    ariaLabel="Decades"
    items={ITEMS}
    active={decade}
    onSelect={onSelect}
    className="fixed top-[calc(50%_-_var(--H)/2_-_86px)] left-1/2 z-20 -translate-x-1/2 max-md:top-[calc(50%_-_var(--H)/2_-_70px)]"
  />
);
