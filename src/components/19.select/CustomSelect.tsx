import { Form, FormItemProps, Select, SelectProps } from "antd";
import { BaseOptionType } from "antd/lib/select";
import React from "react";

interface Props extends SelectProps {
  name?: string | (string | number)[];
  label?: React.ReactNode;
  rules?: FormItemProps["rules"];
  selectClassName?: string;
  prefixIcon?: React.ReactNode;
}

const CustomSelect: React.FC<Props> = ({
  name,
  label,
  rules,
  selectClassName,
  prefixIcon,
  ...selectProps
}) => {
  const filterOption = (search: string, option?: BaseOptionType) => {
    if (!option) return false;
    const regex = new RegExp(search, "i");
    return regex.test(option.label);
  };
  return (
    <Form.Item>
      {prefixIcon && <div>{prefixIcon}</div>}
      <Form.Item
        name={name}
        label={label}
        rules={rules}
        labelCol={{ span: 24 }}
      >
        <Select {...selectProps} showSearch filterOption={filterOption} />
      </Form.Item>
    </Form.Item>
  );
};

export default CustomSelect;
