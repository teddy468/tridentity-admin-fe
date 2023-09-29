import { Form, Input, Modal } from "antd";
import "./styles.scss";
import { SwapOutlined } from "@ant-design/icons";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";

interface EditMerchantExchangeRatePopupProps {
  open: boolean;
  onClose: () => void;
  onSetMerchantExchangeRate: (lp_rate: number, sgd_rate: number) => void;
  initialValues?: Store | undefined;
}
const EditMerchantExchangeRatePopup: React.FC<EditMerchantExchangeRatePopupProps> = ({
  open,
  onClose,
  onSetMerchantExchangeRate,
  initialValues,
}: EditMerchantExchangeRatePopupProps) => {
  const [form] = Form.useForm();
  const onFinish = async (values: { lp_rate: number; sgd_rate: number }) => {
    const { lp_rate, sgd_rate } = values;
    onSetMerchantExchangeRate(Number(lp_rate), Number(sgd_rate));
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
      title="Edit LP Merchant Exchange Rate"
      open={open}
      onCancel={handleCancel}
      okText="Save"
      onOk={() => form.submit()}
    >
      <Form
        onFinish={onFinish}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={initialValues}
      >
        <div className="form-content">
          <Form.Item
            name="lp_rate"
            rules={[
              {
                required: true,
                message: "Please input LP Rate",
              },
              {
                validator: (_, value) =>
                  value && value <= 0
                    ? Promise.reject(
                        new Error("LP Rate must be greater than 0")
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              onKeyDown={(event) => {
                if (
                  event.key === "." ||
                  event.key === "-" ||
                  event.key === "," ||
                  event.key === "e"
                ) {
                  event.preventDefault();
                }
              }}
              placeholder="100"
              type="number"
              addonAfter="LP"
            />
          </Form.Item>
          <Form.Item>
            <SwapOutlined />
          </Form.Item>
          <Form.Item
            name="sgd_rate"
            rules={[
              {
                required: true,
                message: "Please input SGD Rate",
              },
              {
                validator: (_, value) =>
                  value && value <= 0
                    ? Promise.reject(
                        new Error("SGD Rate must be greater than 0")
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <Input placeholder="1" type="number" addonAfter="SGD" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditMerchantExchangeRatePopup;
