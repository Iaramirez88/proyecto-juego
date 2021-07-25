import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import ButtonDiv from "../../../components/Buttons";

const SelectTypeUser = () => {
  const history = useHistory();
  let { url } = useRouteMatch();

  const handlerButton = (id) => {
    history.push(`${url}/${id}`);
  };

  return (
    <div className="smBoxTypes">
      <ButtonDiv
        classStyle="smButton"
        handler={() => handlerButton("tutor")}
        title="TUTOR"
      />
      <ButtonDiv
        classStyle="smButton"
        handler={() => handlerButton("estudiante")}
        title="ESTUDIANTE"
      />
    </div>
  );
};

export default SelectTypeUser;
