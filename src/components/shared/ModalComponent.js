import React from "react";
import "../../assets/styles/main.css";

const ModalComponent = ({ children, showModal, closeButton }) => {
  return (
    <div className={`modal ${showModal ? "" : "hidden"}`}>
      <div className="mdButtonContainer">
        <button className="buttonClose" ref={closeButton}>
          X
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ModalComponent;
