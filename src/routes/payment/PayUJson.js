export const setPayment = (data) => {
  const cost = getCost(data.cost);
  return {
    language: "es",
    command: "SUBMIT_TRANSACTION",
    merchant: {
      apiKey: "4Vj8eK4rloUd272L48hsrarnUA",
      apiLogin: "pRRXKOl8ikMmt9u",
    },
    transaction: {
      order: {
        accountId: "512321",
        referenceCode: `payment_license_${getDate()}`,
        description: "Payment AWK LICENSE",
        language: "es",
        signature: "7ee7cf808ce6a39b17481c54f2c57acc",
        notifyUrl: "http://www.tes.com/confirmation",
        additionalValues: {
          TX_VALUE: {
            value: cost.total,
            currency: "COP",
          },
          TX_TAX: {
            value: cost.taxt,
            currency: "COP",
          },
          TX_TAX_RETURN_BASE: {
            value: data.cost,
            currency: "COP",
          },
        },
        buyer: {
          fullName: data.fullName,
          emailAddress: data.emailAddress,
          contactPhone: data.phone,
          dniNumber: data.dniNumber,
          shippingAddress: {
            street1: "n/a",
            street2: "n/a",
            city: "n/a",
            state: "n/a",
            country: "CO",
            postalCode: "000000",
            phone: data.phone,
          },
        },
      },
      payer: {
        fullName: "AWKoala Play App",
        emailAddress: "pruebaplay2@artworkoala.com",
        contactPhone: "7563126",
        dniNumber: "5415668464654",
        billingAddress: {
          street1: "n/a",
          street2: "n/a",
          city: "Bogota",
          state: "Bogota DC",
          country: "CO",
          postalCode: "000000",
          phone: "7563126",
        },
      },
      creditCard: {
        number: data.creditCard.number,
        securityCode: data.creditCard.cvv,
        expirationDate: data.creditCard.date,
        name: data.creditCard.name,
      },
      type: "AUTHORIZATION_AND_CAPTURE",
      paymentMethod: "VISA",
      paymentCountry: "CO",
      deviceSessionId: "vghs6tvkcle931686k1900o6e1",
      ipAddress: "127.0.0.1",
      cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
      userAgent:
        "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0",
    },
    test: true,
  };
};

const getCost = (cost, location = "CO") => {
  const tax = parseFloat((cost * 0.19).toFixed(2));
  const total = cost + tax;
  return { tax, total };
};

const getDate = () => {
  const date = new Date();
  const day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`;
  const month = date.getMonth() > 10 ? date.getMonth() : `0${date.getMonth()}`;
  const year = date.getFullYear();
  const hour = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
  const min =
    date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const sec =
    date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`;

  return `${day}_${month}_${year}_${hour}_${min}_${sec}`;
};
