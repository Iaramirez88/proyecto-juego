import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ButtonDiv from "../../../components/Buttons";
import btnNext from "../../../assets/images/botonNext.svg";

const SelectTypeTutor = () => {
  const [state, setState] = useState(-1);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState(false);
  const { url } = useRouteMatch();
  const history = useHistory();

  const onSubmit = () => {
    if (state === -1) {
      setError(true);
      return;
    }
    history.push(`${url}/${state}`);
  };

  const onSelectType = () => {
    setError(false);
    setState(0);
  };

  return (
    <div>
      {terms && (
        <div>
          <ButtonDiv
            title="Tutor Padre - 2 Niños"
            classStyle={`smButton smButtonOption ${
              state === 0 ? "selected" : ""
            }`}
            handler={onSelectType}
          />
          <ButtonDiv
            title="Tutor Docente - 20 Est"
            classStyle={`smButton smButtonOption disabled ${
              state === 1 ? "selected" : ""
            }`}
          />
          <ButtonDiv
            title="Tutor Docente - 40 Est"
            classStyle={`smButton smButtonOption disabled ${
              state === 2 ? "selected" : ""
            }`}
          />
          <div style={{ position: "relative" }}>
            <img
              onClick={onSubmit}
              alt="btn-next"
              src={btnNext}
              className="smBtnNext"
            />
          </div>
          {error && (
            <p className="errorText" style={{ position: "initial" }}>
              Debe seleccionar un tipo de plan
            </p>
          )}
        </div>
      )}
      {!terms && (
        <div className="snTerms">
          <h1>Advertencia</h1>
          <p>
            Teniendo en cuenta que esta aplicación es para uso de niños menores
            de edad, es necesario que se registre un adulto responsable para que
            pueda tener control del buen uso de la aplicación y verificar las
            lecciones estudiadas por sus hijos o estudiantes.
          </p>
          <div style={{ position: "relative" }}>
            <img
              onClick={() => setTerms(true)}
              alt="btn-next"
              src={btnNext}
              className="smBtnNext"
            />
          </div>
          <p className="snFooter">
            Al registrarte en ARTWORKOALA PLAY aceptas nuestros Términos y
            Politica de Privacidad
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectTypeTutor;
