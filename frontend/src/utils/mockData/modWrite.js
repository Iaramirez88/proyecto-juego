import { getItemsByLimit, listItem } from "./listOfItems";

export const mockWriteData = (letter) => {
  let data = getItemsByLimit(listItem, letter, 4, 7);
  return data;
};
