import { useHistory } from "react-router";
import btnNext from "../../../assets/images/botonNext.svg";
import { useDimesionClient } from "../../../hooks/useDimesion";
import logoKoala from "../../../assets/images/logoInicalAnimado.svg";

const TermScreen = ({ setHideTitle }) => {
  const history = useHistory();
  const { width, height } = useDimesionClient();
  return (
    <div className="coverTypeTutor">
      <div className="logoKoala">
        <img
          alt="koala-logo"
          onClick={() => history.push("/")}
          id="sign-logo-koala"
          src={logoKoala}
        />
        <div className="signTitleKoala">
          <p className="welcomeTextLogo">
            <span>BIENVENIDOS</span>
          </p>
          <p className="titleAppLogo">
            <span>ARTWORKOALA</span>
            <span> PLAY</span>
          </p>
        </div>
      </div>

      <div
        className="snTerms"
        style={width <= 992 ? { height: `${height}px` } : {}}
      >
        <h1>Advertencia</h1>
        <p className="contentTerm">
          Teniendo en cuenta que esta aplicación es para uso de niños menores de
          edad, es necesario que se registre un adulto responsable para que
          pueda tener control del buen uso de la aplicación y verificar las
          lecciones estudiadas por sus hijos o estudiantes.
        </p>
        <div style={{ position: "relative" }}>
          <img
            onClick={() => {
              history.push("registro");
            }}
            alt="btn-next"
            src={btnNext}
            className="smBtnNext"
          />
        </div>
        <p className="snFooter">
          Al registrarte en ARTWORKOALA PLAY aceptas nuestros{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.artworkoala.com/terminos-y-condiciones/"
          >
            Términos y Politica de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
};

export default TermScreen;
