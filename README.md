# Tolkien Reading Shelf

An endless 3D shelf of every book-length work by J.R.R. Tolkien (1922–2024). You can show it as worn VHS tapes or as hardbacks. Click a spine, use the arrows, a decade tab, the wheel, drag or the keyboard to slide the shelf. The active work turns out to show its cover. Open it and a sheet of paper grows out of the cover into a detail page, and the poster bleeds in like ink.

A fan project, not affiliated with the Tolkien Estate. All cover art is original and generated in code.

## Stack

React 18, TypeScript (strict), Tailwind CSS v4 and Vite. Fonts are self-hosted through Fontsource: Newsreader and Inter Tight.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

## Architecture

| Path | Role |
|---|---|
| `src/engine/ShelfEngine.ts` | One `requestAnimationFrame` loop. It handles the spring, wrapping, turning, tilt, hover lift, play ring, cursor and every input. It writes to the DOM directly, so React never re-renders per frame. |
| `src/data/works.ts` | Data for all works: titles, Spanish titles, year, genre, editor, synopsis, emblem and palette. |
| `src/data/sheets.ts` | Optional real image sheets and crop boxes. Any face without a crop uses generated art. |
| `src/art/*` | Procedural SVG art. VHS sleeves have stickers, scuffs, creases and sheen. Hardbacks come in gilt cloth or printed jackets, with rounded spines, headbands and hinges. |
| `src/lib/formats.ts` | VHS and book proportions. The 3D box dimensions come from them, and the engine tweens between the two formats. |
| `src/hooks/useMaskSwap.ts` | The text slide through an overflow mask, used by the caption. |
| `src/components/*` | Presentational components: top bar, decade tabs, shelf, caption, detail sheet with ink poster, cursor. |

## Using real artwork

Add a sheet and its crop boxes in `src/data/sheets.ts`:

```ts
export const SHEET = { covers: ['https://…/covers.webp', 1744, 2336] };
export const CROP = { 'vhs-cover-hobbit': ['covers', 497, 72, 344, 659] };
```

Keys are `<vhs|book>-<spine|cover>-<workId>`. Each crop is stretched over its face exactly, and the detail poster uses the same crop.
