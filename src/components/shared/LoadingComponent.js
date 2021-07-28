import React, { useEffect, useRef, useState } from "react";
import loader from "../../assets/images/loader.svg";
import { useDimesionClient } from "../../hooks/useDimesion";

const LoadingComponent = () => {
  return (
    <div className="containerLoader">
      <div className="loader"></div>
      <img alt="loader" src={loader} className="barLoader" />
      {/* <div className="barLoader"></div> */}
    </div>
  );
};

export default LoadingComponent;
