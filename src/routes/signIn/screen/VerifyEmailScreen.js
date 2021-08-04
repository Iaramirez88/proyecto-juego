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
  const [text, setText] = useState("");
  const token = query.get("token");
  const [startCount, setStartCount] = useState(false);
  const api = useRequestApi("auth");
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
    const init = async () => {
      const request = await api.get("/logged", token);
      const { isAuth, code, response } = request;
      if (code === 401 && !isAuth) {
        // token invalido
        return setText("fail");
      }

      setText("success");
      dispatch({
        type: "SET_USER",
        value: { ...response, token },
      });
      setData({ ...response, token });
      setStartCount(true);
      return;
    };

    init();
  }, []);
  return (
    <div>
      {!startCount && <div className="smVerifyBox">Verificando Cuenta</div>}
      {startCount && (
        <div className="smVerifyBox smBoxRedirect">
          {text === "success" && (
            <span>
              Felicitaciones tu cuenta ha sido verificada exitosamente!. Seras
              redirigido a la pagina de inicio en{" "}
              <span style={{ color: "#2c65ac" }}>{counter}</span>
            </span>
          )}
          {text === "fail" && (
            <span>
              Lo sentimos, algo ha ido mal con la verificacion de tu cuenta.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmailScreen;
