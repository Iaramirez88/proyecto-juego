import React from "react";
import { useHistory, useParams } from "react-router-dom";
import Header from "../../components/shared/Header";

const Armar = () => {
  const history = useHistory();
  const { id } = useParams();

  return (
    <div style={{ minHeight: "100vh", background: "#FFE082" }}>
      <Header onGoBack={() => history.push("/")} />
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 16px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0" }}>Armar</h1>
        <p style={{ margin: "0 0 16px 0", color: "#333" }}>
          Letra actual: <strong>{String(id || "").toUpperCase()}</strong>
        </p>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <p style={{ margin: 0, fontSize: 16 }}>
            Este juego está en construcción. Por ahora solo se habilitó la pantalla para que
            no falle la navegación.
          </p>
          <button
            type="button"
            onClick={() => history.push("/")}
            style={{
              marginTop: 16,
              border: "none",
              borderRadius: 10,
              padding: "12px 16px",
              fontWeight: 700,
              cursor: "pointer",
              background: "#0d6efd",
              color: "white",
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Armar;