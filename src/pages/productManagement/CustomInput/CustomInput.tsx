import { Form, FormItemProps, Input, InputProps } from "antd";
import styles from "./CustomInput.module.scss";
import { NamePath } from "antd/es/form/interface";

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

const CustomInput = (props: CustomInputProps) => {
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

  const Component = props.type === "password" ? Input.Password : Input;
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      labelCol={{ span: 24 }}
      {...restField}
      dependencies={dependencies}
    >
      <Component
        prefix={startAdornment}
        suffix={endAdornment}
        {...inputProps}
      />
    </Form.Item>
  );
};
export default CustomInput;
