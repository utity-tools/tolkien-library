import type { Work } from '../data/works';
import { FORMATS } from '../lib/formats';
import { motif } from './motifs';
import { PALETTES } from './palette';
import { grainFilter, halftone, hash, rng, scuffFilter, svgDoc, text, wrap } from './svg';
import { wear } from './wear';

const STICKER = '#F2C230';

/** Front of a worn, rented VHS sleeve: big condensed title over a duotone illustration. */
export const vhsCover = (w: Work, index: number): string => {
  const [W, H] = FORMATS.vhs.cover;
  const c = PALETTES[w.palette];
  const seed = hash(w.id);
  const rand = rng(seed);

  const lines = wrap(w.title.toUpperCase(), 11, 3);
  const size = lines.length === 1 ? 82 : lines.length === 2 ? 66 : 52;
  const titleTop = 82;
  const title = lines
    .map((l, i) =>
      text(l, { x: W / 2, y: titleTop + size * 0.86 + i * size * 0.94, size, fill: c.main, weight: 700, maxWidth: 414 }),
    )
    .join('');
  const panelTop = titleTop + lines.length * size * 0.94 + 26;
  const panelBottom = 768;
  const panelH = panelBottom - panelTop;
  const art = Math.min(392, panelH - 24);

  const sticker =
    rand() < 0.7
      ? `<g transform="translate(${386 + rand() * 30} ${panelTop + 36 + rand() * 40}) rotate(${-18 + rand() * 30})"><circle r="40" fill="${STICKER}"/><circle r="34" fill="none" stroke="#141414" stroke-width="1.2" stroke-dasharray="3 3"/>${text('BREE', { x: 0, y: -8, size: 13, fill: '#141414', font: 'sans', weight: 700, spacing: 0.12 })}${text('VIDEO', { x: 0, y: 7, size: 13, fill: '#141414', font: 'sans', weight: 700, spacing: 0.12 })}${text('2 NIGHTS', { x: 0, y: 22, size: 9, fill: '#141414', font: 'sans', weight: 700 })}</g>`
      : '';

  const body = `<defs>${halftone('dots', c.main, 8, 1.8)}${grainFilter('grain', 0.8, 0.5, seed % 97)}${scuffFilter('scuff', seed % 89)}</defs>
<rect width="${W}" height="${H}" fill="${c.ground}"/>
${text("J.R.R. TOLKIEN'S", { x: W / 2, y: 54, size: 15, fill: c.main, font: 'sans', weight: 700, spacing: 0.32 })}
${title}
<rect x="30" y="${panelTop}" width="${W - 60}" height="${panelH}" fill="none" stroke="${c.main}" stroke-width="3"/>
<svg x="30" y="${panelTop}" width="${W - 60}" height="${panelH}" viewBox="0 0 ${W - 60} ${panelH}">${motif(w.motif, c, 'dots', (W - 60 - art) / 2, (panelH - art) / 2, art)}</svg>
${text(w.titleEs.toUpperCase(), { x: 32, y: 800, size: 13, fill: c.main, font: 'sans', weight: 700, spacing: 0.16, anchor: 'start', maxWidth: 300 })}
${text(`FIRST PUBLISHED ${w.year} · HI-FI STEREO · PAL`, { x: 32, y: 824, size: 10, fill: c.main, font: 'sans', weight: 400, spacing: 0.14, anchor: 'start', maxWidth: 300 })}
${text(`CAT. No. ${String(index + 1).padStart(3, '0')}`, { x: 32, y: 868, size: 10, fill: c.main, font: 'sans', weight: 700, spacing: 0.14, anchor: 'start' })}
<rect x="356" y="826" width="88" height="46" fill="none" stroke="${c.main}" stroke-width="3.5"/>
${text('VHS', { x: 400, y: 860, size: 32, fill: c.main, font: 'sans', weight: 800, spacing: 0.04 })}
${sticker}
${wear({ W, H, seed, rand, sheen: true })}`;

  return svgDoc(W, H, body);
};

/** Spine of the same sleeve: emblem, vertical title, author and VHS badge. */
export const vhsSpine = (w: Work, index: number): string => {
  const [W, H] = FORMATS.vhs.spine;
  const c = PALETTES[w.palette];
  const seed = hash(w.id) ^ 0x51;
  const rand = rng(seed);
  const t = w.title.toUpperCase();
  const size = t.length > 30 ? 40 : t.length > 18 ? 48 : 58;

  const body = `<defs>${halftone('dots', c.main, 7, 1.6)}${grainFilter('grain', 0.8, 0.5, seed % 97)}${scuffFilter('scuff', seed % 89)}</defs>
<rect width="${W}" height="${H}" fill="${c.ground}"/>
<rect x="12" y="22" width="118" height="118" fill="none" stroke="${c.main}" stroke-width="2.5"/>
<svg x="12" y="22" width="118" height="118" viewBox="0 0 118 118">${motif(w.motif, c, 'dots', 6, 6, 106)}</svg>
${text(t, { x: 0, y: 0, size, fill: c.main, weight: 700, maxWidth: 520, transform: `translate(${W / 2 + size * 0.34} 420) rotate(-90)` })}
${text('TOLKIEN', { x: W / 2, y: 728, size: 18, fill: c.main, font: 'sans', weight: 700, spacing: 0.16, maxWidth: 116 })}
<rect x="29" y="750" width="84" height="38" fill="none" stroke="${c.main}" stroke-width="3"/>
${text('VHS', { x: W / 2, y: 779, size: 25, fill: c.main, font: 'sans', weight: 800, spacing: 0.04 })}
<rect x="22" y="804" width="98" height="22" fill="#F4F0E6"/>
${text(`No. ${String(index + 1).padStart(3, '0')}`, { x: W / 2, y: 820, size: 12, fill: '#141414', font: 'sans', weight: 700, spacing: 0.1 })}
${wear({ W, H, seed, rand, sheen: false })}`;

  return svgDoc(W, H, body);
};
