import {
  abeja,
  anillo,
  arana,
  arbol,
  arcoiris,
  avion,
  alas,
  astronauta,
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
