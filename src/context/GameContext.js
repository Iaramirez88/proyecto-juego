import React, { useEffect, useReducer } from "react";
import LoadingComponent from "../components/shared/LoadingComponent";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useRequestApi } from "../hooks/useRequesApi";
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

    case "SET_LOADING": {
      return {
        ...state,
        loading: action.value,
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
    loading: false,
  };
};

export const GameContextProvider = ({ children }) => {
  const [stateContext, dispatch] = useReducer(reducer, initialState());
  const { batchSave } = useLocalStorage("instructions");
  const { getData } = useLocalStorage("user");
  const apiAuth = useRequestApi("auth");
  useEffect(() => {
    batchSave(modulesInstructions);
  }, [batchSave]);

  useEffect(() => {
    const init = async () => {
      const user = getData();
      if (user) {
        let { code } = await apiAuth.get("logged", user.token);
        if (code === 200) {
          dispatch({
            type: "SET_USER",
            data: user,
          });
        }
      }
    };

    init();
  }, []);

  return (
    <GameContext.Provider value={{ stateContext, dispatch }}>
      {stateContext.loading && <LoadingComponent />}
      {children}
    </GameContext.Provider>
  );
};
