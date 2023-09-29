import { Form, Input, Modal, Select } from "antd";
import "./styles.scss";
import { getTierMembership } from "src/helpers/membership";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";

interface EditUserMembershipPopupProps {
  open: boolean;
  onClose: () => void;
  tier: string;
  onSetUserMembership: (extra_lp: number) => void;
  initialValues?: Store | undefined;
}
const EditUserMembershipPopup: React.FC<EditUserMembershipPopupProps> = ({
  open,
  onClose,
  tier,
  onSetUserMembership,
  initialValues,
}: EditUserMembershipPopupProps) => {
  const [form] = Form.useForm();
  const onFinish = (values: { upgrade_cost: number; extra_lp: number }) => {
    const { extra_lp } = values;
    onSetUserMembership(Number(extra_lp));
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
      title="Edit User - Membership "
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
        <Form.Item label="User - Membership" required>
          <Select
            className="select-category"
            value={getTierMembership(tier)}
            disabled
          />
        </Form.Item>

        <Form.Item
          name="extra_lp"
          required
          label="Extra LP"
          rules={[
            {
              required: true,
              message: "Please input Extra LP",
            },
            {
              validator: (_, value) =>
                value && value < 0
                  ? Promise.reject(
                      new Error("Extra LP must not be less than 0")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input addonAfter="%" type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserMembershipPopup;
