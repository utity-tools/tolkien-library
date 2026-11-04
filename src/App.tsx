import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { preloadSheets } from './art';
import { Arrows } from './components/Arrows';
import { Caption } from './components/Caption';
import { Cursor } from './components/Cursor';
import { ALL, DecadeTabs } from './components/DecadeTabs';
import { DetailSheet, type DetailHandle } from './components/DetailSheet';
import { Footer } from './components/Footer';
import { PlayRing } from './components/PlayRing';
import { Shelf } from './components/Shelf';
import { TopBar } from './components/TopBar';
import { decadeOf, INITIAL_WORK_ID, WORKS } from './data/works';
import { useShelfEngine } from './hooks/useShelfEngine';
import type { Format } from './lib/formats';

const INITIAL = Math.max(0, WORKS.findIndex((w) => w.id === INITIAL_WORK_ID));
const FIRST_OF_DECADE = new Map<number, number>();
WORKS.forEach((w, i) => {
  if (!FIRST_OF_DECADE.has(decadeOf(w.year))) FIRST_OF_DECADE.set(decadeOf(w.year), i);
});

export const App = () => {
  const [active, setActive] = useState(INITIAL);
  const [dir, setDir] = useState<1 | -1>(1);
  const [format, setFormat] = useState<Format>('vhs');

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const detail = useRef<DetailHandle>(null);
  const isOpen = useRef(false);

  const engine = useShelfEngine(WORKS.length, INITIAL, {
    onActive: (i, d) => {
      setActive(i);
      setDir(d);
    },
    onOpenRequest: () => openDetail(),
    onCloseRequest: () => closeDetail(),
  });

  const openDetail = useCallback(() => {
    if (isOpen.current) return;
    isOpen.current = true;
    engine.setOpen(true);
    detail.current?.open(engine.activeIndex, format, engine.activeCoverRect());
  }, [engine, format]);

  const closeDetail = useCallback(() => {
    if (!isOpen.current) return;
    void detail.current?.close(engine.activeCoverRect()).then(() => {
      isOpen.current = false;
      engine.setOpen(false);
    });
  }, [engine]);

  useLayoutEffect(() => {
    const [s, st, p, pl] = [section.current, stage.current, probe.current, play.current];
    if (!s || !st || !p || !pl) return;
    return engine.attach({ section: s, stage: st, probe: p, play: pl, cursor: cursor.current });
  }, [engine]);

  useEffect(() => engine.setFormat(format), [engine, format]);
  useEffect(preloadSheets, []);

  const onDecade = useCallback(
    (key: number | typeof ALL) => engine.goTo(key === ALL ? 0 : (FIRST_OF_DECADE.get(key) ?? 0)),
    [engine],
  );
  const onStep = useCallback((d: 1 | -1) => engine.step(d), [engine]);

  const work = WORKS[active] ?? WORKS[0];
  if (!work) return null;

  return (
    <main className="h-full">
      <div ref={probe} aria-hidden className="pointer-events-none fixed top-0 -left-[9999px] h-[var(--H)] w-px" />
      <TopBar format={format} onFormat={setFormat} />
      <DecadeTabs decade={decadeOf(work.year)} onSelect={onDecade} />
      <Shelf ref={section} stageRef={stage} engine={engine} format={format} />
      <PlayRing ref={play} onOpen={openDetail} />
      <Caption work={work} dir={dir} />
      <Arrows onStep={onStep} />
      <Footer />
      <div className="grain" aria-hidden />
      <DetailSheet ref={detail} onClose={closeDetail} />
      <Cursor ref={cursor} />
    </main>
  );
};
