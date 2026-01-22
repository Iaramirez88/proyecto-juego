import { useEffect, useState } from "react";

export const useSetTimer = (handler, timeStamp) => {
  const [timer, setTimer] = useState(false);
  useEffect(() => {
    let counter;
    if (timer) {
      counter = setTimeout(handler, timeStamp);

      return () => {
        clearTimeout(counter);
      };
    }
  }, [timer, handler, timeStamp]);

  return [setTimer];
};
