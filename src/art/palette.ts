/** Screen-print inks shared by every generated cover. */
export const INK = {
  black: '#141414',
  cobalt: '#1F3FB0',
  vermilion: '#D2452B',
  cream: '#EFE5CF',
  ochre: '#C9962F',
  forest: '#2E5A43',
  oxblood: '#6E2320',
  midnight: '#18204A',
  parchment: '#D9C9A3',
} as const;

export interface Swatch {
  /** Printed card / jacket ground. */
  readonly ground: string;
  /** Title and main illustration ink. */
  readonly main: string;
  /** Second ink of the duotone. */
  readonly accent: string;
  /** Highlights, paper showing through. */
  readonly paper: string;
  /** Bookcloth colour for cloth-bound hardbacks. */
  readonly cloth: string;
}

export type PaletteKey =
  | 'cobalt'
  | 'vermilion'
  | 'ink'
  | 'forest'
  | 'ochre'
  | 'oxblood'
  | 'night'
  | 'parchment';

export const PALETTES: Readonly<Record<PaletteKey, Swatch>> = {
  cobalt: { ground: INK.cream, main: INK.cobalt, accent: INK.vermilion, paper: INK.cream, cloth: '#233466' },
  vermilion: { ground: INK.vermilion, main: INK.black, accent: INK.cream, paper: INK.cream, cloth: '#862A1F' },
  ink: { ground: INK.black, main: INK.cream, accent: INK.vermilion, paper: INK.cream, cloth: '#1E1E21' },
  forest: { ground: INK.forest, main: INK.cream, accent: INK.ochre, paper: INK.cream, cloth: '#25412F' },
  ochre: { ground: INK.ochre, main: INK.black, accent: INK.cobalt, paper: INK.cream, cloth: '#7F6026' },
  oxblood: { ground: INK.oxblood, main: INK.cream, accent: INK.ochre, paper: INK.cream, cloth: '#4C1716' },
  night: { ground: INK.midnight, main: INK.cream, accent: INK.vermilion, paper: INK.cream, cloth: '#161C3C' },
  parchment: { ground: INK.parchment, main: INK.black, accent: INK.vermilion, paper: INK.cream, cloth: '#6B5A3A' },
};
