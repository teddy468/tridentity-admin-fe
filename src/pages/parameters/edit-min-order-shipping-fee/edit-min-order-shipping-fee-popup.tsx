import { Form, Input, Modal } from "antd";
import "./styles.scss";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";

interface EditMinOrderProps {
  open: boolean;
  onClose: () => void;
  onSetMinOrder: (percent: number) => void;
  initialValues?: Store | undefined;
}
const EditMinOrderPopup: React.FC<EditMinOrderProps> = ({
  open,
  onClose,
  onSetMinOrder,
  initialValues,
}: EditMinOrderProps) => {
  const [form] = Form.useForm();
  const onFinish = (values: { min_order: number }) => {
    onSetMinOrder(Number(values.min_order));
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
      title="Edit Min Order"
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
          name="min_order"
          label="Min Order"
          required
          rules={[
            {
              required: true,
              message: "Please input min order",
            },
            {
              validator: (_, value) =>
                value && value < 0
                  ? Promise.reject(
                      new Error("min order must not be less than 0")
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

export default EditMinOrderPopup;
