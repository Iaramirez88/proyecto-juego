import React from "react";
import HeaderHome from "../../components/shared/HeaderHome";
import { useSetBackGround } from "../../hooks/useSetBackGround";

const ScreenPayment = () => {
  useSetBackGround();
  return (
    <div>
      <HeaderHome />
      <div style={styles}>Enviar a pantalla de pagos</div>
    </div>
  );
};

const styles = {
  background: "#52c211",
  width: "30%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "30px",
  height: "60px",
  fontSize: "1.5em",
  color: "white",
  borderRadius: "14px",
  boxShadow: "-2px 3px #c2c2c2",
};

export default ScreenPayment;
