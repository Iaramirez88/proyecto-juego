// Config central: umbral mínimo de accuracy para mostrar el botón "Continuar"
// accuracy va en porcentaje (0-100). Si el juego no está en el mapa, se usa el default.

export const DEFAULT_MIN_ACCURACY_TO_CONTINUE = 100;

// key = nombre del juego en la URL (ej: /pares/a => "pares")
export const MIN_ACCURACY_TO_CONTINUE_BY_GAME = {
  pares: 25, // permite continuar con hasta 75% de error
  // vocabulario: 100,
  // escucha: 100,
  // "otoño": 100,
  // escritura: 100,
};

export function getMinAccuracyToContinueForGame(gameName) {
  if (!gameName) return DEFAULT_MIN_ACCURACY_TO_CONTINUE;
  const key = String(gameName).toLowerCase();
  const val = MIN_ACCURACY_TO_CONTINUE_BY_GAME[key];
  return typeof val === "number" ? val : DEFAULT_MIN_ACCURACY_TO_CONTINUE;
}
