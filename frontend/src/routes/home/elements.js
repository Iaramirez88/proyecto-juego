import {
  iconoArmar,
  iconoOtono,
  iconoEscritura,
  iconoEscucha,
  iconopares,
  iconoVocabulario,
  iconoColorear,
} from "../../utils/imagesResources";

import { getDefaultGameActive, getDefaultGameVisible } from "../../config/adminGameDefaults";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Función para verificar si un juego está activo según la configuración del admin
function isGameActive(gameKey) {
  try {
    const config = JSON.parse(localStorage.getItem('adminGameConfig') || '{}');
    return config[gameKey] !== undefined ? config[gameKey] : getDefaultGameActive(gameKey);
  } catch (error) {
    console.error('Error reading admin config:', error);
    return getDefaultGameActive(gameKey);
  }
}

// Función para verificar si un juego está visible según configuración del admin
function isGameVisible(gameKey) {
  try {
    const config = JSON.parse(localStorage.getItem('adminGameVisibilityConfig') || '{}');
    return config[gameKey] !== undefined ? config[gameKey] : getDefaultGameVisible(gameKey);
  } catch (error) {
    console.error('Error reading admin visibility config:', error);
    return getDefaultGameVisible(gameKey);
  }
}

const GAME_KEY_BY_LINK = {
  vocabulario: 'vocabulary-game',
  escucha: 'audio-game',
  pares: 'pair-words',
  'otoño': 'fall-module',
  escritura: 'writing-game',
  armar: 'armar',
};

function filterRowsByVisibility(rows) {
  return (rows || [])
    .map((row) =>
      (row || []).filter((it) => {
        const key = it?.link ? GAME_KEY_BY_LINK[it.link] : null;
        return key ? isGameVisible(key) : true;
      })
    )
    .filter((row) => row.length > 0);
}

var letra = "";

function select(int) {
    if(int ===1){
      letra ="a";
    }if(int===2){
      letra="e";
    }if(int===3){
      letra="i";
    }
    if(int===4){
      letra="o";
    }
    if(int===5){
      letra="u";
    }
    if(int===6){
      letra="m";
    }
    return letra;
  }
