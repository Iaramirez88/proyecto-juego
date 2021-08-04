import { getUniqueId } from "./modWrite";

const data = {
  a: [
    [
      {
        id: getUniqueId(),
        name: "E",
      },
      {
        id: getUniqueId(),
        name: "A",
      },
      {
        id: getUniqueId(),
        name: "I",
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "A",
      },
      {
        id: getUniqueId(),
        name: "U",
      },
      {
        id: getUniqueId(),
        name: "O",
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "o",
      },
      {
        id: getUniqueId(),
        name: "e",
      },
      {
        id: getUniqueId(),
        name: "a",
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "u",
      },
      {
        id: getUniqueId(),
        name: "a",
      },
      {
        id: getUniqueId(),
        name: "i",
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "i",
      },
      {
        id: getUniqueId(),
        name: "a",
      },
      {
        id: getUniqueId(),
        name: "e",
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "a",
      },
      {
        id: getUniqueId(),
        name: "e",
      },
      {
        id: getUniqueId(),
        name: "u",
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "U",
      },
      {
        id: getUniqueId(),
        name: "I",
      },
      {
        id: getUniqueId(),
        name: "A",
      },
    ],
    [
      {
        id: getUniqueId(),
        name: "a",
      },
      {
        id: getUniqueId(),
        name: "u",
      },
      {
        id: getUniqueId(),
        name: "i",
      },
    ],
  ],
};

export const getData = (letter) => {
  let id = letter.toLowerCase();
  let listData = data[id];
  let list = [];
  listData.sort(() => Math.random() - 0.5);
  for (let index = 0; index < 4; index++) {
    list.push(listData[index]);
  }
  return list;
};
