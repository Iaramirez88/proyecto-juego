import React, { useCallback, useEffect, useState } from "react";
import ButtonDiv from "../../components/Buttons";
import HeaderHome from "../../components/shared/HeaderHome";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import { useRequestApi } from "../../hooks/useRequesApi";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useHistory, useParams } from "react-router";
import { FormPayment, StepsIcons, CreditForm } from "./FormPayment";
import { setPayment } from "./PayUJson";
import "../../assets/styles/payment-module.css";
import { usePriceTitle } from "../../hooks/usePriceTitle";
import { parseDate, validateNumber } from "../../utils/tools";
import PayUFormButton from "./PayUFormButton";

const ScreenPayment = () => {
  useSetBackGround();
  const apiUser = useRequestApi("user");
  const apiPrice = useRequestApi("price");
  const { id, idplan } = useParams();
  const { getData } = useLocalStorage("user");
  const [isLoading, setIsLoading] = useState(false);
  const getPrice = usePriceTitle();
  const history = useHistory();
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [error, setError] = useState({
    active: false,
    title: "",
  });
  const [form, setForm] = useState({
    name: "",
    dni: "",
    dnitype: "",
    phoneNumber: "",
    country: "",
    productId: "",
    productName: "",
    date: "",
    price: "",
    currency: "",
    creditName: "",
    cvv: "",
    expiredDate: "",
    cardNumber: "",
  });
  const [steps, setSteps] = useState(1);

  const apiCall = useCallback(async () => {
    const userData = getData();
    if (!userData) return { user: null, price: null };
    const request = await apiUser.get(`${id}`, userData.token);
    const priceReq = await apiPrice.get(idplan);
    if (request.code === 500 && priceReq.code === 500) return { code: 500 };
    const resPrice = priceReq.response;
    const user = request.response;
    user.country.name = userData.country;
    const price = priceReq.response;
    price.name = getPrice(resPrice.meses_precio);
    return { user, price };
  }, [apiUser, getData, id, getPrice, apiPrice, idplan]);

  useEffect(() => {
    if (!isLoading) {
      let isMounted = true;

      const calculatePrice = (valor, currency) => (valor * currency).toString();
      const init = async () => {
        const { user, price } = await apiCall();
        if (!user) return history.push("/");
        if (isMounted) {
          setForm({
            ...form,
            name: user.nombre_usuario,
            country: user.country.name,
            productId: price.id_plan,
            productName: price.name,
            date: parseDate(new Date(), "dmy"),
            price: calculatePrice(price.valor, user.price.currency),
            currency: "COP",
          });

          setIsLoading(true);
        }
      };
      init();

      return () => {
        isMounted = false;
      };
    }
  }, [apiCall, isLoading, setForm, form, history]);

  const onSubmit = () => {
    console.log(form);
  };

  const onChange = (e, type) => {
    const { value } = e.target;
    const cpForm = { ...form, [type]: value };
    setError({ active: false, title: "" });
    setForm(cpForm);
    setAllowSubmit(handlerFields(cpForm));
  };

  const validateCreditCart = (number) => {
    let regVisa = /^(4)(\d{12}|\d{15})|^(606374\d{10}$)/g;
    let reMasterCard = /^(?:5[1-5][0-9]{14})$/g;
    if (regVisa.test(number)) return true;
    if (reMasterCard.test(number)) return true;
    return false;
  };

  const handlerFields = (cpForm) => {
    if (cpForm.name.trim().length <= 0) return false;
    if (cpForm.dni.trim().length <= 0) return false;
    if (cpForm.phoneNumber.trim().length <= 0) return false;
    return true;
  };

  return (
    <div>
      <HeaderHome />
      {/* <StepsIcons step={steps} /> */}
      {steps === 1 && (
        <FormPayment onChange={onChange} state={form} error={error} />
      )}
      {steps === 2 && (
        <CreditForm onChange={onChange} state={form} error={error} />
      )}

      <div className="smForm pyContainerButton">
        {/* {steps > 1 && (
          <ButtonDiv
            title="ATRAS"
            handler={() => setSteps(steps - 1)}
            classStyle="smButton smBoxButton backColor"
          />
        )} */}

        {/* {steps === 3 && (
          )} */}
        {/* <ButtonDiv
            title="PAGAR"
            handler={() => onSubmit()}
            classStyle="smButton smBoxButton smBack"
          /> */}

        <PayUFormButton allowSubmit={allowSubmit} {...form} />
      </div>
    </div>
  );
};

export default ScreenPayment;
