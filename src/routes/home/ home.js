import React, { useEffect, useRef, useState } from "react";
import { useDimesions } from "../../hooks/useDimesion";
import { iconOpenModule, iconCloseModule } from "../../utils/imagesResources";
import "../../assets/styles/home.css";

import { useHistory } from "react-router-dom";
import { useRamdonId } from "../../hooks/useRamdonId";

const HomeGridComponent = ({ mainTitle, list, mainImage }) => {
  const screen = useDimesions();
  const [getId] = useRamdonId();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  // useEffect(() => {
  //   const slider = document.querySelector(".scroll");
  //   let isDown = false;
  //   let startX;
  //   let scrollLeft;

  //   slider.addEventListener("mousedown", (e) => {
  //     isDown = true;
  //     slider.classList.add("active");
  //     startX = e.pageX - slider.offsetLeft;
  //     scrollLeft = slider.scrollLeft;
  //   });
  //   slider.addEventListener("mouseleave", () => {
  //     isDown = false;
  //     slider.classList.remove("active");
  //   });
  //   slider.addEventListener("mouseup", () => {
  //     isDown = false;
  //     slider.classList.remove("active");
  //   });
  //   slider.addEventListener("mousemove", (e) => {
  //     if (!isDown) return;
  //     e.preventDefault();
  //     const x = e.pageX - slider.offsetLeft;
  //     const walk = x - startX;
  //     slider.scrollLeft = scrollLeft - walk;
  //     console.log(slider);
  //   });
  // }, []);

  useEffect(() => {
    const panel = panelRef.current;
    panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : 0;
  }, [isOpen]);

  useEffect(() => {
    if (screen.width > 992) setIsOpen(true);
  }, [screen]);

  return (
    <div>
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
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div className="panel" ref={panelRef}>
        <div className="gridCardList">
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
