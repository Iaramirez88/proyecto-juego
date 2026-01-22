import { listItem } from "./listOfItems";

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
  let list1 = arr1.sort(() => Math.random() - 0.5);
  let list2 = arr2.sort(() => Math.random() - 0.5);
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
