import React from "react";
import { Form, FormItemProps, TimePicker, TimePickerProps } from "antd";

interface Props extends TimePickerProps {
  name: string;
  label: React.ReactNode;
  rules?: FormItemProps["rules"];
  pickerClassName?: string;
}

const TimeInput: React.FC<Props> = (props) => {
  const {
    className,
    pickerClassName,
    name,
    label,
    rules,
    placement,
    ...pickerProps
  } = props;

  return (
    <Form.Item noStyle dependencies={[name]}>
      {({ setFieldValue }) => (
        <Form.Item
          name={name}
          rules={rules}
          label={label}
          labelCol={{ span: 24 }}
        >
          <TimePicker
            placement={placement || "bottomRight"}
            onChange={(value) => setFieldValue(name, value)}
            {...pickerProps}
          />
        </Form.Item>
      )}
    </Form.Item>
  );
};
export default TimeInput;
