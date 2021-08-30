import React from "react";
import { Col, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  caraKoala,
  menuMovil,
  correo,
  bien,
} from "../../utils/imagesResources";

const LicensesList = () => {
  return (
    <div className="llContainer">
      <Row className="llTitleRow">
        <Col lg={{ offset: 4 }} md={{ offset: 4 }}>
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
                readOnly={true}
              />
              <InputGroup.Text className="llInputItem" id="basic-addon2">
                ✏️
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Col>
        <Col className="llBoxRow" lg={4} md={4}>
          <div className="llCheboxRow">
            <input type="checkbox" className="llCheckbox" />
            <input type="checkbox" className="llCheckbox" />
            <input type="checkbox" className="llCheckbox" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LicensesList;
