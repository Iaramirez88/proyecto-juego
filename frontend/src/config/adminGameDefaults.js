// Defaults globales para el estado ACTIVO de juegos (adminGameConfig)
// true  => juego habilitado
// false => juego deshabilitado

export const ADMIN_GAME_DEFAULT_ACTIVE = {
  "pair-words": true,
  "vocabulary-game": true,
  "audio-game": true,

  // Por defecto apagados
  "fall-module": false,
  "writing-game": false,
  "armar": false,
};

// Defaults globales para VISIBILIDAD (adminGameVisibilityConfig)
// true  => juego visible
// false => juego oculto
export const ADMIN_GAME_DEFAULT_VISIBLE = {
  "pair-words": true,
  "vocabulary-game": true,
  "audio-game": true,

  // Por defecto ocultos
  "fall-module": false,
  "writing-game": false,
  "armar": false,
};

export function getDefaultGameActive(gameId) {
  return Object.prototype.hasOwnProperty.call(ADMIN_GAME_DEFAULT_ACTIVE, gameId)
    ? ADMIN_GAME_DEFAULT_ACTIVE[gameId]
    : true;
}

export function getDefaultGameVisible(gameId) {
  return Object.prototype.hasOwnProperty.call(ADMIN_GAME_DEFAULT_VISIBLE, gameId)
    ? ADMIN_GAME_DEFAULT_VISIBLE[gameId]
    : true;
}

export function getAdminGameConfigWithDefaults(storedConfig) {
  return {
    ...ADMIN_GAME_DEFAULT_ACTIVE,
    ...(storedConfig || {}),
  };
}

export function getAdminGameVisibilityConfigWithDefaults(storedConfig) {
  return {
    ...ADMIN_GAME_DEFAULT_VISIBLE,
    ...(storedConfig || {}),
  };
}
