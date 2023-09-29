import { useEffect, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import "./styles.scss";
import ConfirmPopup from "../confirm-popup/confirm-popup";
import { SystemServices } from "src/services/system-service";
import { handleError } from "src/helpers/error";
import axios from "axios";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  data: Parameter | null;
}

const EditAvatarUrl: React.FC<Props> = (props) => {
  const { data, onClose, onSuccess } = props;
  const { value, tier = 0 } = data || {};
  const [openConfirmPopup, setOpenConfirmPopup] = useState<boolean>(false);
  const [form] = Form.useForm<{ url: string }>();
  const systemService = new SystemServices();

  const onFinish = () => {
    setOpenConfirmPopup(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setOpenConfirmPopup(false);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      const url = form.getFieldValue("url");
      const res = await systemService.updateAvatarByTier(tier, url);
      if (res?.status === 200) {
        message.success(`Edit avatar for tier ${tier} successfully`);
        handleCancel();
        onSuccess();
      }
    } catch (error: any) {
      handleError(error, `Edit avatar for tier ${tier} failed`);
      setOpenConfirmPopup(false);
    }
  };

  useEffect(() => {
    if (value) {
      if (typeof value === "string") form.setFieldsValue({ url: value });
    }
  }, [value, form]);

  return (
    <Form
      onFinish={onFinish}
      layout={"vertical"}
      form={form}
      style={{ maxWidth: 600 }}
      initialValues={{ url: value }}
    >
      <Modal
        title={`Edit Avatar for tier ${tier}`}
        open={!!data}
        onCancel={onClose}
        onOk={onFinish}
        okText="Save"
      >
        {
          <Form.Item dependencies={["url"]}>
            {({ getFieldValue }) => (
              <div className="tier-avatar-preview">
                <img
                  className="tier-avatar"
                  src={getFieldValue("url")}
                  alt={`Edit Avatar for tier ${tier}`}
                />
              </div>
            )}
          </Form.Item>
        }
        <Form.Item
          name="url"
          label="Avatar url"
          required
          rules={[
            { required: true, message: "Please enter avatar url" },
            {
              validator: async (_, value: string) => {
                try {
                  const res = await axios.head(value);
                  if (res.status === 200) return Promise.resolve(true);
                } catch (error) {}
                return Promise.reject("Url is invalid");
              },
            },
          ]}
        >
          <Input placeholder="Enter avatar url" type="text" />
        </Form.Item>
      </Modal>
      <ConfirmPopup
        open={openConfirmPopup}
        onClose={() => setOpenConfirmPopup(false)}
        onOk={handleConfirm}
      />
    </Form>
  );
};

export default EditAvatarUrl;
