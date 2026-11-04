import type { Face, Format } from '../lib/formats';

/**
 * Generation sheets: `id -> [url, width, height]` in sheet pixels.
 * Drop real art here (e.g. a transparent WebP sheet of spines or covers) and
 * map crop boxes below. Any face without a crop falls back to generated SVG art.
 */
export const SHEET: Readonly<Record<string, readonly [url: string, w: number, h: number]>> = {};

export type CropKey = `${Format}-${Face}-${string}`;

/** `'<format>-<face>-<workId>' -> [sheetId, x, y, w, h]` */
export const CROP: Readonly<Partial<Record<CropKey, readonly [sheet: string, x: number, y: number, w: number, h: number]>>> = {};
