import siAudio from "../assets/sounds/sonidoRespuestas/Efecto7Si.mp3";
import noAudio5 from "../assets/sounds/sonidoRespuestas/sonidoNo.mp3";
import noAudio6 from "../assets/sounds/sonidoRespuestas/Efecto2No.mp3";

import resBien from "../assets/sounds/sonidoRespuestas/resBien.mp3";
import RestExcelente from "../assets/sounds/sonidoRespuestas/RestExcelente.mp3";
import RestFelicitaciones from "../assets/sounds/sonidoRespuestas/RestFelicitaciones.mp3";
import ResvMuybien from "../assets/sounds/sonidoRespuestas/ResvMuybien.mp3";

import arbolSound from "../assets/sounds/arbol.mp3";
import arcoirisSound from "../assets/sounds/arcoiris.mp3";
import aranaSound from "../assets/sounds/arana.mp3";
import aveSound from "../assets/sounds/ave.mp3";
import avionSound from "../assets/sounds/avion.mp3";
import AbejaSound from "../assets/sounds/Abeja.mp3";
import anilloSound from "../assets/sounds/anillo.mp3";
import alasSound from "../assets/sounds/alas.mp3";
import astronautaSound from "../assets/sounds/astronauta.mp3";
import elefanteSound from "../assets/sounds/elefante.mp3";
import estrellaSound from "../assets/sounds/estrella.mp3";
import islaSound from "../assets/sounds/isla.mp3";
import insectosSound from "../assets/sounds/insectos.mp3";
import osoSound from "../assets/sounds/oso.mp3";
import utilesSound from "../assets/sounds/utiles.mp3";
import uvaSound from "../assets/sounds/uva.mp3";
import unicornioSound from "../assets/sounds/unicornio.mp3";

export {
  arbolSound,
  arcoirisSound,
  aranaSound,
  aveSound,
  avionSound,
  AbejaSound,
  anilloSound,
  alasSound,
  astronautaSound,
  elefanteSound,
  estrellaSound,
  islaSound,
  insectosSound,
  osoSound,
  utilesSound,
  uvaSound,
  unicornioSound,
  resBien,
  RestExcelente,
  RestFelicitaciones,
  ResvMuybien,
};

export const goodAnswer = [siAudio].sort(() => Math.random() - 0.5);
export const wrongAnswer = [noAudio5, noAudio6].sort(() => Math.random() - 0.5);
