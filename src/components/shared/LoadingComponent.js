import React from "react";
import loader from "../../assets/images/loader.svg";

const LoadingComponent = () => {
  return (
    <div className="containerLoader">
      <div className="loader"></div>
      <img alt="loader" src={loader} className="barLoader" />
    </div>
  );
};

export default LoadingComponent;
