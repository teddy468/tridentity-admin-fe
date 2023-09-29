import { Form, FormItemProps } from "antd";
import Input, { TextAreaProps } from "antd/lib/input";
import React from "react";

interface Props extends TextAreaProps {
  label: React.ReactNode;
  rules?: FormItemProps["rules"];
  textareaClassName?: string;
}

const CustomTextarea: React.FC<Props> = (props) => {
  const {
    className,
    textareaClassName,
    name,
    label,
    rules,
    rows,
    ...textareaProps
  } = props;

  return (
    <Form.Item name={name} rules={rules} label={label} labelCol={{ span: 24 }}>
      <Input.TextArea rows={rows || 4} {...textareaProps} />
    </Form.Item>
  );
};

export default CustomTextarea;
