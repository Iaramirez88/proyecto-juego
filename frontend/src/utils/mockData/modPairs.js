import { listItem, shuffle, getItemsByLimit } from "./listOfItems";

export const getModuleData = (letter, numberOfPairs = 4) => {
  let data = getItemsByLimit(listItem, letter, numberOfPairs);
  let response = shuffle(data.concat(data));
  console.log('🎮 Generando', numberOfPairs, 'pares (', response.length, 'cartas )');
  return response;
};
