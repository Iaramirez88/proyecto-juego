import {
  abeja,
  anillo,
  arana,
  arbol,
  arcoiris,
  ave,
  avion,
  oso,
  elefante,
  alas,
  enano,
  erizo,
  estrella,
  escoba,
  espejo,
  escalera,
  esquiar,
  escarabajo,
  escorpion,
  insectos,
  isla,
  iman,
  incendio,
  impresora,
  invierno,
  iglu,
  iguana,
  imagen,
  indigena,
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
  osoSound,
  alasSound,
  enanoSound,
  erizoSound,
  estrellaSound,
  escobaSound,
  espejoSound,
  escaleraSoumd,
  esquiarSound,
  escarabajoSound,
  escorpionSound,
  insectosSound,
  islaSound,
  iguanaSound,
  imanSound,
  impresoraSound,
  inviernoSound,
  igluSound,
  incendioSound,
  indigenaSound,
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
  {
    word1:{
      id: 7,
      name: "Enano",
      image: enano,
      sound: enanoSound,
      },
    word2:{
      id:8,
      name: "Erizo",
      image: erizo,
      sound: erizoSound,
    },
  },
  {
    word1:{
      id:9,
      name: "Elefante",
      image: elefante,
      sound:elefanteSound,
    },
    word2:{
      id:10,
      name:"Estralla",
      image: estrella,
      sound: estrellaSound,
    }
  },
  {
    word1:{
      id:11,
      name:"Escoba",
      image: escoba,
      sound: escobaSound,
    },
    word2:{
      id:12,
      name:"Espejo",
      image: espejo,
      sound: espejoSound,
    },
  },
  {
   word1:{
     id:13,
     name:"Escalera",
     image: escalera,
     sound: escaleraSoumd,
   },
   word2:{
     id:14,
     name:"Esquiar",
     image: esquiar,
     sound: esquiarSound,
   }
  },
  {
    word1:{
      id:15,
      name: "Escarabjo",
      image: escarabajo,
      sound: escarabajoSound, 
    },
    word2:{
      id:16,
      name: "Escorpion",
      image: escorpion,
      sound: escorpionSound,
    },
  },
  {
    word1:{
      id: 17,
      name: "Insectos",
      image: insectos,
      sound: insectosSound,
    },
    word2:{
      id: 18,
      name: "Isla",
      image: isla,
      sound: islaSound,
    },
  },
  {
    word1:{
        id: 19,
        name: "Iman",
        image: iman,
        sound: imanSound,
    },
    word2:{
      id: 20,
      name: "Incendio",
      image: incendio,
      sound: incendioSound,
    },
  },
  {
    word1:{
      id: 21,
      name: "Invierno",
      image: invierno,
      sound: inviernoSound,
    },
    word2:{
      id: 22,
      name: "Iguana",
      image: iguana,
      sound: iguanaSound,
    },
  },
  {
    word1:{
      id: 23,
      name: "Iglu",
      image: iglu,
      sound: igluSound,
    },
    word2:{
      id: 24,
      name: "Impresora",
      image: impresora,
      sound: impresoraSound,
    }
  },
  {
    word1:{
      id: 23,
      name: "Imagen",
      image: imagen,
      sound: imanSound,
    },
    word2:{
      id: 24,
      name: "Indigina",
      image: indigena,
      sound: indigenaSound,
    }
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
  { id:5, name:"enano", sooud:enanoSound,image:enano},
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
