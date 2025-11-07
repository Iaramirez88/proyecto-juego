import React from "react";
import { Col } from "react-bootstrap";

const InputForm = ({
  readonly,
  columns,
  styles,
  label,
  onChange,
  name,
  type,
  defaultValue,
  error,
  autoComplete,
}) => {
  return (
    <Col {...columns}>
      <label className={styles.label} htmlFor="name">
        {label}
      </label>
      <input
        readOnly={readonly}
        className={`${styles.input} ${readonly ? "inputReadonly" : ""} ${
          error.field === name ? "errorInput" : ""
        }`}
        name={name}
        type={type}
        onChange={onChange}
        defaultValue={defaultValue}
        autoComplete={autoComplete ? "off" : ""}
      />
      {error.field === name && <span className="errorText">{error.title}</span>}
    </Col>
  );
};

export default InputForm;
