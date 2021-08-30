import {
  iconoArmar,
  iconoOtono,
  iconoEscritura,
  iconoEscucha,
  iconopares,
  iconoVocabulario,
} from "../../utils/imagesResources";

export const vocalAUList = [
  {
    id: getUId(),
    title: "A",
    active: 1,
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
          link: "vocabulario",
          active: 1,
          letter: "a",
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          active: 1,
          letter: "a",
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
          link: "pares",
          active: 1,
          letter: "a",
        },
      ],
      [
        {
          id: getUId(),
          title: "Otoño",
          img: iconoOtono,
          link: "otoño",
          letter: "a",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escritura",
          img: iconoEscritura,
          link: "escritura",
          active: 1,
          letter: "a",
        },
        {
          id: getUId(),
          title: "Armar",
          img: iconoArmar,
          letter: "a",
          active: 0,
        },
      ],
    ],
  },
  {
    id: getUId(),
    title: "E",
    active: 1,
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
          link: "vocabulario",
          letter: "e",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          letter: "e",
          active: 1,
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
          link: "pares",
          letter: "e",
          active: 1,
        },
      ],
      [
        {
          id: getUId(),
          title: "Otoño",
          img: iconoOtono,
          link: "otoño",
          letter: "e",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escritura",
          img: iconoEscritura,
          link: "escritura",
          letter: "e",
          active: 1,
        },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "I",
    active: 1,
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
          link: "vocabulario",
          letter: "i",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          letter: "i",
          active: 1,
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
          link: "pares",
          letter: "i",
          active: 1,
        },
      ],
      [
        {
          id: getUId(),
          title: "Otoño",
          img: iconoOtono,
          link: "otoño",
          letter: "i",
          active: 1,
        },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  // {
  //   id: getUId(),
  //   title: "O",
  //   list: [
  //     [
  //       { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
  //       { id: getUId(), title: "Escucha", img: iconoEscucha },
  //       { id: getUId(), title: "Pares", img: iconopares },
  //     ],
  //     [
  //       { id: getUId(), title: "Otoño", img: iconoOtono },
  //       { id: getUId(), title: "Escritura", img: iconoEscritura },
  //       { id: getUId(), title: "Armar", img: iconoArmar },
  //     ],
  //   ],
  // },
  // {
  //   id: getUId(),
  //   title: "U",
  //   list: [
  //     [
  //       { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
  //       { id: getUId(), title: "Escucha", img: iconoEscucha },
  //       { id: getUId(), title: "Pares", img: iconopares },
  //     ],
  //     [
  //       { id: getUId(), title: "Otoño", img: iconoOtono },
  //       { id: getUId(), title: "Escritura", img: iconoEscritura },
  //       { id: getUId(), title: "Armar", img: iconoArmar },
  //     ],
  //   ],
  // },
  // {
  //   id: getUId(),
  //   title: "5v",
  //   especial: true,
  //   list: [
  //     [
  //       { id: getUId(), title: "Colorear", img: iconoColorear },
  //       { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
  //       { id: getUId(), title: "Pares", img: iconopares },
  //     ],
  //     [
  //       { id: getUId(), title: "Otoño", img: iconoOtono },
  //       { id: getUId(), title: "Escritura", img: iconoEscritura },
  //       { id: getUId(), title: "Armar", img: iconoArmar },
  //     ],
  //   ],
  // },
];

function getUId() {
  return Math.floor(Math.random() * new Date().getTime());
}
