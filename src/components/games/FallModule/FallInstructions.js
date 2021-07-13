import React, { useEffect, useState } from "react";
import leaf from "../../../assets/images/hojaVocale.svg";
import leafGood from "../../../assets/images/hojaRespuestaVerdadera.svg";
import hand from "../../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";

const FallInstructions = ({ display }) => {
  const [image, setImage] = useState(leaf);

  useEffect(() => {
    const init = () => {
      let tl = gsap.timeline();
      tl.fromTo(
        "#fiHand",
        {
          scale: 1,
        },
        {
          duration: 1,
          scale: 0.8,
        }
      ).to("#fiHand", {
        duration: 0.7,
        scale: 1,
        onComplete: () => {
          setImage(leafGood);
        },
      });
    };

    if (!display) {
      init();
    }
  }, [display]);

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.row}>
          <img alt="leaf" src={leaf} style={styles.option} />
        </div>
        <div style={styles.row}>
          <img alt="leaf" src={image} style={styles.option} />
          <img alt="hand" id="fiHand" src={hand} style={styles.hand} />
        </div>
        <div style={styles.row}>
          <img alt="leaf" src={leaf} style={styles.option} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  option: {
    width: "120px",
    height: "80px",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: "1em",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
    position: "relative",
  },
  hand: {
    width: "50px",
    height: "50px",
    position: "absolute",
    top: "30px",
  },
};

export default FallInstructions;
