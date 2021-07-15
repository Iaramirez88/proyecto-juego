import React, { useContext, useEffect, useRef, useState } from "react";
import { useDimesions } from "../../hooks/useDimesion";
import { iconOpenModule, iconCloseModule } from "../../utils/imagesResources";
import "../../assets/styles/home.css";
import building from "../../assets/images/enConstruccion.svg";

import { useHistory } from "react-router-dom";
import { useRamdonId } from "../../hooks/useRamdonId";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GameContext } from "../../context/GameContext";

const HomeGridComponent = ({ mainTitle, list, mainImage, moduleOpen }) => {
  const screen = useDimesions();
  const [getId] = useRamdonId();
  const [isOpen, setIsOpen] = useState(false);
  const { setDataLocal } = useLocalStorage("module");
  const panelRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const gridCardRef = useRef(null);
  const { stateContext, dispatch } = useContext(GameContext);

  useEffect(() => {
    const panel = panelRef.current;
    const { height } = gridCardRef.current.getBoundingClientRect();
    console.log(panelRef.current.scrollHeight);
    panel.style.maxHeight = isOpen ? height + "px" : 0;
  }, [isOpen]);

  useEffect(() => {
    if (screen.width > 992) setIsOpen(true);
  }, [screen]);

  const openAccordion = () => {
    let saveModule = !isOpen ? moduleOpen : -1;
    setDataLocal("name", saveModule);
    dispatch({
      type: "SET_ACCORDION",
      value: saveModule,
    });
    setIsOpen(!isOpen);
  };

  return (
    <div className="moduleContainer">
      <div className="letterTitle">
        <div className="rowLetterTitle">
          <img alt={mainTitle} width="40px" height="auto" src={mainImage} />
          <p>{mainTitle}</p>
        </div>
        <img
          className="iconAccordion"
          alt="iconBack"
          width="40px"
          height="auto"
          src={isOpen ? iconOpenModule : iconCloseModule}
          onClick={() => openAccordion()}
        />
      </div>
      <div className="panel" ref={panelRef}>
        <div ref={gridCardRef} className="gridCardList">
          {list.map((item) => (
            <div
              className={`cardListGame ${item.especial ? "cardEspecial" : ""}`}
              key={item.id}
            >
              <h2>{item.title}</h2>
              {item.list.map((e) => (
                <div className="rowList" key={getId()}>
                  {e.map((it) => (
                    <IconItem
                      key={it.id}
                      styles={`itemList ${it.link ? "" : "disabled"}`}
                      title={it.title}
                      img={it.img}
                      link={it.letter ? `${it.link}/${it.letter}` : it.link}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
          <div className="homeBuilding">
            <img alt="building" src={building} />
          </div>
        </div>
        <img
          className="iconAccordion iconCloseBotton"
          alt="iconBack"
          width="40px"
          height="auto"
          src={isOpen ? iconOpenModule : iconCloseModule}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
};

export const IconItem = ({ img, title, styles, link }) => {
  const history = useHistory();
  return (
    <div className={styles}>
      <img
        onClick={link ? () => history.push(link) : null}
        alt={title.toLowerCase()}
        width="40px"
        height="auto"
        src={img}
      />
      <p>{title}</p>
    </div>
  );
};

export default HomeGridComponent;
