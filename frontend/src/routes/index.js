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
import FallModule from "./games/fallModule";
import Armar from "./games/armar"
import ScreenPayment from "./payment/ScreenPayment";
import ScreenLicense from "./licenses/ScreenLicense";
import KidsDashboard from "./dashboard/KidsDashboard";
import AdminRoute from "./admin/AdminRoute";
import StopAudioOnRouteChange from "../components/shared/StopAudioOnRouteChange";

/** */
const Routes = () => {
  return (
    <Router>
      <StopAudioOnRouteChange />
      <Switch>
        <Route path="/others" component={Others} />
        <Route path="/escucha/:idLetter" component={AudioScreen} />
        <Route path="/escritura/:idLetter" component={WrittingScreen} />
        <Route path="/vocabulario/:idLetter" component={Games} />
        <Route
          path="/level-up"
          render={props => (
            <LevelUpScreenComponent 
              gameUrl={props.location.state?.gameUrl} 
              accuracy={props.location.state?.accuracy}
              canContinue={props.location.state?.canContinue}
              minAccuracyToContinue={props.location.state?.minAccuracyToContinue}
              {...props} 
            />
          )}
        />
        <Route path="/pares/:idLetter" component={PairWords} />
        <Route path="/otoño/:id" component={FallModule} />
        <Route path="/armar/:id" component={Armar} />
        <Route path="/dashboard" component={KidsDashboard} />
        <Route path="/admin" component={AdminRoute} />
        {/*<Route path="/sesion" component={SignInModule} />*/}
       {/*<Route
          path="/mi-cuenta/registrar-pago/:id/:idplan"
          component={ScreenPayment}
       />*/}
        <Route path="/mi-cuenta/planes/:id" component={ScreenPlans} />
        {/*<Route path="/mi-cuenta/licencias/:id" component={ScreenLicense} >*/}
        {/*<Route path="/mi-cuenta/:id" component={ScreenUser} />*/}
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default Routes;
