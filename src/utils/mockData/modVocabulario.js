import { listItem } from "./listOfItems";

const selectData = (letter) => {
  const selectItem = listItem[letter].sort(() => Math.random() - 0.5);
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
