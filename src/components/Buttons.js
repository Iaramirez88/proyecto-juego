import React from "react";

const ButtonDiv = ({ classStyle, handler, title }) => {
  return (
    <div className={classStyle} onClick={handler}>
      {title}
    </div>
  );
};

export default ButtonDiv;
