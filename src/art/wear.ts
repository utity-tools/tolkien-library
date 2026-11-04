interface WearOpts {
  readonly W: number;
  readonly H: number;
  readonly seed: number;
  readonly rand: () => number;
  /** Plastic sleeve / laminated jacket highlight. */
  readonly sheen: boolean;
  /** Width of the rubbed band along the edges, as a fraction of W. */
  readonly edge?: number;
}

/**
 * Shared ageing layer for every generated face: rubbed edges, creases,
 * print grain, darkened borders and an optional glossy sheen.
 * Expects `scuff` and `grain` filters in the host <defs>.
 */
export const wear = ({ W, H, seed, rand, sheen, edge = 0.1 }: WearOpts): string => {
  const creases = Array.from({ length: 2 + Math.floor(rand() * 3) }, () => {
    const y = rand() * H;
    const tilt = (rand() - 0.5) * H * 0.04;
    const fromLeft = rand() < 0.5;
    const len = W * (0.15 + rand() * 0.35);
    const x0 = fromLeft ? 0 : W;
    const x1 = fromLeft ? len : W - len;
    return `<path d="M${x0} ${y.toFixed(1)} L${x1.toFixed(1)} ${(y + tilt).toFixed(1)}" stroke="#fff" stroke-opacity=".28" stroke-width="1.4"/><path d="M${x0} ${(y + 1.6).toFixed(1)} L${x1.toFixed(1)} ${(y + tilt + 1.6).toFixed(1)}" stroke="#000" stroke-opacity=".18" stroke-width="1"/>`;
  }).join('');

  const corners = [
    [0, 0],
    [W, 0],
    [0, H],
    [W, H],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${(W * (0.08 + rand() * 0.08)).toFixed(1)}" fill="#fff"/>`)
    .join('');

  const gloss = sheen
    ? `<linearGradient id="sheen${seed}" x1="0" y1="0" x2="1" y2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/></linearGradient><rect width="${W}" height="${H}" fill="url(#sheen${seed})"/>`
    : '';

  return `<rect width="${W}" height="${H}" fill="none" stroke="#fff" stroke-width="${(W * edge).toFixed(1)}" filter="url(#scuff)"/>
<g filter="url(#scuff)">${corners}</g>
${creases}
<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)"/>
<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3"/>
${gloss}`;
};
