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
  const onFinish = (values: { percent: number }) => {
    onSetPlatformFee(Number(values.percent));
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
      title="Edit Platform Fee"
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
          name="percent"
          label="Platform Fee"
          required
          rules={[
            {
              required: true,
              message: "Please input platform fee",
            },
            {
              validator: (_, value) =>
                value && value < 0
                  ? Promise.reject(
                      new Error("Platform fee must not be less than 0")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="5" type="number" addonAfter="%" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPlatformFeePopup;
