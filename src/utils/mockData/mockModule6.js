import { getUniqueId } from "../mocks";

const data = [
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
];

export const getData = () => {
  return new Promise((resolve) => {
    let list = [];
    data.sort(() => Math.random() - 0.5);
    for (let index = 0; index < 4; index++) {
      list.push(data[index]);
    }
    resolve(list);
  });
};
