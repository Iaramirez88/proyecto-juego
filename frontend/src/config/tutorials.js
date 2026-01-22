// Control global de tutoriales (modales + dedos) en los juegos.
// Por defecto están DESHABILITADOS temporalmente.
// Para re-habilitarlos: crear un .env con REACT_APP_ENABLE_TUTORIALS=true
// (y reiniciar el servidor de desarrollo / rebuild).

export const ENABLE_TUTORIALS = String(process.env.REACT_APP_ENABLE_TUTORIALS).toLowerCase() === "true";