export function getVocalAUList() {
  const list = [
    {
      id: getUId(),
      title: "A",
      active: 1,
      list: filterRowsByVisibility([
        [
          {
            id: getUId(),
            title: "Vocabulario",
            img: iconoVocabulario,
            link: "vocabulario",
            active: isGameActive('vocabulary-game') ? 1 : 0,
            letter: "a",
          },
          {
            id: getUId(),
            title: "Escucha",
            img: iconoEscucha,
            link: "escucha",
            active: isGameActive('audio-game') ? 1 : 0,
            letter: "a",
          },
          {
            id: getUId(),
            title: "Pares",
            img: iconopares,
            link: "pares",
            active: isGameActive('pair-words') ? 1 : 0,
            letter: "a",
          },
        ],
        [
          {
            id: getUId(),
            title: "Otoño",
            img: iconoOtono,
            link: "otoño",
            letter: "a",
            active: isGameActive('fall-module') ? 1 : 0,
          },
          {
            id: getUId(),
            title: "Escritura",
            img: iconoEscritura,
            link: "escritura",
            active: isGameActive('writing-game') ? 1 : 0,
            letter: "a",
          },
          {
            id: getUId(),
            title: "Armar",
            img: iconoArmar,
            link: "armar",
            active: isGameActive('armar') ? 1 : 0,
            letter: "a",
          },
        ],
      ]),
    },
    {
      id: getUId(),
      title: "E",
      active: 1,
      list: filterRowsByVisibility([
        [
          {
            id: getUId(),
            title: "Vocabulario",
            img: iconoVocabulario,
            link: "vocabulario",
            letter: "e",
            active: isGameActive('vocabulary-game') ? 1 : 0,
          },
          {
            id: getUId(),
            title: "Escucha",
            img: iconoEscucha,
            link: "escucha",
            letter: "e",
            active: isGameActive('audio-game') ? 1 : 0,
          },
          {
            id: getUId(),
            title: "Pares",
            img: iconopares,
            link: "pares",
            letter: "e",
            active: isGameActive('pair-words') ? 1 : 0,
          },
        ],
        [
          {
            id: getUId(),
            title: "Otoño",
            img: iconoOtono,
            link: "otoño",
            letter: "e",
            active: isGameActive('fall-module') ? 1 : 0,
          },
          {
            id: getUId(),
            title: "Escritura",
            img: iconoEscritura,
            link: "escritura",
            letter: "e",
            active: isGameActive('writing-game') ? 1 : 0,
          },
        ],
      ]),
    },
    {
      id: getUId(),
      title: "I",
      active: 1,
      list: filterRowsByVisibility([
        [
          {
            id: getUId(),
            title: "Vocabulario",
            img: iconoVocabulario,
            link: "vocabulario",
            letter: "i",
            active: isGameActive('vocabulary-game') ? 1 : 0,
          },
          {
            id: getUId(),
            title: "Escucha",
            img: iconoEscucha,
            link: "escucha",
            letter: "i",
            active: isGameActive('audio-game') ? 1 : 0,
          },
          {
            id: getUId(),
            title: "Pares",
            img: iconopares,
            link: "pares",
            letter: "i",
            active: isGameActive('pair-words') ? 1 : 0,
          },
        ],
        [
          {
            id: getUId(),
            title: "Otoño",
            img: iconoOtono,
            link: "otoño",
            letter: "i",
            active: isGameActive('fall-module') ? 1 : 0,
          },
          {
            id: getUId(),
            title: "Escritura",
            img: iconoEscritura,
            link: "escritura",
            letter: "i",
            active: isGameActive('writing-game') ? 1 : 0,
          },
        ],
      ]),
    },
    {
      id: getUId(),
      title: "O",
      active: 1,
      list: filterRowsByVisibility([
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario, link: "vocabulario", letter: "o", active: isGameActive('vocabulary-game') ? 1 : 0 },
          { id: getUId(), title: "Escucha", img: iconoEscucha, link: "escucha", letter: "o", active: isGameActive('audio-game') ? 1 : 0 },
          { id: getUId(), title: "Pares", img: iconopares, link: "pares", letter: "o", active: isGameActive('pair-words') ? 1 : 0 },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono, link: "otoño", letter: "o", active: isGameActive('fall-module') ? 1 : 0 },
          { id: getUId(), title: "Escritura", img: iconoEscritura, link: "escritura", letter: "o", active: isGameActive('writing-game') ? 1 : 0 },
        ],
      ]),
    },
    {
      id: getUId(),
      title: "U",
      active: 1,
      list: filterRowsByVisibility([
        [
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario, link: "vocabulario", letter: "u", active: isGameActive('vocabulary-game') ? 1 : 0 },
          { id: getUId(), title: "Escucha", img: iconoEscucha, link: "escucha", letter: "u", active: isGameActive('audio-game') ? 1 : 0 },
          { id: getUId(), title: "Pares", img: iconopares, link: "pares", letter: "u", active: isGameActive('pair-words') ? 1 : 0 },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono, link: "otoño", letter: "u", active: isGameActive('fall-module') ? 1 : 0 },
          { id: getUId(), title: "Escritura", img: iconoEscritura, link: "escritura", letter: "u", active: isGameActive('writing-game') ? 1 : 0 },
        ],
      ]),
    },
  ];

  return list;
}

// Compat: export previo como const (snapshot). Home ahora usa la función.
export const vocalAUList = getVocalAUList();

// NP unidad 2
export function getLetterM() {
  return [
    {
      id: getUId(),
      title: "M",
      active: 1,
      list: filterRowsByVisibility([
        [
          { id: getUId(), title: "Pares", img: iconopares, link: "pares", letter: "m", active: isGameActive('pair-words') ? 1 : 0 },
          { id: getUId(), title: "Vocabulario", img: iconoVocabulario, link: "vocabulario", letter: "m", active: isGameActive('vocabulary-game') ? 1 : 0 },
          { id: getUId(), title: "Escucha", img: iconoEscucha, link: "escucha", letter: "m", active: isGameActive('audio-game') ? 1 : 0 },
        ],
        [
          { id: getUId(), title: "Otoño", img: iconoOtono, link: "otoño", letter: "m", active: isGameActive('fall-module') ? 1 : 0 },
          { id: getUId(), title: "Escritura", img: iconoEscritura, link: "escritura", letter: "m", active: isGameActive('writing-game') ? 1 : 0 },
          { id: getUId(), title: "Armar", img: iconoArmar, link: "armar", letter: "m", active: isGameActive('armar') ? 1 : 0 },
        ],
      ]),
    },
  ];
}

// Compat: export previo como const (snapshot). Home ahora usa la función.
export const LetterM = getLetterM();

function getUId() {
  return Math.floor(Math.random() * new Date().getTime());
}

