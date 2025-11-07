/**@namespace useLocalStorage */

/**
 * @function useLocalStorage
 * @param {string} item Main key for use in localstorage
 * @property {function} setDataLocal Method to save data in a especific index
 * @property {function} setData Method to save data in main key
 * @property {function} getData Methods to sign out a user
 * @property {function} getDataLocal Methods to sign out a user
 * @returns {object} {setDataLocal, setData, getData, getDataLocal}
 */
export const useLocalStorage = (item) => {
  const setDataLocal = (index, data) => {
    let copy = { ...JSON.parse(localStorage.getItem(item)) };
    copy[index] = data;
    localStorage.setItem(item, JSON.stringify(copy));
  };

  const setData = (data) => {
    localStorage.setItem(item, JSON.stringify(data));
  };

  const getData = () => {
    let data = JSON.parse(localStorage.getItem(item));
    if (!data) return null;
    return data;
  };

  const getDataLocal = (index) => {
    let data = JSON.parse(localStorage.getItem(item));
    if (!data) return -1;
    return data[index];
  };

  const batchSave = (data) => {
    if (!localStorage.getItem(item))
      localStorage.setItem(item, JSON.stringify(data));
    return;
  };

  return { getDataLocal, setDataLocal, batchSave, setData, getData };
};
