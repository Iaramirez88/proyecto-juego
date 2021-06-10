export const useLocalStorage = (item) => {
  const setDataLocal = (index, data) => {
    let copy = { ...JSON.parse(localStorage.getItem(item)) };
    copy[index] = data;
    localStorage.setItem(item, JSON.stringify(copy));
  };

  const getDataLocal = (index) => {
    let data = JSON.parse(localStorage.getItem(item))[index] || {};
    return data;
  };

  const batchSave = (data) => {
    localStorage.setItem(item, JSON.stringify(data));
  };

  return [getDataLocal, setDataLocal, batchSave];
};
