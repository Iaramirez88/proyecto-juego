import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ButtonDiv from "../../../components/Buttons";
import btnNext from "../../../assets/images/botonNext.svg";
import { useRequestApi } from "../../../hooks/useRequesApi";
import { useLoading } from "../../../hooks/useLoading";

const SelectTypeTutor = () => {
  const [state, setState] = useState(-1);
  const [error, setError] = useState(false);
  const [typeTutor, setTypeTutor] = useState([]);
  const { url } = useRouteMatch();
  const history = useHistory();
  const apiUser = useRequestApi("user");
  const setLoader = useLoading();

  const onSubmit = () => {
    if (state === -1) {
      setError(true);
      return;
    }
    history.push(`${url}/${state}`);
  };

  const onSelectType = (idtutor) => {
    setError(false);
    setState(idtutor);
  };

  useEffect(() => {
    const init = async () => {
      setLoader(true);
      let { response } = await apiUser.get("tutors");
      setLoader(false);
      if (response.code !== 500) {
        setTypeTutor(response);
      }
    };

    init();
  }, []);

  return (
    <div>
      {typeTutor.length === 0 && <div></div>}
      {typeTutor.length > 0 && (
        <div>
          {typeTutor.map((item, index) => (
            <ButtonDiv
              key={index}
              title={item.nombre_tipo_tutor}
              classStyle={`smButton smButtonOption ${
                state === item.id_tipo_tutor ? "selected" : ""
              } ${item.nombre_tipo_tutor === "Tutor Padre" ? "" : "disabled"}`}
              handler={() =>
                item.nombre_tipo_tutor === "Tutor Padre"
                  ? onSelectType(item.id_tipo_tutor)
                  : {}
              }
            />
          ))}
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
    </div>
  );
};

export default SelectTypeTutor;
