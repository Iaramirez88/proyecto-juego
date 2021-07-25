import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ButtonDiv from "../../../components/Buttons";
import btnNext from "../../../assets/images/botonNext.svg";

const SelectTypeTutor = () => {
  const [state, setState] = useState(-1);
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
    </div>
  );
};

export default SelectTypeTutor;
