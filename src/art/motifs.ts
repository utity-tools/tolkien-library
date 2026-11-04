import type { Swatch } from './palette';

/**
 * Original screen-print emblems, each drawn in a 200 x 200 box with two inks.
 * `dots` is the id of a halftone pattern in the host document.
 */
type Draw = (c: Swatch, dots: string) => string;

const sunDisc = (c: Swatch, cx = 100, cy = 92, r = 62): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.accent}"/>`;

const DRAW = {
  mountain: (c, d) =>
    `${sunDisc(c, 130, 70, 46)}<path d="M-6 200 L70 62 L104 118 L128 88 L206 200 Z" fill="${c.main}"/><path d="M70 62 L84 88 L76 84 L66 98 L60 86 Z M128 88 L138 104 L130 101 L122 110 Z" fill="${c.paper}"/><rect x="0" y="150" width="200" height="50" fill="url(#${d})"/><path d="M118 40 q10 -10 22 -4 q-8 2 -10 10 q8 -2 14 4 q-12 0 -26 -10z" fill="${c.main}"/>`,
  ring: (c, d) =>
    `<circle cx="100" cy="100" r="86" fill="url(#${d})"/><circle cx="100" cy="100" r="58" fill="none" stroke="${c.accent}" stroke-width="26"/><circle cx="100" cy="100" r="58" fill="none" stroke="${c.main}" stroke-width="3" stroke-dasharray="6 5 2 5"/><circle cx="100" cy="100" r="74" fill="none" stroke="${c.main}" stroke-width="2"/>`,
  towers: (c, d) =>
    `${sunDisc(c, 100, 84, 60)}<path d="M44 200 L50 64 L56 50 L62 64 L68 200Z" fill="${c.main}"/><path d="M128 200 L134 46 L126 46 L138 20 L150 46 L142 46 L148 200Z" fill="${c.main}"/><rect y="168" width="200" height="32" fill="url(#${d})"/>`,
  tower: (c, d) =>
    `${sunDisc(c, 100, 80, 58)}<path d="M82 200 L88 52 L80 30 L94 40 L100 18 L106 40 L120 30 L112 52 L118 200Z" fill="${c.main}"/><rect x="96" y="70" width="8" height="12" fill="${c.paper}"/><rect y="170" width="200" height="30" fill="url(#${d})"/>`,
  crown: (c, d) =>
    `<circle cx="100" cy="104" r="78" fill="url(#${d})"/><path d="M38 140 L44 66 L70 100 L100 52 L130 100 L156 66 L162 140Z" fill="${c.main}"/><rect x="38" y="140" width="124" height="18" fill="${c.accent}"/>${[44, 100, 156].map((x) => `<circle cx="${x}" cy="${x === 100 ? 46 : 60}" r="7" fill="${c.accent}"/>`).join('')}`,
  tree: (c, d) =>
    `${sunDisc(c, 100, 76, 66)}<path d="M94 200 L96 120 Q70 108 52 80 Q78 98 96 104 L98 60 L102 60 L104 104 Q124 96 148 78 Q132 108 104 120 L106 200Z" fill="${c.main}"/><circle cx="100" cy="70" r="40" fill="url(#${d})"/>`,
  leaf: (c, d) =>
    `<circle cx="100" cy="100" r="80" fill="url(#${d})"/><path d="M100 18 C162 58 162 140 100 182 C38 140 38 58 100 18Z" fill="${c.accent}"/><path d="M100 30 L100 186 M100 70 L132 52 M100 100 L140 80 M100 130 L136 112 M100 70 L68 52 M100 100 L60 80 M100 130 L64 112" stroke="${c.main}" stroke-width="4" fill="none"/>`,
  dragon: (c, d) =>
    `${sunDisc(c, 100, 100, 70)}<path d="M20 150 C60 110 80 170 116 128 C140 100 128 72 156 62 L178 54 L166 72 C150 80 156 108 132 140 C100 182 60 140 20 150Z" fill="${c.main}"/><path d="M112 118 L80 40 L120 76 L132 50 L138 102Z" fill="${c.main}"/><rect y="160" width="200" height="40" fill="url(#${d})"/>`,
  ship: (c, d) =>
    `${sunDisc(c, 100, 86, 64)}<path d="M98 30 L98 136 L54 136Z M104 44 L104 136 L146 136Z" fill="${c.paper}" stroke="${c.main}" stroke-width="3"/><path d="M36 140 L164 140 Q150 166 100 166 Q50 166 36 140Z" fill="${c.main}"/><path d="M164 140 Q178 120 170 104 Q186 112 180 132Z" fill="${c.main}"/><rect y="168" width="200" height="32" fill="url(#${d})"/>`,
  wave: (c, d) =>
    `${sunDisc(c, 100, 70, 52)}<path d="M92 120 L94 46 L100 30 L106 46 L108 120Z" fill="${c.main}"/>${[110, 134, 158].map((y, i) => `<path d="M0 ${y} Q25 ${y - 22} 50 ${y} T100 ${y} T150 ${y} T200 ${y} V200 H0Z" fill="${i === 1 ? `url(#${d})` : c.main}"/>`).join('')}`,
  star: (c, d) =>
    `<circle cx="100" cy="100" r="82" fill="url(#${d})"/><path d="M100 8 L114 86 L192 100 L114 114 L100 192 L86 114 L8 100 L86 86Z" fill="${c.accent}"/><path d="M100 46 L108 92 L154 100 L108 108 L100 154 L92 108 L46 100 L92 92Z" fill="${c.main}" transform="rotate(45 100 100)"/>`,
  gems: (c, d) =>
    `<circle cx="100" cy="100" r="84" fill="url(#${d})"/>${[
      [100, 54],
      [56, 128],
      [144, 128],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x} ${(y ?? 0) - 34} L${(x ?? 0) + 26} ${y} L${x} ${(y ?? 0) + 34} L${(x ?? 0) - 26} ${y}Z" fill="${c.accent}" stroke="${c.main}" stroke-width="3"/><path d="M${x} ${(y ?? 0) - 34} L${x} ${(y ?? 0) + 34} M${(x ?? 0) - 26} ${y} L${(x ?? 0) + 26} ${y}" stroke="${c.main}" stroke-width="2"/>`,
      )
      .join('')}`,
  sword: (c, d) =>
    `${sunDisc(c, 100, 90, 70)}<path d="M94 20 L100 8 L106 20 L106 128 L94 128Z" fill="${c.main}"/><rect x="66" y="128" width="68" height="10" fill="${c.main}"/><rect x="95" y="138" width="10" height="34" fill="${c.main}"/><circle cx="100" cy="180" r="9" fill="${c.main}"/><rect y="0" width="200" height="200" fill="url(#${d})" opacity=".5"/>`,
  axe: (c, d) =>
    `<circle cx="100" cy="100" r="80" fill="${c.accent}"/><rect x="94" y="20" width="12" height="170" fill="${c.main}"/><path d="M106 34 Q170 40 168 92 Q140 78 106 86Z" fill="${c.main}"/><path d="M40 160 Q100 120 160 160" stroke="url(#${d})" stroke-width="30" fill="none"/>`,
  harp: (c, d) =>
    `<circle cx="100" cy="100" r="82" fill="url(#${d})"/><path d="M58 182 L58 30 Q120 10 150 70 L150 82 Q100 90 70 182Z" fill="none" stroke="${c.main}" stroke-width="12"/>${[78, 94, 110, 126, 142].map((x, i) => `<line x1="${x}" y1="${36 + i * 4}" x2="${x}" y2="${170 - i * 18}" stroke="${c.accent}" stroke-width="3"/>`).join('')}`,
  helm: (c, d) =>
    `${sunDisc(c, 100, 100, 74)}<path d="M40 120 Q40 34 100 30 Q160 34 160 120 L160 168 L122 168 L122 120 L78 120 L78 168 L40 168Z" fill="${c.main}"/><path d="M96 30 L104 30 L104 150 L96 150Z" fill="${c.accent}"/><rect y="0" width="200" height="200" fill="url(#${d})" opacity=".35"/>`,
  moon: (c, d) =>
    `<circle cx="100" cy="100" r="86" fill="url(#${d})"/><circle cx="96" cy="96" r="62" fill="${c.accent}"/><circle cx="122" cy="80" r="56" fill="${c.ground}"/>${[
      [40, 40],
      [160, 150],
      [150, 40],
      [56, 170],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c.main}"/>`)
      .join('')}`,
  snow: (c, d) =>
    `<circle cx="100" cy="100" r="84" fill="${c.accent}"/>${[0, 60, 120]
      .map(
        (a) =>
          `<g transform="rotate(${a} 100 100)" stroke="${c.main}" stroke-width="8" stroke-linecap="round"><line x1="100" y1="26" x2="100" y2="174"/><path d="M84 44 L100 60 L116 44 M84 156 L100 140 L116 156" fill="none"/></g>`,
      )
      .join('')}<circle cx="100" cy="100" r="30" fill="url(#${d})"/>`,
  quill: (c, d) =>
    `<circle cx="100" cy="100" r="80" fill="url(#${d})"/><path d="M168 18 C110 30 70 90 58 162 L66 164 C84 104 120 60 168 18Z" fill="${c.main}"/><path d="M168 18 C150 70 110 110 66 160" stroke="${c.accent}" stroke-width="4" fill="none"/><rect x="40" y="160" width="56" height="30" rx="4" fill="${c.accent}"/>`,
  feather: (c, d) =>
    `${sunDisc(c, 100, 100, 72)}<path d="M150 20 C70 40 40 120 54 184 C110 160 160 90 150 20Z" fill="${c.main}"/><path d="M54 184 L140 40" stroke="${c.paper}" stroke-width="3"/><rect y="150" width="200" height="50" fill="url(#${d})"/>`,
  road: (c, d) =>
    `${sunDisc(c, 100, 60, 40)}<path d="M0 110 Q60 96 100 104 T200 100 V200 H0Z" fill="${c.main}"/><path d="M96 104 Q130 120 104 140 Q60 166 120 200 L80 200 Q30 166 86 140 Q108 124 92 106Z" fill="${c.paper}"/><rect y="104" width="200" height="96" fill="url(#${d})"/>`,
  brush: (c, d) =>
    `<rect x="16" y="16" width="168" height="168" fill="url(#${d})"/><path d="M30 150 Q80 60 170 40" stroke="${c.accent}" stroke-width="30" stroke-linecap="round" fill="none"/><path d="M150 180 L176 60 L186 62 L162 182Z" fill="${c.main}"/>`,
  letter: (c, d) =>
    `<rect x="18" y="46" width="164" height="110" fill="${c.paper}" stroke="${c.main}" stroke-width="5"/><path d="M18 46 L100 112 L182 46" fill="none" stroke="${c.main}" stroke-width="5"/><circle cx="100" cy="112" r="20" fill="${c.accent}"/><rect x="18" y="120" width="164" height="36" fill="url(#${d})"/>`,
  car: (c, d) =>
    `${sunDisc(c, 100, 90, 70)}<path d="M28 140 L36 108 L70 104 L84 76 L132 76 L148 104 L176 110 L178 140Z" fill="${c.main}"/><circle cx="62" cy="144" r="18" fill="${c.main}" stroke="${c.paper}" stroke-width="5"/><circle cx="148" cy="144" r="18" fill="${c.main}" stroke="${c.paper}" stroke-width="5"/><rect x="90" y="84" width="34" height="18" fill="${c.paper}"/><rect y="164" width="200" height="36" fill="url(#${d})"/>`,
  gate: (c, d) =>
    `<rect x="0" y="0" width="200" height="200" fill="url(#${d})"/><path d="M40 200 L40 90 Q40 24 100 24 Q160 24 160 90 L160 200Z" fill="${c.main}"/><path d="M58 200 L58 94 Q58 44 100 44 Q142 44 142 94 L142 200Z" fill="${c.accent}"/><path d="M100 62 L106 82 L126 82 L110 94 L116 114 L100 102 L84 114 L90 94 L74 82 L94 82Z" fill="${c.paper}"/>`,
  map: (c, d) =>
    `<circle cx="100" cy="100" r="84" fill="url(#${d})"/><circle cx="100" cy="100" r="62" fill="none" stroke="${c.main}" stroke-width="4"/><path d="M100 18 L112 100 L100 182 L88 100Z" fill="${c.accent}"/><path d="M18 100 L100 88 L182 100 L100 112Z" fill="${c.main}"/>`,
  eye: (c, d) =>
    `<rect width="200" height="200" fill="url(#${d})"/><path d="M10 100 Q100 10 190 100 Q100 190 10 100Z" fill="${c.accent}"/><path d="M100 44 Q118 100 100 156 Q82 100 100 44Z" fill="${c.main}"/>`,
  sun: (c, d) =>
    `${Array.from({ length: 12 }, (_, i) => `<path d="M96 100 L100 6 L104 100Z" fill="${c.main}" transform="rotate(${i * 30} 100 100)"/>`).join('')}<circle cx="100" cy="100" r="54" fill="${c.accent}"/><circle cx="100" cy="100" r="54" fill="url(#${d})"/>`,
} satisfies Record<string, Draw>;

export type Motif = keyof typeof DRAW;

/** Emblem markup placed at (x, y) and scaled from its 200px box to `size`. */
export const motif = (m: Motif, c: Swatch, dots: string, x: number, y: number, size: number): string =>
  `<g transform="translate(${x} ${y}) scale(${size / 200})">${DRAW[m](c, dots)}</g>`;
