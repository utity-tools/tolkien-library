import { forwardRef, memo, useCallback, type Ref } from 'react';
import { artFor, cropStyle } from '../art';
import { WORKS } from '../data/works';
import type { ShelfEngine } from '../engine/ShelfEngine';
import type { Format } from '../lib/formats';

interface TapeProps {
  readonly v: number;
  readonly index: number;
  readonly format: Format;
  readonly engine: ShelfEngine;
}

const Tape = memo(({ v, index, format, engine }: TapeProps) => {
  const work = WORKS[index];
  const register = useCallback(
    (root: HTMLDivElement | null) => {
      const [spine, cover] = root ? (Array.from(root.children) as HTMLElement[]) : [];
      engine.registerTape(v, root && spine && cover ? { root, spine, cover } : null);
    },
    [engine, v],
  );
  if (!work) return null;
  return (
    <div ref={register} className="tape" data-v={v} role="presentation">
      <div className="face face-spine" style={cropStyle(artFor(work, index, format, 'spine'))} />
      <div className="face face-cover" style={cropStyle(artFor(work, index, format, 'cover'))} />
    </div>
  );
});
Tape.displayName = 'Tape';

interface ShelfProps {
  readonly engine: ShelfEngine;
  readonly format: Format;
}

/** The 3D stage. Rendered once per format; the engine moves every tape directly. */
export const Shelf = memo(
  forwardRef<HTMLElement, ShelfProps & { readonly stageRef: Ref<HTMLDivElement> }>(
    ({ engine, format, stageRef }, ref) => (
      <section
        ref={ref}
        aria-label="Bookshelf of Tolkien's works"
        className="fixed inset-x-0 top-[calc(50%_-_var(--H)/2_-_40px)] z-10 h-[calc(var(--H)_+_80px)] touch-pan-y [perspective-origin:50%_50%] [perspective:2200px]"
      >
        <div ref={stageRef} className="stage">
          {Array.from({ length: engine.loop }, (_, v) => (
            <Tape key={v} v={v} index={v % engine.count} format={format} engine={engine} />
          ))}
        </div>
      </section>
    ),
  ),
);
Shelf.displayName = 'Shelf';
