import { Form, Input, Modal } from "antd";
import "./styles.scss";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";
import {
  convertHoursToMiliseconds,
  convertMilisecondsToHours,
} from "src/helpers/parameter";

interface EditOrderReceivedTimeoutPopupProps {
  open: boolean;
  onClose: () => void;
  onSetTimeOut: (timeout: number) => void;
  initialValues?: Store | undefined;
}
const EditOrderReceivedTimeoutPopup: React.FC<
  EditOrderReceivedTimeoutPopupProps
> = ({
  open,
  onClose,
  onSetTimeOut,
  initialValues,
}: EditOrderReceivedTimeoutPopupProps) => {
  const [form] = Form.useForm();
  const onFinish = async (values: { timeout: number }) => {
    onSetTimeOut(convertHoursToMiliseconds(Number(values.timeout)));
    handleCancel();
  };
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  useEffect(() => {
    if (initialValues) {
      const timeout = convertMilisecondsToHours(initialValues?.timeout);
      initialValues.timeout = timeout;
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Modal
      title="Edit Order Received Timeout"
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
          label="Timeout"
          name="timeout"
          rules={[
            {
              required: true,
              message: "Please input timeout hours",
            },
            {
              validator: (_, value) =>
                value && value < 0
                  ? Promise.reject(
                      new Error("Number of hours must not be less than 0")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input
            onKeyDown={(event) => {
              if (
                // event.key === "." ||
                event.key === "-" ||
                event.key === "," ||
                event.key === "e"
              ) {
                event.preventDefault();
              }
            }}
            placeholder="120"
            type="number"
            addonAfter="hours"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOrderReceivedTimeoutPopup;
