import { Checkbox, CheckboxProps, Form, FormItemProps } from "antd";
import { CheckboxGroupProps } from "antd/lib/checkbox";

interface Props extends Omit<CheckboxGroupProps, "name"> {
  label?: React.ReactNode;
  groupClassName?: string;
  rules?: FormItemProps["rules"];
  groupProps?: FormItemProps;
  name?: string | (string | number)[];
}

const CustomCheckbox = (props: Props) => {
  const {
    className,
    groupClassName,
    label,
    name,
    rules,
    groupProps,
    ...listProps
  } = props;

  return (
    <Form.Item
      name={name}
      rules={rules}
      label={label}
      labelCol={{ span: 6 }}
      labelAlign="left"
      {...groupProps}
    >
      <Checkbox.Group {...listProps} />
    </Form.Item>
  );
};

export default CustomCheckbox;
