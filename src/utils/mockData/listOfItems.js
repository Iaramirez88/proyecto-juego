import {
  abeja,
  anillo,
  arana,
  arbol,
  arcoiris,
  ave,
  avion,
  alas,
  astronauta,
  //o
  oso,
  //e
  enano,
  erizo,
  elefante,
  escalera,
  escarabajo,
  escoba,
  escorpion,
  espejo,
  estrella,
  esquiar,
  //i
  insectos,
  isla,
  //u
  unicornio,
  uva,
  utiles,
} from "../imagesGames";

import {
  arbolSound,
  arcoirisSound,
  aranaSound,
  aveSound,
  avionSound,
  AbejaSound,
  anilloSound,
  alasSound,
  astronautaSound,
  //e
  elefanteSound,
  enanoSound,
  erizoSound,
  escaleraSoumd,
  escarabajoSound,
  escobaSound,
  escorpionSound,
  espejoSound,
  esquiarSound,
  estrellaSound,
  //i
  insectosSound,
  islaSound,
  //o
  osoSound,
  //u
  unicornioSound,
  uvaSound,
  utilesSound,
} from "../sounds";

export const listItem = {
  a: [
    {
      id: 1,
      name: "Ave",
      image: ave,
      sound: aveSound,
    },
    {
      id: 2,
      name: "Arbol",
      image: arbol,
      sound: arbolSound,
    },
    {
      id: 3,
      name: "Anillo",
      image: anillo,
      sound: anilloSound,
    },
    {
      id: 4,
      name: "Arcoiris",
      image: arcoiris,
      sound: arcoirisSound,
    },
    {
      id: 5,
      name: "Avion",
      image: avion,
      sound: avionSound,
    },
    {
      id: 6,
      name: "Araña",
      image: arana,
      sound: aranaSound,
    },
    {
      id: 7,
      name: "Astronauta",
      image: astronauta,
      sound: astronautaSound,
    },
    {
      id: 8,
      name: "Abeja",
      image: abeja,
      sound: AbejaSound,
    },
    {
      id: 9,
      name: "Alas",
      image: alas,
      sound: alasSound,
    },
  ],
  o: [
    {
      id: 10,
      name: "Oso",
      image: oso,
      sound: osoSound,
    },
  ],
  e: [
    {
      id: 11,
      name: "Enano",
      image: enano,
      sound: enanoSound,
    },
    {
      id: 12,
      name: "Erizo",
      image: erizo,
      sound: erizoSound,
    },
    {
      id: 13,
      name: "Elefante",
      image: elefante,
      sound: elefanteSound,
    },
    {
      id: 14,
      name: "Estrella",
      image: estrella,
      sound: estrellaSound,
    },
    {
      id: 15,
      name: "Escoba",
      image: escoba,
      sound: escobaSound,
    },
    {
      id: 16,
      name: "Espejo",
      image: espejo,
      sound: espejoSound,
    },
    {
      id: 17,
      name: "Escalera",
      image: escalera,
      sound: escaleraSoumd,
    },
    {
      id: 18,
      name: "Esquiar",
      image: esquiar,
      sound: esquiarSound,
    },
    {
      id: 19,
      name: "Escarabjo",
      image: escarabajo,
      sound: escarabajoSound,
    },
    {
      id: 20,
      name: "Escorpion",
      image: escorpion,
      sound: escorpionSound,
    },
  ],
  i: [
    {
      id: 21,
      name: "Insectos",
      image: insectos,
      sound: insectosSound,
    },
    {
      id: 22,
      name: "Isla",
      image: isla,
      sound: islaSound,
    },
  ],
  u: [
    {
      id: 23,
      name: "Unicornio",
      image: unicornio,
      sound: unicornioSound,
    },
    {
      id: 24,
      name: "Utiles",
      image: utiles,
      sound: utilesSound,
    },
    {
      id: 25,
      name: "Uva",
      image: uva,
      sound: uvaSound,
    },
  ],
};

export const getUniqueId = () => {
  return Math.floor(Math.random() * new Date().getTime());
};

export const shuffle = (array) => {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const getItemsByLimit = (arr, index, limit, maxLen) => {
  let id = index.toLowerCase();
  let dataLetter = shuffle(arr[id]);
  let response = dataLetter;
  if (maxLen) {
    let dataRemove = dataLetter.reduce((prev, item) => {
      if (item.name.length <= maxLen) {
        prev.push(item);
      }
      return prev;
    }, []);
    response = dataRemove;
  }

  let data = [];
  let i = 0;
  while (i < limit) {
    data.push(response[i]);
    i++;
  }
  return data;
};

export const randomPos = (index) => {
  return Math.floor(Math.random() * index);
};
