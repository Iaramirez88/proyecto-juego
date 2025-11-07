import gsap from "gsap/gsap-core";
import { useEffect, useState } from "react";

export const useTransitionGame = (container) => {
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    if (transition) {
      let tl = gsap.timeline();
      tl.from(container, {
        duration: 1,
        opacity: 0,
        x: window.innerWidth,
        onComplete: function () {
          setTransition(false);
        },
      });
    }
  }, [transition, container]);

  return [transition, setTransition];
};

export const useDisplayGame = (container) => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (display) {
      let tl = gsap.timeline();
      tl.from(container, {
        duration: 1,
        opacity: 0,
        y: window.innerHeight,
      });
    }
  }, [display, container]);

  return [display, setDisplay];
};
