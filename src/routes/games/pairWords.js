import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import background from "../../assets/images/fondoModPares.svg";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import audioTitle from "../../assets/sounds/intructions/modArmarPares.mp3";
import { getModuleData } from "../../utils/mockData/modPairs";
import { GameContext } from "../../context/GameContext";
import { useResponseAudio } from "../../hooks/usePlaySounds";

import cover from "../../assets/images/cuadroMorado.svg";
import "../../assets/styles/pair-module.css";
import Header from "../../components/shared/Header";
import TitleSound from "../../components/shared/TitleSound";
import PairInstructions from "../../components/games/PairModule/PairInstructions";

const PairWords = () => {
  useSetBackGround(background);
  const { idLetter } = useParams();
  const { dispatch } = useContext(GameContext);
  const [state, setState] = useState({
    open: 0,
    cards: [],
    correct: 4,
    loading: false,
  });
  const history = useHistory();
  const [playResponseAudio] = useResponseAudio();

  const compareWords = (word1, word2) => {
    return word1.toLowerCase() === word2.toLowerCase();
  };

  const checkWords = () => {
    const { cards } = state;
    const list = cards.reduce((prev, item) => {
      if (item.show && !item.check) prev.push(item);
      return prev;
    }, []);
    if (list.length < 2) return;
    let isCorrect = compareWords(list[0].name, list[1].name);

    setTimeout(() => {
      if (isCorrect) {
        list[0].check = true;
        list[1].check = true;
      }
      const cardState = {
        ...state,
        open: 0,
        correct: isCorrect ? state.correct - 1 : state.correct,
        cards: isCorrect
          ? [...cards]
          : state.cards.map((item) => ({ ...item, show: false })),
      };
      playResponseAudio(isCorrect);
      setState(cardState);
    }, 1500);

    dispatch({
      type: "ADD_POINTS",
      value: isCorrect ? 3 : -1,
    });
  };

  const selectCard = (index) => {
    let { cards, open } = state;
    if (open <= 1 && !cards[index].show) {
      cards[index].show = true;
      setState({ ...state, open: state.open + 1, cards });
      if (open === 1) checkWords();
      return;
    }
  };

  useEffect(() => {
    const { correct } = state;
    if (!state.loading) {
      setState(initialState(idLetter));
    }
    if (correct === 0) {
      history.push("/level-up");
    }
  }, [state]);

  if (!state.loading) return <div></div>;
  return (
    <div className="containerGame">
      <Header></Header>
      <TitleSound
        title="Arma pares"
        titleSound={audioTitle}
        listAudio={[audioTitle]}
        ModalChild={PairInstructions}
        module="pair"
      />
      <div className="containerBox">
        <div className="pwContainerItems">
          <Board cards={state.cards} selectCard={selectCard} />
        </div>
      </div>
    </div>
  );
};

const Board = ({ cards, selectCard }) => {
  let list = [];
  const rows = cards.reduce((prev, item, index) => {
    list.push(item);
    if ((index + 1) % 4 === 0) {
      prev.push(list);
      list = [];
    }
    return prev;
  }, []);

  return rows.map((item, index) => (
    <div className="pwRow row" key={index}>
      {item.map((item, i) => (
        <CardItem
          key={item.id}
          {...item}
          selectCard={() => selectCard(index === 0 ? i : i + 4)}
        />
      ))}
    </div>
  ));
};

const CardItem = ({ image, name, show, selectCard, check }) => {
  return (
    <div className={check ? "hide" : ""} onClick={selectCard}>
      <img
        className={`pwImageCard ${!show ? "coverImage" : ""}`}
        src={!show ? cover : image}
        alt={name}
      />
    </div>
  );
};

function initialState(letter) {
  return {
    open: 0,
    cards: getModuleData(letter).map((item) => ({
      ...item,
      check: false,
      show: false,
    })),
    correct: 4,
    loading: true,
  };
}

export default PairWords;
