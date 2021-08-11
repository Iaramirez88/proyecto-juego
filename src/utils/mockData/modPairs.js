import { listItem, shuffle, getItemsByLimit } from "./listOfItems";

export const getModuleData = (letter) => {
  let data = getItemsByLimit(listItem, letter, 4);
  let response = shuffle(data.concat(data));
  console.log(response);
  return response;
};
