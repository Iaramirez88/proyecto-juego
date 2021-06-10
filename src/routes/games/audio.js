import React, { useContext, useEffect, useState } from "react";
import gsap from "gsap/gsap-core";
import { useHistory } from "react-router-dom";

import Header from "../../components/shared/Header";
import instructions from "../../assets/sounds/moduloEscucha.mp3";
import TitleSound from "../../components/shared/TitleSound";
import { GameContext } from "../../context/GameContext";
import {
  CardComponent,
  BottonAudioComponent,
} from "../../components/games/CardComponent";
import { useResponseAudio } from "../../hooks/usePlaySounds";

import { getData } from "../../utils/mockData/mockModule2";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import backGround from "../../assets/images/fondoModEscGranAlto.svg";
export const AudioScreen = () => {
  useSetBackGround(backGround);

  const [playResponseAudio] = useResponseAudio();
  const [transition, setTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({});
  const { dispatch } = useContext(GameContext);
  const history = useHistory();

  const checkWord = (e, cardState, setCardState) => {
    let word = e.target.alt || e.target.dataset.word;
    let isCorrect = word[0] === state.response;
    let value = isCorrect ? 1 : -1;
    let cardObject = {
      isVisible: true,
      isCorrect: isCorrect,
      typeClass: isCorrect ? "good" : "wrong",
      visited: true,
    };
    if (!cardState.visited) {
      playResponseAudio(isCorrect);
      setCardState(cardObject);
      dispatch({
        type: "ADD_POINTS",
        value,
      });
      setState({
        ...state,
        checked: state.checked + 1,
        spring: isCorrect ? state.spring + 1 : 0,
      });
    }
  };

  useEffect(() => {
    getData().then((data) => {
      console.log(data);
      setState({
        words: data,
        current: data[0],
        response: "a",
        checked: 0,
        position: 0,
        spring: 0,
      });
      setIsLoading(true);
    });
  }, []);

  useEffect(() => {
    if (transition) {
      let tl = gsap.timeline();
      tl.from(".containerBox", {
        duration: 1,
        opacity: 0,
        x: window.innerWidth,
        onComplete: function () {
          setTransition(false);
        },
      });
    }
  }, [transition]);

  useEffect(() => {
    let status = { ...state };
    if (status.spring === 2 || status.checked === 3) {
      if (status.position + 1 < status.words.length) {
        status = {
          ...status,
          checked: parseInt(0),
          position: parseInt(status.position + 1),
          current: status.words[status.position + 1],
          spring: 0,
          verified: false,
        };
        setTransition(true);
        setState(status);
      } else {
        history.push("level-up");
      }
    }
  }, [state, history]);

  if (!isLoading) return <div></div>;

  return (
    <div
      className="containerGame"
      style={transition ? { overflowX: "hidden" } : {}}
    >
      <Header></Header>
      <TitleSound
        title="Selecciona las imágenes que empiezan con la vocal a"
        titleSound={instructions}
        listAudio={[instructions]}
      />
      <div className="containerBox">
        <div className="containerOptions audioBox">
          {state.current.length > 0 &&
            state.current.map((item) => (
              <div
                className="containerAudio"
                key={item.id}
                data-index={item.id}
              >
                <CardComponent
                  styles="cardAudio"
                  image={item.image}
                  alt={item.name}
                  name={item.name}
                  checkWord={checkWord}
                />
                <BottonAudioComponent audio={item.sound} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AudioScreen;
