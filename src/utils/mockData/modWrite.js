import {
  abeja,
  anillo,
  arana,
  arbol,
  arcoiris,
  ave,
  avion,
  insectos,
  oso,
  elefante,
  alas,
} from "../imagesGames";

import {
  arbolSound,
  arcoirisSound,
  aranaSound,
  aveSound,
  avionSound,
  AbejaSound,
  anilloSound,
  elefanteSound,
  insectosSound,
  osoSound,
  alasSound,
} from "../sounds";

export const getUniqueId = () => {
  return Math.floor(Math.random() * new Date().getTime());
};

export const data = [
  {
    word1: {
      id: 1,
      name: "Arbol",
      image: arbol,
      sound: arbolSound,
    },
    word2: {
      id: 2,
      name: "Abeja",
      image: abeja,
      sound: AbejaSound,
    },
  },
  {
    word1: {
      id: 3,
      name: "Anillo",
      image: anillo,
      sound: anilloSound,
    },
    word2: {
      id: 4,
      name: "Araña",
      image: arana,
      sound: aranaSound,
    },
  },
  {
    word1: {
      id: 5,
      name: "Arcoiris",
      image: arcoiris,
      sound: arcoirisSound,
    },
    word2: {
      id: 6,
      name: "Avión",
      image: avion,
      sound: avionSound,
    },
  },
];

export const mockAudioData = [
  [
    {
      id: 1,
      name: "Ave",
      image: ave,
      sound: aveSound,
    },
    {
      id: 2,
      name: "Elefante",
      image: elefante,
      sound: elefanteSound,
    },
    {
      id: 3,
      name: "Arbol",
      image: arbol,
      sound: arbolSound,
    },
  ],
  [
    {
      id: 6,
      name: "Oso",
      image: oso,
      sound: osoSound,
    },
    {
      id: 4,
      name: "Anillo",
      image: anillo,
      sound: anilloSound,
    },
    {
      id: 5,
      name: "Arcoiris",
      image: arcoiris,
      sound: arcoirisSound,
    },
  ],
  [
    {
      id: 7,
      name: "Avion",
      image: avion,
      sound: avionSound,
    },
    {
      id: 8,
      name: "Araña",
      image: arana,
      sound: aranaSound,
    },
    {
      id: 9,
      name: "Insectos",
      image: insectos,
      sound: insectosSound,
    },
  ],
];

const listWrite = [
  { id: 0, name: "Arbol", sound: arbolSound, image: arbol },
  { id: 1, name: "Ave", sound: aveSound, image: ave },
  { id: 2, name: "Araña", sound: aranaSound, image: arana },
  { id: 3, name: "Abeja", sound: AbejaSound, image: abeja },
  { id: 4, name: "Alas", sound: alasSound, image: alas },
];

export const mockWriteData = listWrite
  .sort(() => Math.random() - 0.5)
  .reduce((prev, item, index) => {
    if (index < 3) {
      prev.push(item);
    }
    return prev;
  }, []);

export function getItems(columns) {
  let list = [];
  let x = data
    .sort(() => Math.random() - 0.5)
    .reduce((prev, item, index) => {
      list.push(item);
      if ((index + 1) % columns === 0) {
        prev.push(list);
        list = [];
      }
      return prev;
    }, []);

  return x;
}
