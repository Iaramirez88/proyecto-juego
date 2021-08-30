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
  iman,
  incendio,
  impresora,
  invierno,
  iglu,
  iguana,
  //u
  unicornio,
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
  iguanaSound,
  imanSound,
  impresoraSound,
  inviernoSound,
  igluSound,
  incendioSound,
  //o
  osoSound,
  //u
  unicornioSound,
} from "../sounds";

const listItem = {
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
      name: "Estralla",
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
      id: 18,
      name: "Escorpion",
      image: escorpion,
      sound: escorpionSound,
    }
  ],
  i: [
    {
      id: 19,
      name: "Insectos",
      image: insectos,
      sound: insectosSound,
    },
    {
      id: 20,
      name: "Isla",
      image: isla,
      sound: islaSound,
    },
    {
      id: 21,
      name: "Iman",
      image: iman,
      sound: imanSound,
    },
    {
      id: 22,
      name: "Incendio",
      image: incendio,
      sound: incendioSound,
    },
    {
      id: 23,
      name: "Invierno",
      image: invierno,
      sound: inviernoSound,
    },
    {
      id: 24,
      name: "Iguana",
      image: iguana,
      sound: iguanaSound,
    },
    {
      id: 25,
      name: "Iglu",
      image: iglu,
      sound: igluSound,
    },
    {
      id: 25,
      name: "Impresora",
      image: impresora,
      sound: impresoraSound,
    }
  ],
  u: [
    {
      id: 26,
      name: "Unicornio",
      image: unicornio,
      sound: unicornioSound,
    },
  ],
};

const randomPos = (index) => {
  return Math.floor(Math.random() * index);
};

const extractArray = (arr, limit) => {
  let list = [];
  let i = 0;
  while (i < limit) {
    list.push(arr[i]);
    i++;
  }
  return list;
};

const removeIndexLetter = (arr, exclude) => {
  return Object.keys(arr)
    .reduce((prev, item) => {
      if (item !== exclude) {
        prev.push(item);
      }
      return prev;
    }, [])
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
};

const selectItemComplement = (arr, keys) => {
  return keys.map((item) => {
    let listCopy = [...arr[item]];
    let index = randomPos(listCopy.length);
    return listCopy[index];
  });
};

const mergeList = (arr1, arr2) => {
  let list1 = arr1.sort(() => Math.random - 0.5);
  let list2 = arr2.sort(() => Math.random - 0.5);
  let listAux = [];
  let response = [];
  let addB = randomPos(3);
  while (list1.length > 0 || list2.length > 0) {
    if (listAux.length === 3) {
      response.push(listAux);
      listAux = [];
      addB = randomPos(3);
    } else {
      if (listAux.length === addB) {
        listAux.push(list2.pop());
      } else {
        listAux.push(list1.pop());
      }
    }
  }
  response.push(listAux);
  return response;
};

const selectItem = (letter) => {
  let keys = removeIndexLetter(listItem, letter);
  let listComplement = selectItemComplement(listItem, keys);
  let listLetter = extractArray(listItem[letter], 8);
  let response = mergeList(listLetter, listComplement);
  return response;
};

export const getData = (letter) => {
  return selectItem(letter);
};
