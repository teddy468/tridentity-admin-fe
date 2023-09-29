import { Form, Input, Modal } from "antd";
import "./styles.scss";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";

interface EditLpConversionPopupProps {
  open: boolean;
  onClose: () => void;
  onSetLPPercent: (percent: number) => void;
  initialValues?: Store | undefined;
}
const EditLPConversionPopup: React.FC<EditLpConversionPopupProps> = ({
  open,
  onClose,
  onSetLPPercent,
  initialValues,
}: EditLpConversionPopupProps) => {
  const [form] = Form.useForm();
  const onFinish = async (values: { percent: number }) => {
    onSetLPPercent(Number(values.percent));
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
      title="Edit LP Conversion"
      open={open}
      onCancel={handleCancel}
      okText="Save"
      onOk={() => form.submit()}
    >
      <Form
        onFinish={onFinish}
        layout={"vertical"}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={initialValues}
      >
        <Form.Item
          label="LP Conversion"
          name="percent"
          rules={[
            {
              required: true,
              message: "Please input LP Conversion",
            },
            {
              validator: (_, value) =>
                value && value < 0
                  ? Promise.reject(
                      new Error("LP Conversion must not be less than 0")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="10" type="number" addonAfter="%" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLPConversionPopup;
