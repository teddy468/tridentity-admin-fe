import { Form, Input, Modal, Select } from "antd";
import "./styles.scss";
import { getTierMembership } from "src/helpers/membership";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";

interface EditMerchantMembershipPopupProps {
  open: boolean;
  onClose: () => void;
  tier: string;
  onSetMerchantMembership: (platform_fee_discount: number) => void;
  initialValues?: Store | undefined;
}
const EditMerchantMembershipPopup: React.FC<
  EditMerchantMembershipPopupProps
> = ({
  open,
  onClose,
  tier,
  initialValues,
  onSetMerchantMembership,
}: EditMerchantMembershipPopupProps) => {
  const [form] = Form.useForm();
  const onFinish = (values: { platform_fee_discount: number }) => {
    onSetMerchantMembership(Number(values.platform_fee_discount));
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
      title="Edit Merchant - Membership "
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
        <Form.Item label="Edit Merchant  - Membership" required>
          <Select
            className="select-category"
            value={getTierMembership(tier)}
            disabled
          />
        </Form.Item>
        <Form.Item
          name="platform_fee_discount"
          label="Platform fee discount"
          required
          rules={[
            {
              required: true,
              message: "Please input platform fee discount",
            },
            {
              validator: (_, value) =>
                value && value < 0
                  ? Promise.reject(
                      new Error(
                        "Platform fee discount must not be lesss than 0"
                      )
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="10" addonAfter="%" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMerchantMembershipPopup;
