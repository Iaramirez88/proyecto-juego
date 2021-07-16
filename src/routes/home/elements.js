import {
  iconoArmar,
  iconoOtono,
  iconoColorear,
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
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          active: 1,
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
          link: "pares",
          active: 1,
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
        },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "E",
    active: 0,
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "I",
    active: 0,
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
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

export const letterM = [
  {
    id: getUId(),
    title: "M",
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
        },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "P",
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "S",
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "L",
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "T",
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "1L",
    especial: true,
    list: [
      [
        { id: getUId(), title: "Pares", img: iconopares },
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
];

export const letterNR = [
  {
    id: getUId(),
    title: "N",
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
        },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "D",
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "C",
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "R",
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
        { id: getUId(), title: "Pares", img: iconopares },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "1L",
    especial: true,
    list: [
      [
        { id: getUId(), title: "Pares", img: iconopares },
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
        { id: getUId(), title: "Escucha", img: iconoEscucha },
      ],
      [
        { id: getUId(), title: "Otoño", img: iconoOtono },
        { id: getUId(), title: "Escritura", img: iconoEscritura },
        { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
];

export const letterBf = [
  [
    {
      id: getUId(),
      title: "B",
      list: [
        [
          {
            id: getUId(),
            title: "Vocabulario",
            img: iconoVocabulario,
          },
          {
            id: getUId(),
            title: "Escucha",
            img: iconoEscucha,
          },
          {
            id: getUId(),
            title: "Pares",
            img: iconopares,
          },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "V",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "G",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
  ],
  [
    {
      id: getUId(),
      title: "F",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "1L",
      especial: true,
      list: [
        [
          { id: getUId(), title: "Pares", img: iconopares },
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
  ],
];

export const letterLL = [
  [
    {
      id: getUId(),
      title: "Ñ",
      list: [
        [
          {
            id: getUId(),
            title: "Vocabulario",
            img: iconoVocabulario,
          },
          {
            id: getUId(),
            title: "Escucha",
            img: iconoEscucha,
          },
          {
            id: getUId(),
            title: "Pares",
            img: iconopares,
          },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "Y",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "H",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
  ],
  [
    {
      id: getUId(),
      title: "Z",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "LL",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      especial: true,
      title: "1L",
      list: [
        [
          { id: getUId(), title: "Pares", img: iconopares },
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
  ],
];

export const letterJCH = [
  [
    {
      id: getUId(),
      title: "J",
      list: [
        [
          {
            id: getUId(),
            title: "Vocabulario",
            img: iconoVocabulario,
          },
          {
            id: getUId(),
            title: "Escucha",
            img: iconoEscucha,
          },
          {
            id: getUId(),
            title: "Pares",
            img: iconopares,
          },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "K",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "Q",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
  ],
  [
    {
      id: getUId(),
      title: "CH",
      list: [
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
          { id: getUId(), title: "Pares", img: iconopares },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
    {
      id: getUId(),
      title: "1L",
      especial: true,
      list: [
        [
          { id: getUId(), title: "Pares", img: iconopares },
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario },
          { id: getUId(), title: "Escucha", img: iconoEscucha },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono },
          { id: getUId(), title: "Escritura", img: iconoEscritura },
          { id: getUId(), title: "Armar", img: iconoArmar },
        ],
      ],
    },
  ],
];

function getUId() {
  return Math.floor(Math.random() * new Date().getTime());
}
