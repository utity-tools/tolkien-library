import { CROP, SHEET } from '../data/sheets';
import type { Work } from '../data/works';
import { FORMATS, type Face, type Format } from '../lib/formats';
import { bookCover, bookSpine } from './book';
import { toDataUrl } from './svg';
import { vhsCover, vhsSpine } from './vhs';

/** An image plus the box inside it that is the face. Generated art is its own full box. */
export interface ArtImage {
  readonly url: string;
  readonly sheetW: number;
  readonly sheetH: number;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

const GENERATORS: Readonly<Record<Format, Readonly<Record<Face, (w: Work, i: number) => string>>>> = {
  vhs: { spine: vhsSpine, cover: vhsCover },
  book: { spine: bookSpine, cover: bookCover },
};

const cache = new Map<string, ArtImage>();

const fromSheet = (key: `${Format}-${Face}-${string}`): ArtImage | undefined => {
  const crop = CROP[key];
  const sheet = crop && SHEET[crop[0]];
  if (!crop || !sheet) return undefined;
  const [, x, y, w, h] = crop;
  return { url: sheet[0], sheetW: sheet[1], sheetH: sheet[2], x, y, w, h };
};

/** Art for one face of one work, memoised: sheet crop if mapped, otherwise generated SVG. */
export const artFor = (work: Work, index: number, format: Format, face: Face): ArtImage => {
  const key = `${format}-${face}-${work.id}` as const;
  const hit = cache.get(key);
  if (hit) return hit;
  const [w, h] = FORMATS[format][face];
  const art = fromSheet(key) ?? {
    url: toDataUrl(GENERATORS[format][face](work, index)),
    sheetW: w,
    sheetH: h,
    x: 0,
    y: 0,
    w,
    h,
  };
  cache.set(key, art);
  return art;
};

/** CSS that crops `art`'s box out of its sheet and stretches it over the whole face. */
export const cropStyle = (a: ArtImage): { backgroundImage: string; backgroundSize: string; backgroundPosition: string } => {
  const pos = (o: number, size: number, total: number): string =>
    total === size ? '0%' : `${((o / (total - size)) * 100).toFixed(4)}%`;
  return {
    backgroundImage: `url("${a.url}")`,
    backgroundSize: `${((a.sheetW / a.w) * 100).toFixed(4)}% ${((a.sheetH / a.h) * 100).toFixed(4)}%`,
    backgroundPosition: `${pos(a.x, a.w, a.sheetW)} ${pos(a.y, a.h, a.sheetH)}`,
  };
};

/** Attributes for an SVG <image> that shows only `art`'s box, stretched to vw x vh. */
export const cropSvgImage = (a: ArtImage, vw: number, vh: number) => ({
  href: a.url,
  x: (-a.x * vw) / a.w,
  y: (-a.y * vh) / a.h,
  width: (a.sheetW * vw) / a.w,
  height: (a.sheetH * vh) / a.h,
});

/** Warm the browser cache for every real sheet so the first turn never shows an empty face. */
export const preloadSheets = (): void => {
  for (const [url] of Object.values(SHEET)) {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  }
};
