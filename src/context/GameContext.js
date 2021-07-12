import React, { useEffect, useReducer } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { modulesInstructions } from "../utils/modulesInstructions";

export const GameContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_POINTS": {
      return {
        ...state,
        points: state.points + action.value,
      };
    }

    case "SET_ACCORDION": {
      return {
        ...state,
        moduleOpen: action.value,
      };
    }

    default:
      return state;
  }
};

const initialState = () => {
  let data = JSON.parse(localStorage.getItem("module"));
  return {
    points: 0,
    moduleOpen: !data ? -1 : data["name"],
  };
};

export const GameContextProvider = ({ children }) => {
  const [stateContext, dispatch] = useReducer(reducer, initialState());

  const { batchSave } = useLocalStorage("instructions");

  useEffect(() => {
    batchSave(modulesInstructions);
  }, [batchSave]);

  return (
    <GameContext.Provider value={{ stateContext, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
