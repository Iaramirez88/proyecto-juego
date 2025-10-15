import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { iconBack, logo } from "../../utils/imagesResources";
import { useHistory } from "react-router-dom";

const Header = ({ onGoBack }) => {
  const { stateContext } = useContext(GameContext);
  const history = useHistory();

  return (
    <div>
      <header>
        <div className="headerBoxIcon">
          <img
            onClick={onGoBack ? onGoBack : () => history.push("/")}
            className="iconBack"
            alt="iconBack"
            src={iconBack}
          />
        </div>
        <div className="headerBoxIcon headerRightBox">
          <div className="pointsBox">
            <p>P{stateContext.points}</p>
          </div>
          <img src={logo} width="width: 5em" alt="logo" />
        </div>
      </header>
    </div>
  );
};

export default Header;
