import { Form, FormItemProps, Input, InputProps } from "antd";
import React from "react";
import { NamePath } from "antd/es/form/interface";
import "./styles.scss";
interface CustomInputProps extends Omit<InputProps, "name"> {
  name?: string | (string | number)[];
  errorMessage?: React.ReactNode;
  inputClassName?: string;
  errorClassName?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  label?: React.ReactNode;
  rules?: FormItemProps["rules"];
  restField?: {
    fieldKey?: number | undefined;
  };
  dependencies?: NamePath[];
  isCustom?: boolean;
}

const CommonInput = (props: CustomInputProps) => {
  const {
    className,
    errorMessage,
    inputClassName,
    errorClassName,
    startAdornment,
    endAdornment,
    label,
    rules,
    name,
    restField,
    dependencies,
    isCustom,
    ...inputProps
  } = props;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      labelCol={{ span: 24 }}
      {...restField}
      dependencies={dependencies}
    >
      <Input
        className={` ${inputClassName ?? ""}`}
        prefix={startAdornment}
        suffix={endAdornment}
        {...inputProps}
      />
    </Form.Item>
  );
};

export default CommonInput;
