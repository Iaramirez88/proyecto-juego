/**@namespace useAuth */

import { useRequestApi } from "../hooks/useRequesApi";
import { useLocalStorage } from "./useLocalStorage";

/**
 * @function useAuth
 * @param {function} dispatch Function which brings dispatcher event through the context app
 * @property {function} signIn Methods to sign in a user
 * @property {function} isLogged Check if user is logged
 * @property {function} signOut Methods to sign out a user
 * @returns {object} {singIn, isLogged, signOut}
 */
const useAuth = (dispatch) => {
  const api = useRequestApi("auth");
  const { setData, getData } = useLocalStorage("user");

  /**
   *Fuction for Login a user
   *@function signIn
   *@param {object} data payload user
   *@param {string} data.username user email or username itself
   *@param {string} data.password user password
   *@param {function} onSuccess Function to handler success request sign in
   *@param {function} onFailed Function to handler fail request sign in
   */
  const signIn = async (data, onSuccess, onFailed) => {
    const request = await api.post("login", data);
    if (request.code === 403 || request.code === 500) onFailed();
    if (request.code === 200) {
      const { response } = request;
      dispatch({
        type: "SET_USER",
        value: response,
      });
      setData(response);
      onSuccess();
    }
  };

  /**
   * Fuction to check if user is still logged
   * @function
   */
  const isLogged = async () => {
    const user = getData();
    if (!user) return;
    const request = await api.get("logged", user.token);
    if (request.code === 403 || request.code === 500) return;
    if (request.code === 200) {
      dispatch({
        type: "SET_USER",
        value: request.response,
      });
      setData({
        token: user.token,
        id: request.response.id,
      });
    }
  };

  const signOut = () => {};

  return { signIn, signOut, isLogged };
};

export default useAuth;
