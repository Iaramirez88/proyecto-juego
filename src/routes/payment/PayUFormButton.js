import React, { useEffect, useRef } from "react";
import { configVars } from "../../utils/config";
//import sha256 from "crypto-js/sha256";
import { parseDate } from "../../utils/tools";

const PayUFormButton = ({ allowSubmit, currency, price }) => {
  useEffect(() => {}, []);
  const refForm = useRef(null);

  const onSubmit = () => {
    const { apiPayu, merchantIdPayu } = configVars;
    const refCode = `payment-plan-${parseDate(new Date(), "complete")}`;
    console.log(apiPayu, merchantIdPayu);
  };

  return (
    <div>
      <form
        ref={refForm}
        method="post"
        action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
        target="_blank"
      >
        <input name="merchantId" type="hidden" value="508029" />
        <input name="accountId" type="hidden" value="512321" />
        <input name="description" type="hidden" value="Test PAYU" />
        <input name="referenceCode" type="hidden" value="TestPayU" />
        <input name="amount" type="hidden" value="20000" />
        <input name="tax" type="hidden" value="3193" />
        <input name="taxReturnBase" type="hidden" value="16806" />
        <input name="currency" type="hidden" value="COP" />
        <input
          name="signature"
          type="hidden"
          value="7ee7cf808ce6a39b17481c54f2c57acc"
        />
        <input name="test" type="hidden" value="0" />
        <input name="buyerEmail" type="hidden" value="test@test.com" />
        <input
          name="responseUrl"
          type="hidden"
          value="http://www.test.com/response"
        />
        <input
          name="confirmationUrl"
          type="hidden"
          value="http://www.test.com/confirmation"
        />
        <div
          className={`submitPayment ${!allowSubmit ? "disable" : ""}`}
          name="Submit"
          value="Enviar"
          disabled={!allowSubmit}
          onClick={onSubmit}
        >
          Enviar
        </div>
      </form>
    </div>
  );
};

export default PayUFormButton;
