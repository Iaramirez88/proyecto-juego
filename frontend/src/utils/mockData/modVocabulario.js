import { listItem } from "./listOfItems";

const selectData = (letter) => {
  const baseList = listItem[letter];
  if (!Array.isArray(baseList) || baseList.length === 0) return [];
  const selectItem = baseList.slice().sort(() => Math.random() - 0.5);
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

export const getReviewData = (letter, limit = 5) => {
  const id = letter.toLowerCase();
  const items = (listItem[id] || []).slice().sort(() => Math.random() - 0.5);
  return items.slice(0, limit);
};
