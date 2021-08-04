import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export const useLoading = () => {
  const { dispatch } = useContext(GameContext);

  const setLoader = (value) => {
    dispatch({
      type: "SET_LOADING",
      value: value,
    });
  };

  return setLoader;
};
