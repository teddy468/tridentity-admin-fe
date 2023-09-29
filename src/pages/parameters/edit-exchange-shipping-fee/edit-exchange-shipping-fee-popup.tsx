import { Form, Input, Modal } from "antd";
import "./styles.scss";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";

interface EditPlatformFeeProps {
  open: boolean;
  onClose: () => void;
  onSetPlatformFee: (percent: number) => void;
  initialValues?: Store | undefined;
}
const EditPlatformFeePopup: React.FC<EditPlatformFeeProps> = ({
  open,
  onClose,
  onSetPlatformFee,
  initialValues,
}: EditPlatformFeeProps) => {
  const [form] = Form.useForm();
  const onFinish = (values: { fixed_shipping_fee: number }) => {
    onSetPlatformFee(Number(values.fixed_shipping_fee));
    handleCancel();
  };
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Modal
      title="Edit Shipping Fee"
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
          name="fixed_shipping_fee"
          label="Shipping Fee"
          required
          rules={[
            {
              required: true,
              message: "Please input shipping fee",
            },
            {
              validator: (_, value) =>
                value && value < 0
                  ? Promise.reject(
                      new Error("Shipping fee must not be less than 0")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="5" type="number" addonAfter="SGD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPlatformFeePopup;
