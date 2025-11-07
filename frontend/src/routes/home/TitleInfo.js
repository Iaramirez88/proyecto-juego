import React from "react";

const TitleInfo = ({ title }) => {
  return (
    <div className="suBoxHeader">
      <div className="suTitleCuenta">{title}</div>
      <a
        href="https://www.artworkoala.com/preguntas-frecuentas/"
        target="_blank"
        className="suInfoIcon"
        rel="noreferrer"
      >
        ?
      </a>
    </div>
  );
};

export default TitleInfo;
