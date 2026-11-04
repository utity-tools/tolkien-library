export type Format = 'vhs' | 'book';
export type Face = 'spine' | 'cover';

export interface FormatSpec {
  readonly id: Format;
  readonly label: string;
  readonly labelEs: string;
  /** Artwork boxes in art units; widths relative to tape height drive the 3D box. */
  readonly spine: readonly [w: number, h: number];
  readonly cover: readonly [w: number, h: number];
  /** Gap between neighbouring spines as a fraction of tape height. */
  readonly gap: number;
  /** Call to action on the detail page. */
  readonly cta: string;
  readonly ctaEs: string;
}

export const FORMATS: Readonly<Record<Format, FormatSpec>> = {
  vhs: {
    id: 'vhs',
    label: 'VHS',
    labelEs: 'Cinta',
    spine: [142, 840],
    cover: [474, 900],
    gap: 0.03,
    cta: 'Watch the tape',
    ctaEs: 'Ver la cinta',
  },
  book: {
    id: 'book',
    label: 'Book',
    labelEs: 'Libro',
    spine: [104, 900],
    cover: [600, 900],
    gap: 0.008,
    cta: 'Read the book',
    ctaEs: 'Leer el libro',
  },
};

export const FORMAT_ORDER: readonly Format[] = ['vhs', 'book'];

export interface Dims {
  readonly H: number;
  /** Spine width (front face of the cuboid). */
  readonly ws: number;
  /** Cover width, which is also the box depth. */
  readonly d: number;
  readonly gap: number;
}

export const dimsFor = (H: number, f: FormatSpec): Dims => ({
  H,
  ws: (H * f.spine[0]) / f.spine[1],
  d: (H * f.cover[0]) / f.cover[1],
  gap: H * f.gap,
});

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const lerpDims = (a: Dims, b: Dims, t: number): Dims => ({
  H: lerp(a.H, b.H, t),
  ws: lerp(a.ws, b.ws, t),
  d: lerp(a.d, b.d, t),
  gap: lerp(a.gap, b.gap, t),
});
