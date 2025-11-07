/**@namespace useForm */

import { useState } from "react";

/**
 * @function useForm
 * @param {object} props Object with fields required to initialize form
 * @property {object} state Current state of form
 * @property {function} setState Setter for state
 * @returns {Array} [state, onChange]
 */
export const useForm = (props) => {
  const [state, setState] = useState(props);

  const onChange = (e, type) => {
    const { value } = e.target;
    setState({ ...state, [type]: value });
  };

  return [state, onChange, setState];
};
