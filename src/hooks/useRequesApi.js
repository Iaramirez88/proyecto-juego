import { useLoading } from "./useLoading";
import { useLocalStorage } from "./useLocalStorage";

export const useRequestApi = (resource) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { getData } = useLocalStorage("user");
  const api = {
    get: async (path, auth) => {
      let url = `${apiUrl}/${resource}/${path}`;
      let headers = auth
        ? {
            Authorization: `Bearer ${auth}`,
          }
        : {};

      const request = await fetch(url, {
        headers,
      });
      return request.json();
    },
    post: async (path, data, auth) => {
      let url = `${apiUrl}/${resource}/${path}`;
      let headers = {
        "Content-type": "application/json; charset=UTF-8",
      };
      if (auth) {
        headers["Authorization"] = `Bearer ${auth}`;
      }

      let body = JSON.stringify(data);
      const request = await fetch(url, {
        method: "POST",
        headers,
        body,
      });
      return request.json();
    },
  };

  return api;
};
