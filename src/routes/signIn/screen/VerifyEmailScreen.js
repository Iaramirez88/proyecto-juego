import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { GameContext } from "../../../context/GameContext";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useRequestApi } from "../../../hooks/useRequesApi";

const VerifyEmailScreen = () => {
  let query = new URLSearchParams(useLocation().search);
  const { dispatch } = useContext(GameContext);
  const { setData } = useLocalStorage("user");
  const [counter, setCounter] = useState(5);
  const token = query.get("token");
  const [startCount, setStartCount] = useState(false);
  const api = useRequestApi();
  const history = useHistory();

  useEffect(() => {
    if (startCount) {
      let timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

      if (counter === 0) {
        setStartCount(false);
        history.replace({ pathname: "/mi-cuenta" });
      }
      return () => clearInterval(timer);
    }
  }, [counter, startCount]);

  useEffect(() => {
    const request = api.get("auth/logged", token);

    request.then((response) => {
      if (response.isAuth) {
        dispatch({
          type: "SET_USER",
          data: { token, id: response.id, idtipotutor: response.idtipotutor },
        });
        setData({ token, id: response.id, idtipotutor: response.idtipotutor });
        setStartCount(true);
      } else {
        // algo ha salido mal con la verificacion
      }
    });
  }, []);
  return (
    <div>
      {!startCount && <div className="smVerifyBox">Verificando Cuenta</div>}
      {startCount && (
        <div className="smVerifyBox smBoxRedirect">
          <span>
            Felicitaciones tu cuenta ha sido verificada exitosamente!. Seras
            redirigido a la pagina de inicio en{" "}
            <span style={{ color: "#2c65ac" }}>{counter}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailScreen;
