import {
  abeja,
  anillo,
  arana,
  arbol,
  arcoiris,
  avion,
  alas,
  astronauta,
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
} from "../imagesGames";

import {
  arbolSound,
  arcoirisSound,
  aranaSound,
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
} from "../sounds";

export const dataList = {
  a: [
    {
      id: 1,
      name: "Arbol",
      image: arbol,
      sound: arbolSound,
    },
    {
      id: 2,
      name: "Abeja",
      image: abeja,
      sound: AbejaSound,
    },
    {
      id: 3,
      name: "Anillo",
      image: anillo,
      sound: anilloSound,
    },
    {
      id: 4,
      name: "Araña",
      image: arana,
      sound: aranaSound,
    },
    {
      id: 5,
      name: "Arcoiris",
      image: arcoiris,
      sound: arcoirisSound,
    },
    {
      id: 6,
      name: "Avión",
      image: avion,
      sound: avionSound,
    },
    {
      id: 7,
      name: "Astronauta",
      image: astronauta,
      sound: astronautaSound,
    },
    {
      id: 8,
      name: "Alas",
      image: alas,
      sound: alasSound,
    },
  ],
  e: [
    {
      id: 7,
      name: "Enano",
      image: enano,
      sound: enanoSound,
    },
    {
      id: 8,
      name: "Erizo",
      image: erizo,
      sound: erizoSound,
    },
    {
      id: 9,
      name: "Elefante",
      image: elefante,
      sound: elefanteSound,
    },
    {
      id: 10,
      name: "Estralla",
      image: estrella,
      sound: estrellaSound,
    },
    {
      id: 11,
      name: "Escoba",
      image: escoba,
      sound: escobaSound,
    },
    {
      id: 12,
      name: "Espejo",
      image: espejo,
      sound: espejoSound,
    },
    {
      id: 13,
      name: "Escalera",
      image: escalera,
      sound: escaleraSoumd,
    },
    {
      id: 14,
      name: "Esquiar",
      image: esquiar,
      sound: esquiarSound,
    },
    {
      id: 15,
      name: "Escarabjo",
      image: escarabajo,
      sound: escarabajoSound,
    },
    {
      id: 16,
      name: "Escorpion",
      image: escorpion,
      sound: escorpionSound,
    }

  ],
  i: [
    {
      id: 17,
      name: "Insectos",
      image: insectos,
      sound: insectosSound,
    },
    {
      id: 18,
      name: "Isla",
      image: isla,
      sound: islaSound,
    },
    {
      id: 19,
      name: "Iman",
      image: iman,
      sound: imanSound,
    },
    {
      id: 20,
      name: "Impresora",
      image: impresora,
      sound: impresoraSound,
    },
    {
      id: 21,
      name: "Invierno",
      image: invierno,
      sound: inviernoSound,
    },
    {
      id: 22,
      name: "Incendio",
      image: incendio,
      sound: incendioSound,
    },
    {
      id: 23,
      name: "Iguana",
      image: iguana,
      sound: iguanaSound,
    },
    {
      id: 24,
      name: "Iglu",
      image: iglu,
      sound: igluSound,
    },
  ],
};

const selectData = (letter) => {
  const selectItem = dataList[letter].sort(() => Math.random() - 0.5);
  let obj = {};
  return selectItem.reduce((prev, item, index) => {
    let indexTitle = (index + 1) % 2 === 0 ? 2 : 1;
    obj[`word${indexTitle}`] = item;
    if (indexTitle === 2) {
      prev.push(obj);
      obj = {};
    }
    return prev;
  }, []);
};

export const getData = (letter) => {
  const id = letter.toLowerCase();
  return selectData(id);
};
