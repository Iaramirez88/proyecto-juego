import React from "react";
import Routes from "./routes";
import { GameContextProvider } from "./context/GameContext";
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
