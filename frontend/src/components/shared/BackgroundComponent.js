import React, { useEffect, useState } from "react";

const BackgroundComponent = ({ source }) => {
  const [screen, setScreen] = useState(getScreen());

  useEffect(() => {
    const updateScreenHeight = () => {
      setScreen(getScreen());
    };

    window.addEventListener("resize", updateScreenHeight);

    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, []);

  return (
    <div>
      <img src={source} alt="backgroundimage" className="backgroundImage" />
    </div>
  );
};

function getScreen() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default BackgroundComponent;
