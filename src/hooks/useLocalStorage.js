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
    if (!localStorage.getItem(item))
      localStorage.setItem(item, JSON.stringify(data));
    return;
  };

  return { getDataLocal, setDataLocal, batchSave };
};
