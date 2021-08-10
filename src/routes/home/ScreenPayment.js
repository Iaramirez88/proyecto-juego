import React from "react";
import ButtonDiv from "../../components/Buttons";
import InputForm from "../../components/forms/InputForm";
import HeaderHome from "../../components/shared/HeaderHome";
import { useForm } from "../../hooks/useForm";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import { Row } from "react-bootstrap";

const ScreenPayment = () => {
  useSetBackGround();
  const [state, onChange] = useForm({
    name: "",
    dni: "",
    dnitype: "",
    phoneNumber: "",
    country: "",
    productId: "",
    date: "",
    price: 0,
    currency: "",
  });

  const onSubmit = () => {
    console.log(state);
  };

  return (
    <div>
      <HeaderHome />
      <div className="smFormContainer">
        <Row className="smForm">
          <InputForm
            columns={{ lg: "12" }}
            label="Nombre Completo del tutor"
            onChange={(e) => onChange(e, "name")}
            type="text"
            name="name"
            styles={{ label: "labelForm", input: "inputForm" }}
          />
        </Row>
        <Row className="smForm">
          <InputForm
            columns={{ lg: "2" }}
            label="CC"
            onChange={(e) => onChange(e, "dnitype")}
            type="text"
            name="dnitype"
            styles={{ label: "labelForm", input: "inputForm" }}
          />
          <InputForm
            columns={{ lg: "10" }}
            label="Número de Documento"
            onChange={(e) => onChange(e, "dni")}
            type="text"
            name="dni"
            styles={{ label: "labelForm", input: "inputForm" }}
          />
        </Row>
        <Row className="smForm">
          <InputForm
            columns={{ lg: "6" }}
            label="Número de Celular"
            onChange={(e) => onChange(e, "phoneNumber")}
            type="text"
            name="phoneNumber"
            styles={{ label: "labelForm", input: "inputForm" }}
          />
          <InputForm
            columns={{ lg: "6" }}
            label="Pais"
            onChange={(e) => onChange(e, "country")}
            type="text"
            name="country"
            readonly={true}
            styles={{ label: "labelForm", input: "inputForm" }}
          />
        </Row>
        <Row className="smForm">
          <InputForm
            columns={{ lg: "6" }}
            label="Producto"
            onChange={(e) => onChange(e, "product")}
            type="text"
            name="product"
            readonly={true}
            styles={{ label: "labelForm", input: "inputForm" }}
          />
          <InputForm
            columns={{ lg: "6" }}
            label="Fecha"
            type="text"
            name="country"
            readonly={true}
            styles={{ label: "labelForm", input: "inputForm" }}
          />
        </Row>
        <Row className="smForm">
          <InputForm
            columns={{ lg: "6" }}
            label="Precio"
            type="text"
            readonly={true}
            name="price"
            styles={{ label: "labelForm", input: "inputForm" }}
          />
          <InputForm
            columns={{ lg: "6" }}
            label="Moneda"
            type="text"
            name="currency"
            readonly={true}
            styles={{ label: "labelForm", input: "inputForm" }}
          />
        </Row>

        <div className="smForm">
          <ButtonDiv
            title="PAGAR"
            handler={() => onSubmit()}
            classStyle="smButton smBoxButton smBack"
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenPayment;
