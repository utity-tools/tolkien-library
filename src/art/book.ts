import type { Work } from '../data/works';
import { FORMATS } from '../lib/formats';
import { motif } from './motifs';
import { PALETTES, type Swatch } from './palette';
import { grainFilter, halftone, hash, rng, scuffFilter, svgDoc, text, wrap } from './svg';
import { wear } from './wear';

type Binding = 'cloth' | 'jacket';

/** Roughly two in five hardbacks are bare gilt cloth, the rest wear printed jackets. */
const bindingOf = (w: Work): Binding => (hash(w.id) % 5 < 2 ? 'cloth' : 'jacket');

const GOLD = 'url(#gold)';

/** Shared defs: gilt gradient, cloth weave, halftone, grain and scuff filters. */
const defs = (c: Swatch, seed: number, cloth: boolean): string =>
  `<defs>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8C6A27"/><stop offset=".35" stop-color="#E7C66C"/><stop offset=".55" stop-color="#B38A3A"/><stop offset=".8" stop-color="#F0D98E"/><stop offset="1" stop-color="#8C6A27"/></linearGradient>
<pattern id="weave" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#fff" fill-opacity=".045"/><rect width="2" height="4" fill="#000" fill-opacity=".07"/></pattern>
${halftone('dots', cloth ? GOLD : c.main, 7, 1.6)}
${grainFilter('grain', cloth ? 1.2 : 0.8, cloth ? 0.6 : 0.45, seed % 97)}
${scuffFilter('scuff', seed % 89, cloth ? '#d9cdb4' : '#f3eee2')}
</defs>`;

/** Rounded-spine shading: dark at both hinges, a soft highlight a third of the way in. */
const roundSpine = (W: number, H: number): string =>
  `<linearGradient id="round" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".1" stop-color="#000" stop-opacity=".12"/><stop offset=".36" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset=".9" stop-color="#000" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient><rect width="${W}" height="${H}" fill="url(#round)"/>`;

const headband = (W: number, y: number): string =>
  `<pattern id="hb${y}" width="5" height="6" patternUnits="userSpaceOnUse"><rect width="2.5" height="6" fill="#B23A2A"/><rect x="2.5" width="2.5" height="6" fill="#EDE3C8"/></pattern><rect y="${y}" width="${W}" height="6" fill="url(#hb${y})"/>`;

const giltRules = (W: number, y: number): string =>
  `<rect x="6" y="${y}" width="${W - 12}" height="2.5" fill="${GOLD}"/><rect x="6" y="${y + 7}" width="${W - 12}" height="1.2" fill="${GOLD}"/>`;

/** Gilt swatch: emblems stamped in gold on cloth. */
const giltSwatch = (c: Swatch): Swatch => ({ ground: c.cloth, main: GOLD, accent: GOLD, paper: c.cloth, cloth: c.cloth });

export const bookSpine = (w: Work): string => {
  const [W, H] = FORMATS.book.spine;
  const c = PALETTES[w.palette];
  const seed = hash(w.id) ^ 0xb0;
  const rand = rng(seed);
  const cloth = bindingOf(w) === 'cloth';
  const ink = cloth ? GOLD : c.main;
  const t = w.title.toUpperCase();
  const size = t.length > 30 ? 26 : t.length > 18 ? 31 : 38;
  const emblemSwatch = cloth ? giltSwatch(c) : c;

  const body = `${defs(c, seed, cloth)}
<rect width="${W}" height="${H}" fill="${cloth ? c.cloth : c.ground}"/>
${cloth ? `<rect width="${W}" height="${H}" fill="url(#weave)"/>${giltRules(W, 40)}${giltRules(W, 846)}` : `<rect y="0" width="${W}" height="70" fill="${c.main}"/>${text('J.R.R.', { x: W / 2, y: 32, size: 12, fill: c.ground, font: 'sans', weight: 700, spacing: 0.2 })}${text('TOLKIEN', { x: W / 2, y: 52, size: 13, fill: c.ground, font: 'sans', weight: 700, spacing: 0.1, maxWidth: 66 })}`}
${cloth ? text('TOLKIEN', { x: W / 2, y: 92, size: 13, fill: GOLD, font: 'sans', weight: 700, spacing: 0.14, maxWidth: 66 }) : ''}
${text(t, { x: 0, y: 0, size, fill: ink, weight: 700, maxWidth: 560, transform: `translate(${W / 2 + size * 0.34} 455) rotate(-90)` })}
${motif(w.motif, emblemSwatch, 'dots', W / 2 - 30, 742, 60)}
${text('WESTMARCH', { x: W / 2, y: 832, size: 9, fill: ink, font: 'sans', weight: 700, spacing: 0.18, maxWidth: 66 })}
${roundSpine(W, H)}
${headband(W, 0)}${headband(W, H - 6)}
${wear({ W, H, seed, rand, sheen: !cloth, edge: 0.06 })}`;

  return svgDoc(W, H, body);
};

