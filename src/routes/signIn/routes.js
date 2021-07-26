import {
  Route,
  Router,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router";
import ResetPassword from "../../components/forms/resetPassword";
import SingIn from "../../components/forms/singIn";
import NotificationScreen from "./screen/NotificationScreen";
import SelectTypeUser from "./screen/selectTypeUser";
import SelectTypeTutor from "./screen/SelectTypeTutor";
import FormSignUp from "./screen/FormSignUp";
import ResetPasswordScreen from "./screen/ResetPasswordScreen";
import SignInStudent from "./screen/SignInStudent";
import TermScreen from "./screen/TermsScreen";
import VerifyEmailScreen from "./screen/VerifyEmailScreen";

const RoutesSign = ({ children, setHideTitle }) => {
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
        <Route exact path={`${path}/terminos`} component={TermScreen} />
        <Route exact path={`${path}/registro`} component={SelectTypeTutor} />
        <Route exact path={`${path}/registro/:id`} component={FormSignUp} />
        <Route exact path={`${path}/tutor`} component={SingIn} />
        <Route exact path={`${path}/estudiante`} component={SignInStudent} />
        <Route exact path={`${path}/`} component={SelectTypeUser} />
        <Route
          exact
          path={`${path}/vericar-email`}
          component={VerifyEmailScreen}
        />
      </Switch>
    </div>
  );
};

export default RoutesSign;
