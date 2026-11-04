<div align="center">

# J.R.R. Tolkien · The Reading Shelf

**Una estantería infinita en 3D con toda la obra de J.R.R. Tolkien, en cintas VHS gastadas o en tapas duras con dorado.**

![React](https://img.shields.io/badge/React-18-1F3FB0?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-1F3FB0?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-1F3FB0?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-1F3FB0?style=flat-square&logo=vite&logoColor=white)
![Obras](https://img.shields.io/badge/obras-51-D2452B?style=flat-square)
![Dependencias runtime](https://img.shields.io/badge/deps_runtime-solo_React-141414?style=flat-square)

![La estantería en formato VHS](docs/screenshots/shelf-vhs.jpg)

</div>

---

## Qué es

Una hoja de papel cálido atravesada por una estantería sin fin: **51 obras de Tolkien**, desde *A Middle English Vocabulary* (1922) hasta *The Collected Poems* (2024). La obra activa sale de la estantería y **gira en 3D** para enseñarte la portada, ligeramente inclinada, elevada y echando sombra sobre el papel.

Puedes moverte con clic, flechas, las pestañas de década, la rueda del ratón, arrastrando o con el teclado. Al abrir una obra, **una hoja de papel crece desde la portada** hasta llenar la pantalla, y el póster aparece en **manchas de tinta** que se extienden.

> No hay ni un solo fundido de opacidad: todo aparece con máscaras, recortes o escalados.

## Dos formatos, una estantería

| VHS de videoclub | Tapa dura |
|:---:|:---:|
| ![VHS](docs/screenshots/cover-open-cursor.jpg) | ![Libros](docs/screenshots/shelf-book.jpg) |
| Fundas de cartón con bordes rozados, pliegues, brillo del plástico, número de catálogo y pegatina de *Bree Video*. | Tela con dorado o sobrecubierta impresa, lomo redondeado, cabezada, bisagra y esquinas gastadas. |

El selector **VHS / Libro** interpola las proporciones de la caja 3D en tiempo real: los lomos se estrechan y las portadas se ensanchan sin cortes.

## Abrir una obra

| 1. La hoja crece desde la portada | 2. El póster aparece en tinta |
|:---:|:---:|
| ![Hoja creciendo](docs/screenshots/sheet-growing.jpg) | ![Tinta](docs/screenshots/ink-bleed.jpg) |

| 3. Detalle en VHS | 3. Detalle en libro |
|:---:|:---:|
| ![Detalle VHS](docs/screenshots/detail-vhs.jpg) | ![Detalle libro](docs/screenshots/detail-book.jpg) |

La hoja pasa del recorte y la inclinación de la portada a pantalla completa. Cada línea de texto sube desde su propia máscara, y el póster se revela con siete manchas deformadas con `feTurbulence` + `feDisplacementMap`.

## En el móvil

<p align="center">
  <img src="docs/screenshots/mobile-shelf.jpg" width="300" alt="Estantería en móvil" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/mobile-detail.jpg" width="300" alt="Detalle en móvil" />
</p>

Toda la geometría sale de una sola variable, `--H`. La estantería se arrastra con el dedo, las pestañas se desplazan en horizontal y el detalle pasa a una columna que hace scroll.

## Detalles

- **Cursor propio:** un anillo que se encoge sobre los lomos y se convierte en un disco cobalto con "OPEN / ABRIR" sobre la portada, que se inclina hacia él.
- **Inercia de muelle:** saltar varias obras atraviesa todas las intermedias, que se abren a medias al pasar. El pie de foto va mostrando cada título por su máscara.
- **Pestañas de década:** el bloque cobalto se desliza y se estira hasta la década de la obra activa.
- **Grano de papel:** una capa de ruido en `multiply` sobre toda la página, que también tiñe las cintas.
- **Accesibilidad:** botones reales, `aria-live` en el pie de foto, diálogo modal y soporte de `prefers-reduced-motion`, que vuelve instantáneos todos los movimientos.

## Arrancar en local

```bash
git clone https://github.com/utity-tools/tolkien-library.git
cd tolkien-library
npm install
npm run dev     # → http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Comprobación de tipos + build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run typecheck` | Solo TypeScript |

Requiere Node 18 o superior.

### Controles

| Entrada | Acción |
|---|---|
| Clic en un lomo | Desliza la estantería hasta esa obra |
| Clic en la portada · <kbd>Enter</kbd> · ▶ | Abre el detalle |
| <kbd>←</kbd> <kbd>→</kbd> · flechas en pantalla | Obra anterior / siguiente |
| Rueda · arrastrar | Recorre la estantería y la ajusta a la obra más cercana |
| Pestañas de década | Salta a la primera obra de esa década por el camino más corto |
| <kbd>Esc</kbd> · Cerrar | Devuelve la hoja a la portada |

## Cómo está hecho

```
src/
├─ engine/ShelfEngine.ts   bucle rAF único: muelle, giro, inclinación, cursor, entradas
├─ data/works.ts           las 51 obras (títulos EN/ES, año, género, editor, sinopsis)
├─ data/sheets.ts          imágenes reales opcionales + cajas de recorte
├─ art/                    arte SVG generado: vhs.ts, book.ts, motifs.ts, wear.ts
├─ lib/                    formatos, matemáticas, curvas de movimiento
├─ hooks/                  useShelfEngine, useMaskSwap, useLatest
└─ components/             TopBar, Segmented, Shelf, Caption, DetailSheet, InkPoster…
```

**Rendimiento:** React pinta la estructura una vez. Un solo `requestAnimationFrame` mueve cada cinta escribiendo `transform` en el DOM, así que no hay re-renders por frame. Las cintas fuera de pantalla se ocultan y no se pintan. El arte SVG se genera una sola vez por cara y formato y se guarda en caché como data URL.

**Matemáticas de la estantería:** la posición de cada cinta es `x = r·(ws+gap) + (d−ws+1.6·gap)·B(r)`. `B` es un escalón suave y continuo, así que la portada abierta separa a sus vecinas sin saltos. La apertura es `smoothstep(1−|r|)` y de ella salen la rotación, la elevación, el empuje hacia el espectador y el sombreado.

## Usar ilustraciones propias

El arte generado sirve de base. Para cambiarlo por imágenes reales, declara una hoja y las cajas de recorte en `src/data/sheets.ts`:

```ts
export const SHEET = {
  covers: ['https://…/covers.webp', 1744, 2336],
};

export const CROP = {
  'vhs-cover-hobbit': ['covers', 497, 72, 344, 659],
  'book-spine-silmarillion': ['spines', 266, 31, 189, 1089],
};
```

Las claves siguen el formato `<vhs|book>-<spine|cover>-<idDeObra>`. Cada recorte se estira exactamente sobre su cara, el póster del detalle usa el mismo recorte, y las caras sin entrada en `CROP` siguen usando el arte generado.

---

<div align="center">
<sub>Proyecto de fans, sin relación con la Tolkien Estate. Todas las ilustraciones son originales y se generan por código.</sub>
</div>
