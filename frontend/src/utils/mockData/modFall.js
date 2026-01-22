import { getUniqueId } from "./listOfItems";
import { randomPos } from "./listOfItems";

const getUpperLetter = (letter, isUpper) =>
  isUpper ? letter.toUpperCase() : letter.toLowerCase();

const getRandomLetter = (arr) => arr[randomPos(arr.length)];

export const getData = (letter) => {
  const vocals = ["a", "e", "i", "o", "u"];
  let vocalsRemove = vocals.reduce((prev, item) => {
    item !== letter && prev.push(item);
    return prev;
  }, []);
  const response = [];
  for (let i = 0; i < 4; i++) {
    let obj = [];
    let index = randomPos(3);
    let isUpper = randomPos(10) > 5 ? true : false;
    for (let j = 0; j < 3; j++) {
      obj.push({
        id: getUniqueId(),
        name:
          index === j
            ? getUpperLetter(letter, isUpper)
            : getUpperLetter(getRandomLetter(vocalsRemove), isUpper),
      });
    }
    response.push(obj);
  }
  return response;
};
