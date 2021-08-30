import React from "react";
import { Col, Row } from "react-bootstrap";
import InputForm from "../../components/forms/InputForm";

export const FormPayment = ({ onChange, state, error }) => {
  const columns = { lg: "6", md: "12", sm: "12", xs: 12 };
  return (
    <div className="smFormContainer">
      <Row className="smForm pyInputRow">
        <InputForm
          columns={columns}
          label="Nombre Completo del tutor"
          onChange={(e) => onChange(e, "name")}
          type="text"
          name="name"
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.name}
          error={error}
        />
        <InputForm
          columns={columns}
          label="Número de Documento"
          onChange={(e) => onChange(e, "dni")}
          type="text"
          name="dni"
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.dni}
          error={error}
        />
      </Row>
      <Row className="smForm pyInputRow">
        <InputForm
          columns={columns}
          label="Número de Celular"
          onChange={(e) => onChange(e, "phoneNumber")}
          type="text"
          name="phoneNumber"
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.phoneNumber}
          error={error}
        />
        <InputForm
          columns={columns}
          label="Pais"
          onChange={(e) => onChange(e, "country")}
          type="text"
          name="country"
          readonly={true}
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.country}
          error={error}
        />
      </Row>
      <Row className="smForm pyInputRow">
        <InputForm
          columns={columns}
          label="Producto"
          type="text"
          name="product"
          readonly={true}
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.productName}
          error={error}
        />
        <InputForm
          columns={columns}
          label="Fecha"
          type="text"
          name="date"
          readonly={true}
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.date}
          error={error}
        />
      </Row>
      <Row className="smForm pyInputRow">
        <InputForm
          columns={columns}
          label="Precio"
          type="text"
          name="price"
          readonly={true}
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.price}
          error={error}
        />
        <InputForm
          columns={columns}
          label="Moneda"
          type="text"
          name="currency"
          readonly={true}
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.currency}
          error={error}
        />
      </Row>
    </div>
  );
};

export const CreditForm = ({ onChange, state, error }) => {
  const columns = { lg: "6", md: "12", sm: "12" };

  return (
    <div className="smFormContainer">
      <Row className="smForm pyInputRow">
        <InputForm
          columns={{ ...columns, lg: "12" }}
          label="Nombre de la tarjeta de Credito"
          onChange={(e) => onChange(e, "creditName")}
          type="text"
          name="creditName"
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.creditName}
          error={error}
        />
      </Row>
      <Row className="smForm pyInputRow">
        <InputForm
          columns={{ ...columns, lg: "12" }}
          label="Número de tarjeta de credito"
          onChange={(e) => onChange(e, "cardNumber")}
          type="text"
          name="cardNumber"
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.cardNumber}
          error={error}
          autoComplete="off"
        />
      </Row>
      <Row className="smForm pyInputRow">
        <InputForm
          columns={columns}
          label="Número CVV"
          onChange={(e) => onChange(e, "cvv")}
          type="password"
          name="cvv"
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.cvv}
          error={error}
        />
        <InputForm
          columns={columns}
          label="Fecha de Expiración"
          onChange={(e) => onChange(e, "expiredDate")}
          type="text"
          name="expiredDate"
          styles={{ label: "labelForm", input: "inputForm" }}
          defaultValue={state.expiredDate}
          error={error}
        />
      </Row>
    </div>
  );
};

export const StepsIcons = ({ step }) => {
  const isActive = (position) => (step === position ? "active" : "");
  const columns = { lg: "4", md: "4", sm: "4", xs: "4" };

  return (
    <Row className="smForm stepsBox">
      <Col {...columns} className="center">
        <div>
          <p className={`stepsIcon ${isActive(1)}`}>1</p>
        </div>
      </Col>
      <Col {...columns} className="center">
        <div>
          <p className={`stepsIcon ${isActive(2)}`}>2</p>
        </div>
      </Col>
      <Col {...columns} className="center">
        <div>
          <p className={`stepsIcon ${isActive(3)}`}>3</p>
        </div>
      </Col>
    </Row>
  );
};
