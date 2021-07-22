import { Route, Router, Switch, useRouteMatch } from "react-router";
import ResetPassword from "../../components/forms/resetPassword";
import SingIn from "../../components/forms/singIn";
import NotificationScreen from "./screen/NotificationScreen";
import SelectTypeUser from "./screen/selectTypeUser";
import SelectTypeTutor from "./screen/SelectTypeTutor";
import FormSignUp from "./screen/FormSignUp";
import ResetPasswordScreen from "./screen/ResetPasswordScreen";
import SignInStudent from "./screen/SignInStudent";

const RoutesSign = ({ children }) => {
  let { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${path}/recuperar-contrasena`}
          component={ResetPasswordScreen}
        />
        <Route
          exact
          path={`${path}/notification`}
          component={NotificationScreen}
        />
        <Route exact path={`${path}/registro`} component={SelectTypeTutor} />
        <Route exact path={`${path}/registro/:id`} component={FormSignUp} />
        <Route exact path={`${path}/tutor`} component={SingIn} />
        <Route exact path={`${path}/estudiante`} component={SignInStudent} />
        <Route exact path={`${path}/`} component={SelectTypeUser} />
      </Switch>
    </div>
  );
};

export default RoutesSign;