export const bookCover = (w: Work): string => {
  const [W, H] = FORMATS.book.cover;
  const c = PALETTES[w.palette];
  const seed = hash(w.id) ^ 0xc0;
  const rand = rng(seed);
  const cloth = bindingOf(w) === 'cloth';

  const hinge = `<linearGradient id="hinge" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".55" stop-color="#000" stop-opacity=".05"/><stop offset=".7" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient><rect width="44" height="${H}" fill="url(#hinge)"/><rect x="30" width="2" height="${H}" fill="#000" fill-opacity=".35"/>`;
  const boardEdge = `<linearGradient id="edge" x1="0" x2="1"><stop offset=".9" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient><rect width="${W}" height="${H}" fill="url(#edge)"/>`;

  const lines = wrap(w.title.toUpperCase(), cloth ? 16 : 12, 3);

  const face = cloth
    ? (() => {
        const size = lines.length === 1 ? 50 : lines.length === 2 ? 42 : 34;
        const titleTop = 600;
        return `<rect width="${W}" height="${H}" fill="${c.cloth}"/><rect width="${W}" height="${H}" fill="url(#weave)"/>
<rect x="70" y="56" width="${W - 110}" height="${H - 112}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="3"/>
<rect x="71.5" y="57.5" width="${W - 110}" height="${H - 112}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.5"/>
${motif(w.motif, giltSwatch(c), 'dots', W / 2 + 14 - 130, 220, 260)}
${lines.map((l, i) => text(l, { x: W / 2 + 14, y: titleTop + i * size * 1.08, size, fill: GOLD, weight: 700, spacing: 0.04, maxWidth: 440 })).join('')}
${text('J.R.R. TOLKIEN', { x: W / 2 + 14, y: 790, size: 16, fill: GOLD, font: 'sans', weight: 700, spacing: 0.3 })}`;
      })()
    : (() => {
        const size = lines.length === 1 ? 82 : lines.length === 2 ? 66 : 54;
        const titleTop = 92;
        const panelTop = titleTop + lines.length * size * 0.94 + 26;
        const panelH = 790 - panelTop;
        const art = Math.min(470, panelH - 30);
        return `<rect width="${W}" height="${H}" fill="${c.ground}"/>
${text('J.R.R. TOLKIEN', { x: W / 2 + 14, y: 62, size: 17, fill: c.main, font: 'sans', weight: 700, spacing: 0.36 })}
${lines.map((l, i) => text(l, { x: W / 2 + 14, y: titleTop + size * 0.86 + i * size * 0.94, size, fill: c.main, weight: 700, maxWidth: 500 })).join('')}
<svg x="64" y="${panelTop}" width="${W - 100}" height="${panelH}" viewBox="0 0 ${W - 100} ${panelH}">${motif(w.motif, c, 'dots', (W - 100 - art) / 2, (panelH - art) / 2, art)}</svg>
<rect x="64" y="${panelTop}" width="${W - 100}" height="${panelH}" fill="none" stroke="${c.main}" stroke-width="2"/>
${text(w.titleEs.toUpperCase(), { x: W / 2 + 14, y: 836, size: 14, fill: c.main, font: 'sans', weight: 700, spacing: 0.2, maxWidth: 460 })}
<circle cx="${W - 58}" cy="858" r="15" fill="none" stroke="${c.main}" stroke-width="2"/>${text('W', { x: W - 58, y: 864, size: 16, fill: c.main, weight: 700 })}`;
      })();

  const body = `${defs(c, seed, cloth)}
${face}
${hinge}
${boardEdge}
${wear({ W, H, seed, rand, sheen: !cloth, edge: 0.05 })}`;

  return svgDoc(W, H, body);
};
