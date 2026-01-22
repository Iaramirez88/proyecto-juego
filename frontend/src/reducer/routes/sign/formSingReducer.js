export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER": {
      const { data } = action;
      return {
        ...state,
        name: data.name,
        dni: data.dni,
        dnitype: data.dnitype,
        phoneNumber: data.phoneNumber,
        country: data.country,
        productId: data.productId,
        date: data.date,
        price: data.price,
        currency: data.currency,
      };
    }

    default:
      return state;
  }
};

export const initialState = () => {
  return {
    name: "",
    dni: "",
    dnitype: "",
    phoneNumber: "",
    country: "",
    productId: "",
    date: "",
    price: 0,
    currency: "",
  };
};
