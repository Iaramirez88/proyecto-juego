// @ts-check

/**
 * @namespace useRequestApi
 */

/**
 * The following hook is used to make request to api workoala
 * @function
 * @param {String} resource Principal route to api request
 * @property {Function} get GET method
 * @property {Function} post POST method
 * @returns {Object} Object with all methods used to request [GET,POST,UPDATE,DELETE]
 */
export const useRequestApi = (resource) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const timeout = 8000;

  const setHeader = (data, auth) => {
    const header = new Headers();
    if (data) header.append("Content-type", "application/json; charset=UTF-8");
    if (auth) header.append("Authorization", `Bearer ${auth}`);
    return header;
  };

  const setUrl = (path) => {
    return `${apiUrl}/${resource}/${path}`;
  };

  /**
   * Method GET
   * @function get
   * @param {string} path Url to make the request
   * @param {string} auth Token for authorize some request
   * @returns {Promise<Object>} Object requested
   */
  const get = async (path, auth) => {
    const controller = new AbortController();
    let url = setUrl(path);
    const id = setTimeout(() => controller.abort(), timeout);
    const headers = setHeader(null, auth);
    try {
      const request = await fetch(url, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(id);
      return request.json();
    } catch (error) {
      return { code: 500 };
    }
  };

  /**
   * Method POST
   * @function
   * @param {string} path Url to make the request
   * @param {object} data Json object to save
   * @param {string} auth Token for authorize some request
   * @returns {Promise<Object>} Object with response and code of response
   */
  const post = async (path, data, auth) => {
    let url = setUrl(path);
    const headers = setHeader(data, auth);

    try {
      let body = JSON.stringify(data);
      const request = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      return request.json();
    } catch (error) {
      return { code: 500 };
    }
  };

  const api = { get, post };

  return api;
};
