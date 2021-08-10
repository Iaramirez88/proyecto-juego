import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Games from "./games";
import AudioScreen from "./games/audio";
import Others from "./other";
import LevelUpScreenComponent from "../components/shared/LevelUpScreenComponent";
import Home from "./home";
import WrittingScreen from "./games/writting";
import PairWords from "./games/pairWords";
import SignInModule from "./signIn";
import ScreenUser from "./home/ScreenUser";
import ScreenPlans from "./home/ScreenPlans";
import ScreenPayment from "./home/ScreenPayment";
import FallModule from "./games/fallModule";

/** */
const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/others" component={Others} />
        <Route path="/escucha/:idLetter" component={AudioScreen} />
        <Route path="/escritura/:idLetter" component={WrittingScreen} />
        <Route path="/vocabulario/:idLetter" component={Games} />
        <Route path="/level-up" component={LevelUpScreenComponent} />
        <Route path="/pares/:idLetter" component={PairWords} />
        <Route path="/otoño/:id" component={FallModule} />
        <Route path="/sesion" component={SignInModule} />
        <Route path="/mi-cuenta/:id" component={ScreenUser} />
        <Route path="/planes/:id" component={ScreenPlans} />
        <Route path="/registro-de-pagos/:id" component={ScreenPayment} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default Routes;
