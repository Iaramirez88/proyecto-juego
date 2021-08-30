// @ts-check

/**
 * the following context manage results score in global scope, and accordion in home
 * also shared user logged data
 * @module GameContext
 */
import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import LoadingComponent from "../components/shared/LoadingComponent";
import useAuth from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { modulesInstructions } from "../utils/modulesInstructions";

export const GameContext = React.createContext(null);

/**
 * Reducer for handler state application
 * @function
 * @param {Object} state Previous state of the app
 * @param {Object} action New data provided for state app
 * @param {Object} action.type Type of action to set in next new state
 * @param {Object} action.value Value to store in next new state
 * @returns {Object} new state of the app
 */
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
        user: action.value,
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
    loading: false,
    user: null,
  };
};

/**
 * GameContext Provider
 * @function
 */
export const GameContextProvider = ({ children }) => {
  const [stateContext, dispatch] = useReducer(reducer, initialState());
  const { batchSave } = useLocalStorage("instructions");
  const { setDataLocal } = useLocalStorage("user");
  const { isLogged } = useAuth(dispatch);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      batchSave(modulesInstructions);
      const logged = await isLogged();
      setLoading(false);
    };

    init();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <GameContext.Provider value={{ stateContext, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
