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
}) => {
  return (
    <Col {...columns}>
      <label className={styles.label} htmlFor="name">
        {label}
      </label>
      <input
        readOnly={readonly}
        className={`${styles.input} ${readonly ? "inputReadonly" : ""}`}
        name={name}
        type={type}
        onChange={onChange}
      />
    </Col>
  );
};

export default InputForm;
