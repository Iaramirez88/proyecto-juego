import React from "react";
import Header from "./Header";
import TitleSound from "./TitleSound";

const ContainerGames = ({
  children,
  transition = false,
  audioTitle,
  textTitle,
}) => {
  return (
    <div
      className="containerGame"
      style={transition ? { overflowX: "hidden" } : {}}
    >
      <Header></Header>
      <TitleSound
        title={textTitle}
        titleSound={audioTitle}
        listAudio={[audioTitle]}
      />
      {children}
    </div>
  );
};

export default ContainerGames;
