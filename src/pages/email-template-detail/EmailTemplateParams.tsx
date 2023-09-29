import { Form, Input } from "antd";
import { ERRORS } from "src/constants/messages";
import "./styles.scss";

const EmailTemplateParams: React.FC = () => {
  return (
    <div>
      <Form.Item
        name="sender_name"
        label="Sender Name"
        rules={[
          { required: true, message: ERRORS.REQUIRED },
          {
            validator: (_, value) =>
              value && !value.trim()
                ? Promise.reject(ERRORS.REQUIRED)
                : Promise.resolve(),
          },
        ]}
        labelCol={{ span: 6 }}
      >
        <Input placeholder="Enter Sender Name" />
      </Form.Item>
      <Form.Item
        name="subject"
        label="Subject"
        rules={[
          { required: true, message: ERRORS.REQUIRED },
          {
            validator: (_, value) =>
              value && !value.trim()
                ? Promise.reject(ERRORS.REQUIRED)
                : Promise.resolve(),
          },
        ]}
        labelCol={{ span: 6 }}
      >
        <Input placeholder="Enter Subject" />
      </Form.Item>
      <Form.Item
        name="pre_header"
        label="Pre-Header"
        rules={[
          { required: true, message: ERRORS.REQUIRED },
          {
            validator: (_, value) =>
              value && !value.trim()
                ? Promise.reject(ERRORS.REQUIRED)
                : Promise.resolve(),
          },
        ]}
        labelCol={{ span: 6 }}
      >
        <Input placeholder="Enter Pre-Header" />
      </Form.Item>
    </div>
  );
};

export default EmailTemplateParams;
