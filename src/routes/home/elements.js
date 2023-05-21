import {
  iconoArmar,
  iconoOtono,
  iconoEscritura,
  iconoEscucha,
  iconopares,
  iconoVocabulario,
  iconoColorear,
} from "../../utils/imagesResources";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var letra = "";

function select(int) {
    if(int ==1){
      letra ="a";
    }if(int==2){
      letra="e";
    }if(int==3){
      letra="i";
    }
    if(int==4){
      letra="o";
    }
    if(int==5){
      letra="u";
    }
    if(int==6){
      letra="m";
    }
    return letra;
  }
export const vocalAUList = [
  {
    id: getUId(),
    title: "A",
    active: 1,
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
          link: "vocabulario",
          active: 1,
          letter: "a",
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          active: 1,
          letter: "a",
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
          link: "pares",
          active: 1,
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
          active: 1,
        },
        {
          id: getUId(),
          title: "Escritura",
          img: iconoEscritura,
          link: "escritura",
          active: 1,
          letter: "a",
        },
        {
          id: getUId(),
          title: "Armar",
          img: iconoArmar,
          link: "armar",
          active: 1,
          letter: "a",
        },
      ],
    ],
  },
  {
    id: getUId(),
    title: "E",
    active: 1,
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
          link: "vocabulario",
          letter: "e",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          letter: "e",
          active: 1,
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
          link: "pares",
          letter: "e",
          active: 1,
        },
      ],
      [
        {
          id: getUId(),
          title: "Otoño",
          img: iconoOtono,
          link: "otoño",
          letter: "e",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escritura",
          img: iconoEscritura,
          link: "escritura",
          letter: "e",
          active: 1,
        },
        // NP-no se visualice armar
        // { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
    id: getUId(),
    title: "I",
    active: 1,
    list: [
      [
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
          link: "vocabulario",
          letter: "i",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          letter: "i",
          active: 1,
        },
        {
          id: getUId(),
          title: "Pares",
          img: iconopares,
          link: "pares",
          letter: "i",
          active: 1,
        },
      ],
      [
        {
          id: getUId(),
          title: "Otoño",
          img: iconoOtono,
          link: "otoño",
          letter: "i",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escritura",
          img: iconoEscritura,
          link: "escritura",
          letter: "i",
          active: 1,
        },
                // NP-no se visualice armar
        // { id: getUId(), title: "Armar", img: iconoArmar },
      ],
    ],
  },
  {
     id: getUId(),
    title: "O",
    active: 1,
    list: [
     [
      { id: getUId(), title: "Vocabulario", img: iconoVocabulario, link: "vocabulario", letter: "o", active: 1},
       { id: getUId(), title: "Escucha", img: iconoEscucha,link:"escucha", letter: "o", active: 1},
       { id: getUId(), title: "Pares", img: iconopares,link:"pares", letter: "o", active: 1},
       ],
       [
         { id: getUId(), title: "Otoño", img: iconoOtono,link:"otoño", letter: "o", active: 1 },
        { id: getUId(), title: "Escritura", img: iconoEscritura,link:"escritura", letter: "o", active: 1 },
                // NP-no se visualice armar
        // { id: getUId(), title: "Armar", img: iconoArmar },
       ],
     ],
   },
   {
     id: getUId(),
     title: "U",
     active:1,
    list: [
      [
        { id: getUId(), title: "Vocabulario", img: iconoVocabulario,link: "vocabulario", letter:"u", active:1 },
         { id: getUId(), title: "Escucha", img: iconoEscucha,link:"escucha", letter:"u", active:1 },
         { id: getUId(), title: "Pares", img: iconopares,link:"pares", letter:"u",active:1 },
       ],
       [
         { id: getUId(), title: "Otoño", img: iconoOtono,link:"otoño", letter:"u",active:1 },
         { id: getUId(), title: "Escritura", img: iconoEscritura,link:"escritura", letter:"u",active:1 },
                 // NP-no se visualice armar
        //  { id: getUId(), title: "Armar", img: iconoArmar },
       ],
     ],
   },

   


  /* {
     id: getUId(),
     title: "5v",
     active:0,
     especial: true,
     list: [
       [
        // { id: getUId(), title: "Colorear", img: iconoColorear },
         { id: getUId(), title: "Vocabulario", img: iconoVocabulario, link:"vocabulario",letter:select(getRandomInt(1,5)), active:1 },
         { id: getUId(), title: "Pares", img: iconopares,link:"pares",letter:select(getRandomInt(1,5)), active:1 },
       ],
       [
         { id: getUId(), title: "Otoño", img: iconoOtono,link:"otoño",letter:select(getRandomInt(1,5)), active:1 },
         { id: getUId(), title: "Escritura", img: iconoEscritura,link:"escritura",letter:select(getRandomInt(1,5)), active:1 },
         { id: getUId(), title: "Armar", img: iconoArmar },
       ],
     ],
   },*/
];

// NP unidad 2
export const LetterM = [
  {
    id: getUId(),
    title: "M",
    active: 1,
    list: [
      [
        { id: getUId(), title: "Pares", img: iconopares,link:"pares", letter:"m",active:1 },
        {
          id: getUId(),
          title: "Vocabulario",
          img: iconoVocabulario,
          link: "vocabulario",
          active: 1,
          letter: "m",
        },
        {
          id: getUId(),
          title: "Escucha",
          img: iconoEscucha,
          link: "escucha",
          active: 1,
          letter: "m",
        },
              ],
      [
        {
          id: getUId(),
          title: "Otoño",
          img: iconoOtono,
          link: "otoño",
          letter: "m",
          active: 1,
        },
        {
          id: getUId(),
          title: "Escritura",
          img: iconoEscritura,
          link: "escritura",
          active: 1,
          letter: "m",
        },
        {
          id: getUId(),
          title: "Armar",
          img: iconoArmar,
          link: "armar",
          active: 0,
          letter: "m",
        },
      ],
    ],
  },

];

function getUId() {
  return Math.floor(Math.random() * new Date().getTime());
}

