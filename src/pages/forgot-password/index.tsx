import { UserOutlined } from "@ant-design/icons";
import { Form, Input, message } from "antd";
import { useState } from "react";
import { useHistory } from "react-router";
import { LogoTrifood } from "src/assets/icons";
import ButtonLogin from "src/components/08.buttons/ButtonLogin";
import { PATHS } from "src/constants/paths";
import { AuthServices } from "src/services/auth-service";
import "./styles.scss";

const ForgotPasswordPage = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const authService = new AuthServices();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await authService.forgotPassword(values.email);
      if (res.status >= 200 && res.status < 400) {
        history.push(`${PATHS.forgotSuccess()}?email=${values?.email}`);
      }
    } catch (error) {
      message.error("Incorrect your email!");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const renderEmailForm = () => {
    return (
      <>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email" }]}
        >
          <Input
            size="large"
            placeholder="Enter Admin Email"
            prefix={<UserOutlined className="color-default" />}
          />
        </Form.Item>
        <div className="forgot-page__form__area">
          <div className="">Enter your email for password recovery</div>
        </div>
        <ButtonLogin htmlType="submit" label="Submit" loading={loading} />
      </>
    );
  };

  return (
    <div className="forgot-page">
      <div className="forgot-page__wrapperLogo">
        <img src={LogoTrifood} alt="login-background" />
      </div>
      <div className="forgot-page__textReset">Reset Password</div>
      <div className="forgot-page__form">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          {renderEmailForm()}
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
