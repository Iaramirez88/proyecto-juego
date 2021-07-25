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
