import React, { useEffect, useRef } from "react";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import logoKoala from "../../assets/images/logoInicalAnimado.svg";
import { useDimesions } from "../../hooks/useDimesion";
import "../../assets/styles/sign-module.css";
import gsap from "gsap/gsap-core";
import RoutesSign from "./routes";
import { useHistory } from "react-router";

const SignInModule = () => {
  useSetBackGround(null);
  const dimension = useDimesions();
  const containerRef = useRef(null);
  const titleKoalaRef = useRef(null);
  const { pathname } = useHistory().location;
  const history = useHistory();

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
        {pathname !== "/sesion/terminos" && (
          <div className="row50 suLogo">
            <img
              alt="koala-logo"
              id="sign-logo-koala"
              className="signLogoKoala"
              src={logoKoala}
              onClick={() => history.push("/")}
            />
            <div className="signTitleKoala" ref={titleKoalaRef}>
              <p className="welcomeTextLogo">
                <span>BIENVENIDOS</span>
              </p>
              <p className="titleAppLogo">
                <span>ARTWORKOALA</span>
                <span> PLAY</span>
              </p>
            </div>
          </div>
        )}
        <div className="row50">
          <RoutesSign></RoutesSign>
        </div>
      </div>
    </div>
  );
};

export default SignInModule;
