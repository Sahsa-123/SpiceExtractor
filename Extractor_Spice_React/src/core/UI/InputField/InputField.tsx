import React, { useState } from 'react';
import { classNameConverter } from "../sharedHelpers";
import styles from "./InputField.module.css";
import { InputFieldProps } from './api';

export const InputField: React.FC<InputFieldProps> = ({
  enterHandler = () => {},
  blurHandler = () => {},
  styleModification = [],
  outerStyles = null,
  placeholder = "",
  disabled = false,
  defaultValue = "",
  type = "text"
}) => {
  const BASICCLASS = "input";
  const className = classNameConverter(styles, styleModification, BASICCLASS) + (outerStyles || "");

  const [value, setValue] = useState(defaultValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      enterHandler(value.trim());
    }
  };

  const handleBlur = () => {
    if (!disabled) {
      blurHandler(value.trim());
    }
  };

  return (
    <input
      type={type}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
};
