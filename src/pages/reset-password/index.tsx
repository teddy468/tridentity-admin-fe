import { UserOutlined } from "@ant-design/icons";
import { Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { LogoTrifood } from "src/assets/icons";
import ButtonLogin from "src/components/08.buttons/ButtonLogin";
import { PATHS } from "src/constants/paths";
import { AuthServices } from "src/services/auth-service";
import "./styles.scss";

const ResetPasswordPage = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const reset_password_token = (urlParams.get("token") as string) || "";
  const create_member_password_token =
    (urlParams.get("tokenMember") as string) || "";

  const authService = new AuthServices();
  async function resetPassword(values: any) {
    try {
      const res = await authService.resetPassword({
        new_password: values.new_password,
        reset_password_token,
      });
      if (res.status >= 200 && res.status < 400) {
        message.success("Password has been reset");
        setTimeout(() => {
          history.push(PATHS.login());
        }, 1000);
      }
    } catch (error) {
      throw error;
    }
  }

  async function createPasswordMember(values: any) {
    try {
      const res = await authService.createPasswordMember({
        new_password: values.new_password,
        activate_token: create_member_password_token,
      });
      if (res.status >= 200 && res.status < 400) {
        message.success("Password has been reset");
        setTimeout(() => {
          history.push(PATHS.login());
        }, 1000);
      }
    } catch (error) {
      throw error;
    }
  }
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      if (reset_password_token) {
        await resetPassword(values);
      }
      if (create_member_password_token) {
        await createPasswordMember(values);
      }
    } catch (error) {
      message.error(
        "Entered Password does not match or token has been expired "
      );
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
          label={"Enter New Password"}
          name="new_password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 8,
              message: "Password must be between 8 to 20 characters",
            },
            {
              max: 20,
              message: "Password must be between 8 to 20 characters",
            },
          ]}
        >
          <Input
            type="password"
            size="large"
            placeholder="Enter Password"
            prefix={<UserOutlined className="color-default" />}
          />
        </Form.Item>
        <Form.Item
          label={"Confirm New Password"}
          name="current_password"
          dependencies={["new_password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },

            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Entered Password does not match")
                );
              },
            }),
          ]}
        >
          <Input
            type="password"
            size="large"
            placeholder="Re- Enter Password"
            prefix={<UserOutlined className="color-default" />}
          />
        </Form.Item>
        <ButtonLogin htmlType="submit" label="Submit" loading={loading} />
      </>
    );
  };

  return (
    <div className="forgot-page">
      <div className="forgot-page__wrapperLogo">
        <img src={LogoTrifood} alt="login-background" />
      </div>
      <div className="forgot-page__textReset">Set your password</div>
      <div className="forgot-page__form">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          layout="vertical"
        >
          {renderEmailForm()}
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
