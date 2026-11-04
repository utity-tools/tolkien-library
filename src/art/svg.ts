/** Small, dependency-free helpers for building SVG strings. */

export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const svgDoc = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none">${body}</svg>`;

export const toDataUrl = (svg: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Fonts available inside an SVG image (web fonts are not, so these are system stacks). */
export const SERIF = "Georgia,'Times New Roman',Times,serif";
export const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/** Deterministic PRNG (mulberry32) so every cover is stable between renders. */
export const rng = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

/** Rough advance widths (em) for capitals in the fallback fonts. */
const CAP_EM = { serif: 0.68, sans: 0.66 } as const;

interface TextOpts {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly fill: string;
  readonly font?: 'serif' | 'sans';
  readonly weight?: number;
  readonly spacing?: number;
  readonly anchor?: 'start' | 'middle' | 'end';
  /** Squeeze the text to this width if it would be wider (a condensed face). */
  readonly maxWidth?: number;
  readonly transform?: string;
  readonly opacity?: number;
  readonly extra?: string;
}

/** A single line of text that is condensed (never stretched) to fit `maxWidth`. */
export const text = (content: string, o: TextOpts): string => {
  const font = o.font ?? 'serif';
  const spacing = o.spacing ?? 0;
  const natural = content.length * o.size * (CAP_EM[font] + spacing);
  const fit =
    o.maxWidth !== undefined && natural > o.maxWidth
      ? ` textLength="${o.maxWidth.toFixed(1)}" lengthAdjust="spacingAndGlyphs"`
      : '';
  return `<text x="${o.x}" y="${o.y}" font-family="${font === 'serif' ? SERIF : SANS}" font-size="${o.size}" font-weight="${o.weight ?? 400}" letter-spacing="${spacing}em" fill="${o.fill}" text-anchor="${o.anchor ?? 'middle'}"${fit}${o.transform ? ` transform="${o.transform}"` : ''}${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}${o.extra ?? ''}>${esc(content)}</text>`;
};

/** Greedy word wrap into at most `maxLines` lines of roughly `perLine` characters. */
export const wrap = (title: string, perLine: number, maxLines: number): string[] => {
  const lines: string[] = [];
  for (const word of title.split(/\s+/)) {
    const last = lines.at(-1);
    if (last !== undefined && (last + ' ' + word).length <= perLine) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  while (lines.length > maxLines) {
    const tail = lines.pop() ?? '';
    lines[lines.length - 1] += ` ${tail}`;
  }
  return lines;
};

/** Fractal-noise texture filter, multiplied over whatever uses it. */
export const grainFilter = (id: string, freq: number, alpha: number, seed: number): string =>
  `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .08  0 0 0 0 .06  0 0 0 ${alpha} 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;

/**
 * Worn-edge filter: white speckles where the print has rubbed off cardboard or cloth.
 * The noise is thresholded so only the strongest peaks show.
 */
export const scuffFilter = (id: string, seed: number, color = '#f3eee2'): string =>
  `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".09 .6" numOctaves="3" seed="${seed}" result="n"/><feComponentTransfer in="n" result="m"><feFuncA type="discrete" tableValues="0 0 0 0 0 .5 .85 1"/></feComponentTransfer><feFlood flood-color="${color}" result="f"/><feComposite in="f" in2="m" operator="in" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter>`;

/** Halftone dot pattern, the hallmark of cheap screen printing. */
export const halftone = (id: string, color: string, step = 7, r = 1.6): string =>
  `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="${step / 2}" cy="${step / 2}" r="${r}" fill="${color}"/></pattern>`;
