import React, { useState } from "react";
import { Col, FormControl, InputGroup, Row } from "react-bootstrap";
import swal from "sweetalert";
import LoadingComponent from "../../components/shared/LoadingComponent";
import {
  caraKoala,
  menuMovil,
  correo,
  bien,
} from "../../utils/imagesResources";
import { validateEmail } from "../../utils/tools";

const LicensesList = () => {
  const [state, setState] = useState([
    { email: "", isActive: false, sent: false, opened: false, checked: false },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const setValue = (pos, field, value) => {
    const arr = [...state];
    arr[pos][field] = value;
    return arr;
  };

  const onChange = (e, field, position) => {
    let { value } = e.target;
    setState(setValue(position, field, value));
  };

  const isValidCheckbox = (e, field, position) => {
    const arr = [...state];
    if (arr[position].email === "") {
      e.target.checked = false;
      swal("Ups!", "El campo de correo es requerido", "warning");
      setState(setValue(position, field, false));
      return false;
    }
    return true;
  };

  const handlerSendEmail = (e, field, position) => {
    const arr = [...state];
    const current = arr[position];
    if (isValidCheckbox(e, field, position)) {
      setIsLoading(true);
      const data = {
        email: current.email,
      };

      setState(setValue(position, field, false));
    }
  };

  const activeInput = (position) => {
    const arr = [...state];
    if (state[position].isActive) {
      if (validateEmail(arr[position].email)) {
        arr[position].isActive = !state[position].isActive;
        return setState(arr);
      }
      return swal("Ups!", "Debes ingresar un correo valido", "warning");
    }
    arr[position].isActive = true;
    return setState(arr);
  };

  return (
    <div className="llContainer">
      <Row className="llTitleRow">
        <Col lg={{ offset: 4 }} md={{ offset: 4 }} className="titleMidCol">
          <h3>Nombre del padre</h3>
        </Col>
        <Col lg={4} md={4} className="llCheboxRow">
          <img src={correo} alt="correo" width="3em" height="3em" />
          <img src={bien} alt="bien" width="3em" height="3em" />
          <img src={menuMovil} alt="menuMovil" width="3em" height="3em" />
        </Col>
      </Row>
      <Row className="llContainerList">
        <Col className="llBoxRow" lg={4} md={4}>
          <div className="llBoxIcon">
            <p className="llItemName">
              {" "}
              <img src={caraKoala} alt="koala" width="80px" height="80px" />
              Nombre del niño
            </p>
          </div>
        </Col>
        <Col className="llBoxRow" lg={4} md={4}>
          <div>
            {/* <input name="email" className="llInputItem" placeholder="Correo" /> */}
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Correo"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                readOnly={!state[0].isActive}
                onChange={(e) => onChange(e, "email", 0)}
              />
              <InputGroup.Text
                className="llInputItem"
                id="basic-addon2"
                onClick={() => activeInput(0)}
                style={{ cursor: "pointer" }}
              >
                {!state[0].isActive ? "Editar ✏️" : "Guardar 💾"}
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Col>
        <Col className="llBoxRow" lg={4} md={4}>
          <div className="llCheboxRow">
            <input
              onChange={(e) => handlerSendEmail(e, "sent", 0)}
              type="checkbox"
              className="llCheckbox"
            />
            <input type="checkbox" className="llCheckbox" />
            <input type="checkbox" className="llCheckbox" />
          </div>
        </Col>
      </Row>
      <LoadingComponent isLoading={isLoading} />
    </div>
  );
};

export default LicensesList;
