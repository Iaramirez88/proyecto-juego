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
//e
import elefanteSound from "../assets/sounds/e/elefante.mp3";
import estrellaSound from "../assets/sounds/e/estrella.mp3";

import enanoSound from "../assets/sounds/e/enano.mp3";
import erizoSound from "../assets/sounds/e/erizo.mp3";
import escaleraSoumd from "../assets/sounds/e/escalera.mp3";

import escarabajoSound from "../assets/sounds/e/escarabajo.mp3";
import espejoSound from "../assets/sounds/e/espejo.mp3";
import esquiarSound from "../assets/sounds/e/esquiar.mp3";
import escorpionSound from "../assets/sounds/e/escorpion.mp3";
import escobaSound from "../assets/sounds/e/escoba.mp3";

//i
import islaSound from "../assets/sounds/i/isla.mp3";
import insectosSound from "../assets/sounds/i/insectos.mp3";
import incendioSound from "../assets/sounds/i/incendio.mp3";
import igluSound from "../assets/sounds/i/iglu.mp3";
import imanSound from "../assets/sounds/i/iman.mp3";
import impresoraSound from "../assets/sounds/i/impresora.mp3";
import iguanaSound from "../assets/sounds/i/iguana.mp3";
import inviernoSound from "../assets/sounds/i/invierno.mp3";
import indigenaSound from "../assets/sounds/i/indigena.mp3";
import imagenSound from "../assets/sounds/i/imageen.mp3";
//o

import osoSound from "../assets/sounds/o/oso.mp3";
import ochoSound from "../assets/sounds/o/ocho.mp3";
import ogroSound from "../assets/sounds/o/ogro.mp3";
import ojosSound from "../assets/sounds/o/ojos.mp3";
import olaSound from "../assets/sounds/o/ola.mp3";
import ollaSound from "../assets/sounds/o/olla.mp3";
import orugaSound from "../assets/sounds/o/oruga.mp3";
import ovejaSound from "../assets/sounds/o/oveja.mp3";
import ovniSound from "../assets/sounds/o/ovni.mp3";
import ostraSound from "../assets/sounds/o/ostra.mp3"

//u
import utilesSound from "../assets/sounds/u/Utiless.mp3";
import uvaSound from "../assets/sounds/u/uva.mp3";
import unicornioSound from "../assets/sounds/u/unicornio.mp3";
import uniformeSound from "../assets/sounds/u/uniforme.mp3";
import unirSound from "../assets/sounds/u/unir.mp3";
import universoSound from "../assets/sounds/u/universo.mp3";
import unnaSound from "../assets/sounds/u/unna.mp3";
import unoSound from "../assets/sounds/u/uno.mp3";
import urnaSound from "../assets/sounds/u/urna.mp3";
import urracaSound from "../assets/sounds/u/urraca.mp3";

//m
import manoSound from "../assets/sounds/m/mano.mp3";
import mapaSound from "../assets/sounds/m/mapa.mp3";
import mariposaSound from "../assets/sounds/m/mariposa.mp3";
import mesaSound from "../assets/sounds/m/mesa.mp3";
import mochilaSound from "../assets/sounds/m/mochila.mp3";
import momiaSound from "../assets/sounds/m/momia.mp3";
import monoSound from "../assets/sounds/m/mono.mp3";
import moraSound from "../assets/sounds/m/mora.mp3";
import motoSound from "../assets/sounds/m/moto.mp3";
import murcielagoSound from "../assets/sounds/m/murcielago.mp3";

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
  //e
  elefanteSound,
  estrellaSound,
  enanoSound,
  erizoSound,
  escaleraSoumd,
  escarabajoSound,
  escobaSound,
  escorpionSound,
  espejoSound,
  esquiarSound,
  //i
  islaSound,
  insectosSound,
  incendioSound,
  igluSound,
  iguanaSound,
  imanSound,
  impresoraSound,
  inviernoSound,
  indigenaSound,
  imagenSound,
  //o
  osoSound,
  ochoSound,
  ogroSound,
  ojosSound,
  olaSound,
  ollaSound,
  orugaSound,
  ovejaSound,
  ovniSound,
  ostraSound,
  //u
  utilesSound,
  uvaSound,
  unicornioSound,
  uniformeSound ,
  unirSound,
  universoSound,
  unnaSound ,
  unoSound ,
  urnaSound ,
  urracaSound,
  resBien,
  RestExcelente,
  RestFelicitaciones,
  ResvMuybien,
  //m
  manoSound,
  mapaSound,
  mariposaSound,
  mesaSound,
  mochilaSound,
  momiaSound,
  monoSound,
  moraSound,
  motoSound,
  murcielagoSound,
};

export const goodAnswer = [siAudio].sort(() => Math.random() - 0.5);
export const wrongAnswer = [noAudio5, noAudio6].sort(() => Math.random() - 0.5);
