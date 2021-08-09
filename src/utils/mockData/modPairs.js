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
  esquiar
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
  estrellaSound
} from "../sounds";

import { getUniqueId } from "./modWrite";

export const listPair = {
  a: [
    [
      {
        id: getUniqueId(),
        name: "Anillo",
        sound: anilloSound,
        image: anillo,
      },
      {
        id: getUniqueId(),
        name: "Avión",
        sound: avionSound,
        image: avion,
      },
      {
        id: getUniqueId(),
        name: "Anillo",
        sound: anilloSound,
        image: anillo,
      },
      {
        id: getUniqueId(),
        name: "Avión",
        sound: avionSound,
        image: avion,
      },
      {
        id: getUniqueId(),
        name: "Araña",
        sound: aranaSound,
        image: arana,
      },
      {
        id: getUniqueId(),
        name: "Arcoíris",
        sound: arcoirisSound,
        image: arcoiris,
      },
      {
        id: getUniqueId(),
        name: "Araña",
        sound: aranaSound,
        image: arana,
      },
      {
        id: getUniqueId(),
        name: "Arcoíris",
        sound: arcoirisSound,
        image: arcoiris,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Alas",
        sound: alasSound,
        image: alas,
      },
      {
        id: getUniqueId(),
        name: "Avión",
        sound: avionSound,
        image: avion,
      },
      {
        id: getUniqueId(),
        name: "Arcoíris",
        sound: arcoirisSound,
        image: arcoiris,
      },
      {
        id: getUniqueId(),
        name: "Alas",
        sound: alasSound,
        image: alas,
      },
      {
        id: getUniqueId(),
        name: "Astronauta",
        sound: astronautaSound,
        image: astronauta,
      },
      {
        id: getUniqueId(),
        name: "Avión",
        sound: avionSound,
        image: avion,
      },
      {
        id: getUniqueId(),
        name: "Astronauta",
        sound: astronautaSound,
        image: astronauta,
      },
      {
        id: getUniqueId(),
        name: "Arcoíris",
        sound: arcoirisSound,
        image: arcoiris,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Ave",
        sound: aveSound,
        image: ave,
      },
      {
        id: getUniqueId(),
        name: "Arcoíris",
        sound: arcoirisSound,
        image: arcoiris,
      },
      {
        id: getUniqueId(),
        name: "Arbol",
        sound: arbolSound,
        image: arbol,
      },
      {
        id: getUniqueId(),
        name: "Ave",
        sound: aveSound,
        image: ave,
      },
      {
        id: getUniqueId(),
        name: "Anillo",
        sound: anilloSound,
        image: anillo,
      },
      {
        id: getUniqueId(),
        name: "Arbol",
        sound: arbolSound,
        image: arbol,
      },
      {
        id: getUniqueId(),
        name: "Anillo",
        sound: anilloSound,
        image: anillo,
      },
      {
        id: getUniqueId(),
        name: "Arcoíris",
        sound: arcoirisSound,
        image: arcoiris,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Alas",
        sound: alasSound,
        image: alas,
      },
      {
        id: getUniqueId(),
        name: "Ave",
        sound: aveSound,
        image: ave,
      },
      {
        id: getUniqueId(),
        name: "Alas",
        sound: alasSound,
        image: alas,
      },
      {
        id: getUniqueId(),
        name: "Avión",
        sound: avionSound,
        image: avion,
      },
      {
        id: getUniqueId(),
        name: "Abeja",
        sound: AbejaSound,
        image: abeja,
      },
      {
        id: getUniqueId(),
        name: "Avión",
        sound: avionSound,
        image: avion,
      },
      {
        id: getUniqueId(),
        name: "Abeja",
        sound: AbejaSound,
        image: abeja,
      },
      {
        id: getUniqueId(),
        name: "Ave",
        sound: aveSound,
        image: ave,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Abeja",
        sound: AbejaSound,
        image: abeja,
      },
      {
        id: getUniqueId(),
        name: "Araña",
        sound: aranaSound,
        image: arana,
      },
      {
        id: getUniqueId(),
        name: "Astronauta",
        sound: astronauta,
        image: alas,
      },
      {
        id: getUniqueId(),
        name: "Araña",
        sound: aranaSound,
        image: arana,
      },
      {
        id: getUniqueId(),
        name: "Astronauta",
        sound: astronauta,
        image: alas,
      },
      {
        id: getUniqueId(),
        name: "Arbol",
        sound: arbolSound,
        image: arbol,
      },
      {
        id: getUniqueId(),
        name: "Abeja",
        sound: AbejaSound,
        image: abeja,
      },
      {
        id: getUniqueId(),
        name: "Arbol",
        sound: arbolSound,
        image: arbol,
      },
    ],
  ],
  e: [
    [
      {
        id: getUniqueId(),
        name: "Escoba",
        image: escoba,
        sound: escobaSound,
      },
      {
        id: getUniqueId(),
        name: "Enano",
        image: enano,
        sound: enanoSound,
      },
      {
        id: getUniqueId(),
        name: "EScorpion",
        image: escorpion,
        sound: escorpionSound,
      },
      {
        id: getUniqueId(),
        name: "Enano",
        image: enano,
        sound: enanoSound,
      },
      {
        id: getUniqueId(),
        name: "Estralla",
        image: estrella,
        sound: estrellaSound,
      },
      {
        id: getUniqueId(),
        name: "Escoba",
        image: escoba,
        sound: escobaSound,
      },
      {
        
        id: getUniqueId(),
        name: "EScorpion",
        image: escorpion,
        sound: escorpionSound,
      },
      {
        id: getUniqueId(),
        name: "Estralla",
        image: estrella,
        sound: estrellaSound,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Elefante",
        image: elefante,
        sound: elefanteSound,
      },
      {
        id: getUniqueId(),
        name: "Erizo",
        image: erizo,
        sound: erizoSound,
      },
      {
        id: getUniqueId(),
        name: "Escalera",
        image: escalera,
        sound: escaleraSoumd,
      },
      {
        id: getUniqueId(),
        name: "Elefante",
        image: elefante,
        sound: elefanteSound,
      },
      {
        id: getUniqueId(),
        name: "Erizo",
        image: erizo,
        sound: erizoSound,
      },
      {
        id: getUniqueId(),
        name: "Escalera",
        image: escalera,
        sound: escaleraSoumd,
      },
      {
        id: getUniqueId(),
        name: "EScorpion",
        image: escorpion,
        sound: escorpionSound,
      },
      {
        id: getUniqueId(),
        name: "EScorpion",
        image: escorpion,
        sound: escorpionSound,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Erizo",
        image: erizo,
        sound: erizoSound,
      },
      {
        id: getUniqueId(),
        name: "Espejo",
        image: espejo,
        sound: espejoSound,
      },
      {
        id: getUniqueId(),
        name: "Escoba",
        image: escoba,
        sound: escobaSound,
      },
      {
        id: getUniqueId(),
        name: "Escarabjo",
        image: escarabajo,
        sound: escarabajoSound,
      },
      {
        id: getUniqueId(),
        name: "Escarabjo",
        image: escarabajo,
        sound: escarabajoSound,
      },
      {
        id: getUniqueId(),
        name: "Erizo",
        image: erizo,
        sound: erizoSound,
      },
      {
        id: getUniqueId(),
        name: "Escoba",
        image: escoba,
        sound: escobaSound,
      },
      {
        id: getUniqueId(),
        name: "Espejo",
        image: espejo,
        sound: espejoSound,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Escarabjo",
        image: escarabajo,
        sound: escarabajoSound,
      },
      {
        id: getUniqueId(),
        name: "Esquiar",
        image: esquiar,
        sound: esquiarSound,
      },
      {
        id: getUniqueId(),
        name: "Enano",
        image: enano,
        sound: enanoSound,
      },
      {
        id: getUniqueId(),
        name: "Escalera",
        image: escalera,
        sound: escaleraSoumd,
      },
      {
        id: getUniqueId(),
        name: "Enano",
        image: enano,
        sound: enanoSound,
      },
      {
        id: getUniqueId(),
        name: "Esquiar",
        image: esquiar,
        sound: esquiarSound,
      },
      {
        id: getUniqueId(),
        name: "Escalera",
        image: escalera,
        sound: escaleraSoumd,
      },
      {
        id: getUniqueId(),
        name: "Escarabjo",
        image: escarabajo,
        sound: escarabajoSound,
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "Estralla",
        image: estrella,
        sound: estrellaSound,
      },
      {
        id: getUniqueId(),
        name: "Espejo",
        image: espejo,
        sound: espejoSound
      },
      {
        id: getUniqueId(),
        name: "Estralla",
        image: estrella,
        sound: estrellaSound,
      },
      {
        id: getUniqueId(),
        name: "Elefante",
        image: elefante,
        sound: elefanteSound,
      },
      {
        id: getUniqueId(),
        name: "Esquiar",
        image: esquiar,
        sound: esquiarSound,
      },
      {
        id: getUniqueId(),
        name: "Esquiar",
        image: esquiar,
        sound: esquiarSound,
      },
      {
        id: getUniqueId(),
        name: "Espejo",
        image: espejo,
        sound: espejoSound
      },
      {
        id: getUniqueId(),
        name: "Elefante",
        image: elefante,
        sound: elefanteSound,
      },
    ],
  ],
};

export const getModuleData = (letter) => {
  let id = letter.toLowerCase();
  let data = listPair[id];
  return data[Math.floor(Math.random() * data.length)];
};
