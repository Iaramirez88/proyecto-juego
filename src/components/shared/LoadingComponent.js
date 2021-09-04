import React from "react";
import loader from "../../assets/images/loader.svg";

const LoadingComponent = ({ isLoading }) => {
  return (
    <div className={`containerLoader ${isLoading ? "active" : "hidden"}`}>
      <div className="loader"></div>
      <img alt="loader" src={loader} className="barLoader" />
    </div>
  );
};

export default LoadingComponent;
