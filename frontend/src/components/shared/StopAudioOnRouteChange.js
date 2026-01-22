import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { stopAllAudioPlayback } from "../../hooks/usePlaySounds";

export default function StopAudioOnRouteChange() {
  const history = useHistory();

  useEffect(() => {
    // Stop on every navigation (push/replace/back/forward)
    const unlisten = history.listen(() => {
      stopAllAudioPlayback();
    });

    // Extra safety: when tab/app goes to background or is being closed
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stopAllAudioPlayback();
      }
    };
    const onPageHide = () => stopAllAudioPlayback();

    try {
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pagehide", onPageHide);
      window.addEventListener("beforeunload", onPageHide);
    } catch (e) {}

    return () => {
      try {
        unlisten && unlisten();
      } catch (e) {}
      try {
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", onPageHide);
        window.removeEventListener("beforeunload", onPageHide);
      } catch (e) {}
      stopAllAudioPlayback();
    };
  }, [history]);

  return null;
}
