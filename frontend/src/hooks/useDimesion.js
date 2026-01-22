import { useEffect, useState } from "react";

export function useDimesions() {
  const [dimesion, setDimesion] = useState(getDimesion());

  useEffect(() => {
    const resize = () => {
      setDimesion(getDimesion());
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return dimesion;
}

export const useDimesionClient = () => {
  const [dimension, setDimension] = useState(getDimesionClient());
  useEffect(() => {
    const resize = () => {
      setDimension(getDimesionClient());
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return dimension;
};

export const useSetScrollPosition = () => {
  useEffect(() => {
    if (window.scrollY > 0) {
      window.scroll(0, 0);
    }
  }, []);
};

const getDimesionClient = () => {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
};

function getDimesion() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
