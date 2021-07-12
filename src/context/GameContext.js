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

    default:
      return state;
  }
};

const initialState = {
  points: 0,
  folder: "",
};

export const GameContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { batchSave } = useLocalStorage("instructions");

  useEffect(() => {
    batchSave(modulesInstructions);
  }, [batchSave]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
