import React, { useEffect, useRef, useState } from "react";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import logoKoala from "../../assets/images/logoInicalAnimado.svg";
import { useDimesions } from "../../hooks/useDimesion";
import "../../assets/styles/sign-module.css";
import gsap from "gsap/gsap-core";
import RoutesSign from "./routes";

const SignInModule = () => {
  useSetBackGround(null);
  const dimension = useDimesions();

  const containerRef = useRef(null);
  const titleKoalaRef = useRef(null);

  useEffect(() => {
    let container = containerRef.current;
    if (container) {
      container.style.height = `${dimension.height}px`;
    }
  }, [dimension]);

  useEffect(() => {
    let timer;
    let titleKoala = titleKoalaRef.current;
    if (titleKoala && false) {
      timer = setTimeout(() => {
        let { width, height } = dimension;
        let tl = gsap.timeline();
        gsap.to("#sign-logo-koala", {
          duration: 1,
          scale: 0.5,
        });

        tl.to(titleKoala, {
          duration: 1,
          x: width * -1,
          onComplete: () => {
            titleKoala.style.display = "none";
          },
        });
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="containerSign" ref={containerRef}>
      <div className="rowSign" id="first-screen">
        <img alt="koala-logo" id="sign-logo-koala" src={logoKoala} />
        <div ref={titleKoalaRef}>
          <p>ARTWORKOALA</p>
          <p>PLAY</p>
        </div>
        <RoutesSign></RoutesSign>
      </div>
    </div>
  );
};

export default SignInModule;
