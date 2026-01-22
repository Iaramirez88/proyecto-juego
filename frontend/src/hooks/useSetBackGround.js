import { useEffect } from "react";

export function useSetBackGround(background, color = "white") {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
    document.documentElement.style.backgroundImage = `url(${background})`;
    document.body.style.backgroundColor = color;
  });
}
