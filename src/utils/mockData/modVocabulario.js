import { listItem } from "./listOfItems";

const selectData = (letter) => {
  const selectItem = listItem[letter].sort(() => Math.random() - 0.5);
  let obj = {};
  const result = selectItem.reduce((prev, item, index) => {
    let indexTitle = (index + 1) % 2 === 0 ? 2 : 1;
    obj[`word${indexTitle}`] = item;
    if (indexTitle === 2) {
      prev.push(obj);
      obj = {};
    }
    return prev;
  }, []);
  // Si quedó un objeto incompleto al final, lo descartamos
  if (Object.keys(obj).length === 2) {
    result.push(obj);
  }
  return result.filter(pair => pair.word1 && pair.word2);
};

export const getData = (letter) => {
  const id = letter.toLowerCase();
  return selectData(id);
};
