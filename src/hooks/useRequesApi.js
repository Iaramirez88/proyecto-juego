import { useLocalStorage } from "./useLocalStorage";

export const useRequestApi = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { getData } = useLocalStorage("user");

  const api = {
    get: async (resource, auth) => {
      let url = `${apiUrl}/${resource}`;
      let headers;
      if (auth) {
        headers = {
          Authorization: `Bearer ${auth}`,
        };
      }
      const request = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      return request.json();
    },
    post: async (resource, data) => {},
  };

  return api;
};
