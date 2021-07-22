import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Games from "./games";
import AudioScreen from "./games/audio";
import Others from "./other";
import LevelUpScreenComponent from "../components/shared/LevelUpScreenComponent";
import Home from "./home";
import WrittingScreen from "./games/writting";
import PairWords from "./games/pairWords";
import FallModule from "./games/FallModule/fallModule";
import SignInModule from "./signIn";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/others" component={Others} />
        <Route path="/escucha" component={AudioScreen} />
        <Route path="/escritura" component={WrittingScreen} />
        <Route path="/vocabulario" component={Games} />
        <Route path="/level-up" component={LevelUpScreenComponent} />
        <Route path="/pares" component={PairWords} />
        <Route path="/otoño/:id" component={FallModule} />
        <Route path="/sesion" component={SignInModule} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default Routes;
