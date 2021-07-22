import React, { useState } from "react";
import { useHistory } from "react-router";
import ResetPassword from "../../../components/forms/resetPassword";

const ResetPasswordScreen = () => {
  const history = useHistory();

  const onSubmit = (state) => {
    console.log(state);
    history.push("notification");
  };

  return <ResetPassword onSubmit={onSubmit} />;
};

export default ResetPasswordScreen;
