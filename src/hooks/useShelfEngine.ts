import { useState } from 'react';
import { ShelfEngine, type EngineEvents } from '../engine/ShelfEngine';
import { useLatest } from './useLatest';

/** One engine per mount; events always call the latest handlers without re-creating it. */
export const useShelfEngine = (count: number, initial: number, events: EngineEvents): ShelfEngine => {
  const latest = useLatest(events);
  const [engine] = useState(
    () =>
      new ShelfEngine(count, initial, {
        onActive: (i, dir) => latest.current.onActive(i, dir),
        onOpenRequest: () => latest.current.onOpenRequest(),
        onCloseRequest: () => latest.current.onCloseRequest(),
      }),
  );
  return engine;
};
