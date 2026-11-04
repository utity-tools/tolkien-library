import type { Motif } from '../art/motifs';
import type { PaletteKey } from '../art/palette';

export interface Work {
  readonly id: string;
  readonly title: string;
  /** Spanish title, shown as the secondary line (the "romaji / kanji" slot of the reference). */
  readonly titleEs: string;
  readonly year: number;
  readonly genre: string;
  /** Series and volume, e.g. "History of Middle-earth III". */
  readonly series?: string;
  /** Posthumous / edited works. */
  readonly editor?: string;
  /** Overrides the generated credit line (co-authored works). */
  readonly credit?: string;
  readonly synopsis: string;
  readonly motif: Motif;
  readonly palette: PaletteKey;
}

const CT = 'Christopher Tolkien';
const HOME = 'History of Middle-earth';

/** Every book-length work by J.R.R. Tolkien, in order of first publication. */
export const WORKS: readonly Work[] = [
  {
    id: 'vocabulary',
    title: 'A Middle English Vocabulary',
    titleEs: 'Un vocabulario de inglés medio',
    year: 1922,
    genre: 'Philology',
    synopsis:
      'A young Leeds lecturer compiles the glossary to a reader of fourteenth-century verse and prose, and begins a lifetime of tracing words to their roots.',
    motif: 'quill',
    palette: 'parchment',
  },
  {
    id: 'gawain-edition',
    title: 'Sir Gawain and the Green Knight',
    titleEs: 'Sir Gawain y el Caballero Verde',
    year: 1925,
    genre: 'Edition',
    credit: 'Edited by J.R.R. Tolkien and E. V. Gordon.',
    synopsis:
      'With E. V. Gordon, Tolkien establishes the Middle English text of the great Arthurian poem: a beheading game, a green giant, and a year of waiting.',
    motif: 'axe',
    palette: 'forest',
  },
  {
    id: 'philologists',
    title: 'Songs for the Philologists',
    titleEs: 'Canciones para los filólogos',
    year: 1936,
    genre: 'Poetry',
    credit: 'By J.R.R. Tolkien, E. V. Gordon and others.',
    synopsis:
      'Comic songs in Old English, Gothic and Old Norse, written for a university club and printed privately by students in a tiny run.',
    motif: 'harp',
    palette: 'ochre',
  },
  {
    id: 'hobbit',
    title: 'The Hobbit',
    titleEs: 'El Hobbit',
    year: 1937,
    genre: 'Novel',
    series: 'There and Back Again',
    synopsis:
      'A comfortable hobbit is talked into burgling a dragon, and comes home from the Lonely Mountain richer, stranger and carrying a small gold ring.',
    motif: 'mountain',
    palette: 'cobalt',
  },
  {
    id: 'niggle',
    title: 'Leaf by Niggle',
    titleEs: 'Hoja de Niggle',
    year: 1945,
    genre: 'Short story',
    synopsis:
      'A painter who can only ever finish single leaves is called away on a long journey before his great picture of a tree is done.',
    motif: 'leaf',
    palette: 'forest',
  },
  {
    id: 'aotrou',
    title: 'The Lay of Aotrou and Itroun',
    titleEs: 'La balada de Aotrou e Itroun',
    year: 1945,
    genre: 'Poetry',
    synopsis:
      'A Breton lord, desperate for an heir, buys a potion from a witch in the wood, and she comes back to name her price.',
    motif: 'moon',
    palette: 'night',
  },
  {
    id: 'giles',
    title: 'Farmer Giles of Ham',
    titleEs: 'Egidio, el granjero de Ham',
    year: 1949,
    genre: 'Novella',
    synopsis:
      'A stout farmer with an old blunderbuss frightens off a giant by accident, and is made to face a dragon on purpose.',
    motif: 'dragon',
    palette: 'vermilion',
  },
  {
    id: 'beorhtnoth',
    title: "The Homecoming of Beorhtnoth Beorhthelm's Son",
    titleEs: 'El regreso de Beorhtnoth, hijo de Beorhthelm',
    year: 1953,
    genre: 'Verse drama',
    synopsis:
      'Two servants search a dark battlefield for their lord’s headless body after Maldon, arguing over the price of heroic pride.',
    motif: 'helm',
    palette: 'ink',
  },
  {
    id: 'fellowship',
    title: 'The Fellowship of the Ring',
    titleEs: 'La Comunidad del Anillo',
    year: 1954,
    genre: 'Novel',
    series: 'The Lord of the Rings I',
    synopsis:
      'Frodo inherits his uncle’s ring and learns what it is. Nine walkers leave Rivendell to carry it south, and the fellowship breaks at the falls of Rauros.',
    motif: 'ring',
    palette: 'vermilion',
  },
  {
    id: 'towers',
    title: 'The Two Towers',
    titleEs: 'Las dos torres',
    year: 1954,
    genre: 'Novel',
    series: 'The Lord of the Rings II',
    synopsis:
      'The scattered company fight at Helm’s Deep and wake the Ents, while Frodo and Sam follow a treacherous guide towards the borders of Mordor.',
    motif: 'towers',
    palette: 'ink',
  },
  {
    id: 'king',
    title: 'The Return of the King',
    titleEs: 'El retorno del Rey',
    year: 1955,
    genre: 'Novel',
    series: 'The Lord of the Rings III',
    synopsis:
      'Minas Tirith is besieged, a king comes by the Paths of the Dead, and two hobbits climb the burning mountain alone.',
    motif: 'crown',
    palette: 'cobalt',
  },
  {
    id: 'bombadil',
    title: 'The Adventures of Tom Bombadil',
    titleEs: 'Las aventuras de Tom Bombadil',
    year: 1962,
    genre: 'Poetry',
    synopsis:
      'Sixteen poems said to come from the Red Book of Westmarch: river-daughters, barrow-wights, a cat, a troll, and the oldest master of the Old Forest.',
    motif: 'feather',
    palette: 'ochre',
  },
  {
    id: 'tree-leaf',
    title: 'Tree and Leaf',
    titleEs: 'Árbol y hoja',
    year: 1964,
    genre: 'Essay',
    synopsis:
      'Tolkien’s defence of fairy-stories as true art, paired with the tale of a painter and his unfinished tree.',
    motif: 'tree',
    palette: 'forest',
  },
  {
    id: 'smith',
    title: 'Smith of Wootton Major',
    titleEs: 'Herrero de Wootton Mayor',
    year: 1967,
    genre: 'Novella',
    synopsis:
      'A village boy swallows a silver star baked into a cake, and it gives him a passport into Faery for the rest of his life.',
    motif: 'star',
    palette: 'night',
  },
  {
    id: 'road',
    title: 'The Road Goes Ever On',
    titleEs: 'El camino sigue y sigue',
    year: 1967,
    genre: 'Song cycle',
    credit: 'Poems by J.R.R. Tolkien, music by Donald Swann.',
    synopsis:
      'Donald Swann sets poems from Middle-earth to music, with Tolkien’s own notes on the Elvish of Namárië.',
    motif: 'road',
    palette: 'parchment',
  },
  {
    id: 'gawain',
    title: 'Sir Gawain, Pearl and Sir Orfeo',
    titleEs: 'Sir Gawain, Perla y Sir Orfeo',
    year: 1975,
    genre: 'Translation',
    editor: CT,
    synopsis:
      'Three medieval poems rendered into modern English verse: a knight’s test, a father’s grief, and a harper who walks into the land of the dead.',
    motif: 'axe',
    palette: 'forest',
  },
  {
    id: 'father-christmas',
    title: 'The Father Christmas Letters',
    titleEs: 'Cartas de Papá Noel',
    year: 1976,
    genre: 'Letters',
    editor: 'Baillie Tolkien',
    synopsis:
      'Illustrated letters sent each December to the Tolkien children from the North Pole, full of a clumsy polar bear and invading goblins.',
    motif: 'snow',
    palette: 'vermilion',
  },
  {
    id: 'silmarillion',
    title: 'The Silmarillion',
    titleEs: 'El Silmarillion',
    year: 1977,
    genre: 'Mythology',
    editor: CT,
    synopsis:
      'The Elder Days, from the music of the Ainur to the ruin of Beleriand: three jewels that hold the light of the Two Trees, and the oath sworn to win them back.',
    motif: 'gems',
    palette: 'night',
  },
  {
    id: 'pictures',
    title: 'Pictures by J.R.R. Tolkien',
    titleEs: 'Ilustraciones de J.R.R. Tolkien',
    year: 1979,
    genre: 'Art',
    editor: CT,
    synopsis:
      'The author’s own paintings and drawings of Middle-earth, from Rivendell in watercolour to the gates of Bag End.',
    motif: 'brush',
    palette: 'parchment',
  },
  {
    id: 'unfinished',
    title: 'Unfinished Tales',
    titleEs: 'Cuentos inconclusos',
    year: 1980,
    genre: 'Legendarium',
    editor: CT,
    synopsis:
      'Narratives left in draft: Tuor’s road to Gondolin, the island of Númenor, the fall of Isildur and the Istari who came over the sea.',
    motif: 'ship',
    palette: 'cobalt',
  },
  {
    id: 'letters',
    title: 'The Letters of J.R.R. Tolkien',
    titleEs: 'Cartas de J.R.R. Tolkien',
    year: 1981,
    genre: 'Letters',
    editor: 'Humphrey Carpenter',
    synopsis:
      'Fifty years of correspondence with publishers, readers, friends and sons at war, where the author explains his world in his own voice.',
    motif: 'letter',
    palette: 'oxblood',
  },
  {
    id: 'exodus',
    title: 'The Old English Exodus',
    titleEs: 'El Éxodo en inglés antiguo',
    year: 1981,
    genre: 'Edition',
    editor: 'Joan Turville-Petre',
    synopsis:
      'Tolkien’s translation and commentary on the Old English poem of the crossing of the Red Sea.',
    motif: 'wave',
    palette: 'cobalt',
  },
  {
    id: 'bliss',
    title: 'Mr. Bliss',
    titleEs: 'El señor Bliss',
    year: 1982,
    genre: 'Picture book',
    synopsis:
      'A tall-hatted gentleman buys a yellow motor car and drives it straight into a run of comic disasters, drawn by the author himself.',
    motif: 'car',
    palette: 'ochre',
  },
  {
    id: 'finn',
    title: 'Finn and Hengest',
    titleEs: 'Finn y Hengest',
    year: 1982,
    genre: 'Philology',
    editor: 'Alan Bliss',
    synopsis:
      'Lectures that reconstruct a lost heroic tale behind a fragment in Beowulf and the Finnsburh poem.',
    motif: 'helm',
    palette: 'oxblood',
  },
  {
    id: 'monsters',
    title: 'The Monsters and the Critics',
    titleEs: 'Los monstruos y los críticos',
    year: 1983,
    genre: 'Essays',
    editor: CT,
    synopsis:
      'Seven lectures, among them the one that changed how Beowulf is read, and the confession of a "secret vice": inventing languages.',
    motif: 'dragon',
    palette: 'ink',
  },
  {
    id: 'lost-tales-1',
    title: 'The Book of Lost Tales I',
    titleEs: 'El libro de los cuentos perdidos I',
    year: 1983,
    genre: 'Legendarium',
    series: `${HOME} I`,
    editor: CT,
    synopsis:
      'The earliest form of the mythology, told to a mariner at the Cottage of Lost Play: the coming of the Valar and the making of the Sun and Moon.',
    motif: 'sun',
    palette: 'ochre',
  },
  {
    id: 'lost-tales-2',
    title: 'The Book of Lost Tales II',
    titleEs: 'El libro de los cuentos perdidos II',
    year: 1984,
    genre: 'Legendarium',
    series: `${HOME} II`,
    editor: CT,
    synopsis:
      'The first tales of Beren and Tinúviel, Túrin, the fall of Gondolin and the Nauglafring, as Tolkien wrote them after the Somme.',
    motif: 'gate',
    palette: 'oxblood',
  },
  {
    id: 'lays',
    title: 'The Lays of Beleriand',
    titleEs: 'Las baladas de Beleriand',
    year: 1985,
    genre: 'Poetry',
    series: `${HOME} III`,
    editor: CT,
    synopsis:
      'The long unfinished poems of the Children of Húrin and of Leithian, the release from bondage, in alliterative and rhyming verse.',
    motif: 'harp',
    palette: 'night',
  },
  {
    id: 'shaping',
    title: 'The Shaping of Middle-earth',
    titleEs: 'La formación de la Tierra Media',
    year: 1986,
    genre: 'Legendarium',
    series: `${HOME} IV`,
    editor: CT,
    synopsis:
      'The first Silmarillion, the earliest maps, and the cosmology of the world drawn as concentric diagrams.',
    motif: 'map',
    palette: 'parchment',
  },
  {
    id: 'lost-road',
    title: 'The Lost Road',
    titleEs: 'El camino perdido',
    year: 1987,
    genre: 'Legendarium',
    series: `${HOME} V`,
    editor: CT,
    synopsis:
      'An abandoned time-travel novel that sinks into Númenor, alongside the etymologies of the Elvish tongues.',
    motif: 'wave',
    palette: 'night',
  },
  {
    id: 'shadow',
    title: 'The Return of the Shadow',
    titleEs: 'El retorno de la Sombra',
    year: 1988,
    genre: 'Drafts',
    series: `${HOME} VI`,
    editor: CT,
    synopsis:
      'The first drafts of a "new Hobbit", in which Bingo Bolger-Baggins sets out, and a Ranger called Trotter waits at Bree.',
    motif: 'eye',
    palette: 'ink',
  },
  {
    id: 'isengard',
    title: 'The Treason of Isengard',
    titleEs: 'La traición de Isengard',
    year: 1989,
    genre: 'Drafts',
    series: `${HOME} VII`,
    editor: CT,
    synopsis:
      'The story finds its shape as it reaches Moria and Lórien, and Trotter becomes Aragorn, heir of Isildur.',
    motif: 'tower',
    palette: 'forest',
  },
  {
    id: 'war-ring',
    title: 'The War of the Ring',
    titleEs: 'La guerra del Anillo',
    year: 1990,
    genre: 'Drafts',
    series: `${HOME} VIII`,
    editor: CT,
    synopsis:
      'Drafts of Helm’s Deep, Minas Tirith and the Pelennor, with plans of the battle drawn in the margins.',
    motif: 'sword',
    palette: 'vermilion',
  },
  {
    id: 'bilbo',
    title: "Bilbo's Last Song",
    titleEs: 'La última canción de Bilbo',
    year: 1990,
    genre: 'Poetry',
    synopsis:
      'The poem Bilbo sings at the Grey Havens, as the ship waits to carry him west over the sea.',
    motif: 'ship',
    palette: 'ochre',
  },
  {
    id: 'sauron',
    title: 'Sauron Defeated',
    titleEs: 'Sauron derrotado',
    year: 1992,
    genre: 'Drafts',
    series: `${HOME} IX`,
    editor: CT,
    synopsis:
      'The ending of the war, an unpublished epilogue with Sam and his children, and the Notion Club Papers.',
    motif: 'eye',
    palette: 'oxblood',
  },
  {
    id: 'morgoth',
    title: "Morgoth's Ring",
    titleEs: 'El anillo de Morgoth',
    year: 1993,
    genre: 'Legendarium',
    series: `${HOME} X`,
    editor: CT,
    synopsis:
      'The later Silmarillion and Tolkien’s philosophy of his world: death, the fate of Elves, and evil poured into the very matter of Arda.',
    motif: 'ring',
    palette: 'ink',
  },
  {
    id: 'jewels',
    title: 'The War of the Jewels',
    titleEs: 'La guerra de las Joyas',
    year: 1994,
    genre: 'Legendarium',
    series: `${HOME} XI`,
    editor: CT,
    synopsis:
      'The later legends of Beleriand: the Grey Annals, the wanderings of Húrin, and the long essay on the names of the Quendi.',
    motif: 'gems',
    palette: 'vermilion',
  },
  {
    id: 'peoples',
    title: 'The Peoples of Middle-earth',
    titleEs: 'Los pueblos de la Tierra Media',
    year: 1996,
    genre: 'Legendarium',
    series: `${HOME} XII`,
    editor: CT,
    synopsis:
      'The prologue and appendices in the making: calendars, family trees, the languages of Men and the last abandoned sequel.',
    motif: 'tree',
    palette: 'parchment',
  },
  {
    id: 'roverandom',
    title: 'Roverandom',
    titleEs: 'Roverandom',
    year: 1998,
    genre: 'Children’s story',
    editor: 'Christina Scull & Wayne G. Hammond',
    synopsis:
      'A small dog bites a wizard’s trousers, is turned into a toy, and travels to the Moon and under the sea to be made real again.',
    motif: 'moon',
    palette: 'cobalt',
  },
  {
    id: 'hurin',
    title: 'The Children of Húrin',
    titleEs: 'Los hijos de Húrin',
    year: 2007,
    genre: 'Legendarium',
    editor: CT,
    synopsis:
      'Túrin Turambar, cursed by Morgoth, wins fame and ruin in equal measure and meets the dragon Glaurung at the Ravine of Cabed-en-Aras.',
    motif: 'sword',
    palette: 'ink',
  },
  {
    id: 'fairy-stories',
    title: 'On Fairy-stories',
    titleEs: 'Sobre los cuentos de hadas',
    year: 2008,
    genre: 'Essay',
    editor: 'Verlyn Flieger & Douglas A. Anderson',
    synopsis:
      'The expanded edition of the great essay, with the drafts and notes that show how it grew from a lecture at St Andrews.',
    motif: 'leaf',
    palette: 'ochre',
  },
  {
    id: 'sigurd',
    title: 'The Legend of Sigurd and Gudrún',
    titleEs: 'La leyenda de Sigurd y Gudrún',
    year: 2009,
    genre: 'Poetry',
    editor: CT,
    synopsis:
      'The Norse tale of the dragon-slayer and the woman who avenges him, retold in the tight eight-line stanzas of the Eddas.',
    motif: 'dragon',
    palette: 'oxblood',
  },
  {
    id: 'arthur',
    title: 'The Fall of Arthur',
    titleEs: 'La caída de Arturo',
    year: 2013,
    genre: 'Poetry',
    editor: CT,
    synopsis:
      'An unfinished alliterative poem: Arthur campaigns in the east while Mordred seizes his throne and Lancelot broods in Benwick.',
    motif: 'crown',
    palette: 'forest',
  },
  {
    id: 'beowulf',
    title: 'Beowulf',
    titleEs: 'Beowulf: traducción y comentario',
    year: 2014,
    genre: 'Translation',
    editor: CT,
    synopsis:
      'Tolkien’s prose translation of the poem he loved most, with lectures on Grendel, the dragon and the hero’s last fight.',
    motif: 'helm',
    palette: 'cobalt',
  },
  {
    id: 'kullervo',
    title: 'The Story of Kullervo',
    titleEs: 'La historia de Kullervo',
    year: 2015,
    genre: 'Short story',
    editor: 'Verlyn Flieger',
    synopsis:
      'An undergraduate retelling of a tragedy from the Kalevala: an orphan sold into slavery, a sister lost and found, a sword that speaks.',
    motif: 'sword',
    palette: 'night',
  },
  {
    id: 'secret-vice',
    title: 'A Secret Vice',
    titleEs: 'Un vicio secreto',
    year: 2016,
    genre: 'Essay',
    editor: 'Dimitra Fimi & Andrew Higgins',
    synopsis:
      'The lecture on inventing languages for pleasure, with poems in Quenya and notes on the music of private tongues.',
    motif: 'quill',
    palette: 'vermilion',
  },
  {
    id: 'beren',
    title: 'Beren and Lúthien',
    titleEs: 'Beren y Lúthien',
    year: 2017,
    genre: 'Legendarium',
    editor: CT,
    synopsis:
      'A mortal man and an Elf-maiden walk into the iron halls of Angband to cut a Silmaril from the Dark Lord’s crown.',
    motif: 'star',
    palette: 'cobalt',
  },
  {
    id: 'gondolin',
    title: 'The Fall of Gondolin',
    titleEs: 'La caída de Gondolin',
    year: 2018,
    genre: 'Legendarium',
    editor: CT,
    synopsis:
      'Tuor reaches the hidden city in the mountains, and brings warning of the dragons and balrogs that will overrun it.',
    motif: 'gate',
    palette: 'ochre',
  },
  {
    id: 'nature',
    title: 'The Nature of Middle-earth',
    titleEs: 'La naturaleza de la Tierra Media',
    year: 2021,
    genre: 'Essays',
    editor: 'Carl F. Hostetter',
    synopsis:
      'Late writings on time, ageing, Elvish life, beards and the geography of Middle-earth, from the author’s last years.',
    motif: 'map',
    palette: 'forest',
  },
  {
    id: 'numenor',
    title: 'The Fall of Númenor',
    titleEs: 'La caída de Númenor',
    year: 2022,
    genre: 'Legendarium',
    editor: 'Brian Sibley',
    synopsis:
      'The Second Age gathered in one book: the forging of the Rings, the great island’s pride and its drowning beneath the sea.',
    motif: 'wave',
    palette: 'vermilion',
  },
  {
    id: 'maldon',
    title: 'The Battle of Maldon',
    titleEs: 'La batalla de Maldon',
    year: 2023,
    genre: 'Translation',
    editor: 'Peter Grybauskas',
    synopsis:
      'The Old English poem of a lost battle against the Vikings, with Tolkien’s verse play and his essay on the meaning of "ofermod".',
    motif: 'helm',
    palette: 'parchment',
  },
  {
    id: 'poems',
    title: 'The Collected Poems',
    titleEs: 'Poemas reunidos',
    year: 2024,
    genre: 'Poetry',
    editor: 'Christina Scull & Wayne G. Hammond',
    synopsis:
      'More than two hundred poems from seventy years, many printed for the first time, with their versions and drafts.',
    motif: 'feather',
    palette: 'ink',
  },
];

/** Work the page opens on. */
export const INITIAL_WORK_ID = 'fellowship';

export const decadeOf = (year: number): number => Math.floor(year / 10) * 10;

/** Ordered list of decades present in the data, e.g. [1920, 1930, ...]. */
export const DECADES: readonly number[] = [...new Set(WORKS.map((w) => decadeOf(w.year)))];

export const creditLine = (w: Work): string =>
  w.credit ??
  (w.editor ? `By J.R.R. Tolkien. Edited by ${w.editor}.` : 'Written by J.R.R. Tolkien.');

export const metaLine = (w: Work): string =>
  [w.year, w.genre, w.series ?? 'J.R.R. Tolkien'].join(' / ');

export const subtitleLine = (w: Work): string =>
  w.series && w.titleEs !== w.title ? `${w.titleEs} / ${w.series}` : w.titleEs;

export const FIRST_YEAR = WORKS[0]?.year ?? 0;
export const LAST_YEAR = WORKS.at(-1)?.year ?? 0;
