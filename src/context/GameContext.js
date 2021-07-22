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

    case "SET_USER": {
      return {
        ...state,
        user: action.data,
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
    user: null,
  };
};

export const GameContextProvider = ({ children }) => {
  const [stateContext, dispatch] = useReducer(reducer, initialState());

  const { batchSave } = useLocalStorage("instructions");
  const { getData } = useLocalStorage("user");
  useEffect(() => {
    batchSave(modulesInstructions);
  }, [batchSave]);

  useEffect(() => {
    const user = getData();
    if (user) {
      fetch("http://localhost:8989/api/auth/logged", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            dispatch({
              type: "SET_USER",
              data: user,
            });
          }
        });
    }
  }, []);

  return (
    <GameContext.Provider value={{ stateContext, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
