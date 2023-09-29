import { Form, Modal, Switch } from "antd";
import { Store } from "antd/lib/form/interface";
import { useEffect, useState } from "react";
import "./styles.scss";

interface EditFixedShippingFeeProps {
  open: boolean;
  onClose: () => void;
  onSetPlatformFee: (percent: boolean) => void;
  initialValues?: Store | undefined;
}
const EditFixedShippingFee: React.FC<EditFixedShippingFeeProps> = ({
  open,
  onClose,
  onSetPlatformFee,
  initialValues,
}: EditFixedShippingFeeProps) => {
  const [value, setValue] = useState<boolean>(false);
  const [form] = Form.useForm();
  const onFinish = () => {
    onSetPlatformFee(value);
    handleCancel();
  };
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (initialValues) {
      setValue(initialValues["is_fixed_shipping_fee_enabled"]);
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Modal
      title="Edit fixed shipping fee enabled"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Save"
    >
      <Form
        onFinish={onFinish}
        layout={"vertical"}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={initialValues}
      >
        <Form.Item
          name="is_fixed_shipping_fee_enabled"
          label="Is fixed shipping fee enabled"
        >
          <Switch checked={value} onChange={(value) => setValue(value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFixedShippingFee;
