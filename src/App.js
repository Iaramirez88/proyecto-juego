import React from "react";
import Routes from "./routes";
import { GameContextProvider } from "./context/GameContext";
import "./utils/config";

function App() {
  return (
    <div>
      <GameContextProvider>
        <Routes />
      </GameContextProvider>
    </div>
  );
}

export default App;
