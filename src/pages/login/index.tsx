import {
  ArrowLeftOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { LogoTrifood } from "src/assets/icons";
import ButtonConfirm from "src/components/08.buttons/ButtonConfirm";
import ButtonLogin from "src/components/08.buttons/ButtonLogin";
import TridentityCheckBox from "src/components/09.checkbox";
import { STEPS_LOGIN } from "src/constants/login";
import { MESSAGES } from "src/constants/messages";
import { PATHS } from "src/constants/paths";
import {
  setStorageJwtToken,
  setStorageRefreshToken,
} from "src/helpers/storage";
import { AuthServices } from "src/services/auth-service";
import "./styles.scss";
import InputOtp from "src/components/07.inputs/InputOtp";
import useRememberMe from "src/hooks/useRememberMe";
import {
  setAdminInformation,
  setAdminPermission,
} from "src/store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { ADMIN_PERMISSION } from "src/constants";
import { AdminPermission } from "src/types/globalStore";
import Otp from "./Otp";
import { MemberService } from "src/services/membere-service";

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isRemember, handleRemember, rememberMe } = useRememberMe();
  const [steps, setSteps] = useState(STEPS_LOGIN.NOT_LOGIN);
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();

  const authService = new AuthServices();
  const memberService = new MemberService();

  const id = localStorage.getItem("id_login");

  useEffect(() => {
    if (id && Number(id) > 0) {
      setSteps(STEPS_LOGIN.WAITTING_CONFIRM_EMAIL);
    }
  }, [id, steps]);

  async function validateOtpAndGetRole(code: string) {
    try {
      const id = localStorage.getItem("id_login") as string;
      const { data } = await authService.verifyCode({ id, otp: code });
      if (!data) throw Error;

      const { access_token, refresh_token } = data;
      setStorageJwtToken(access_token);
      setStorageRefreshToken(refresh_token);

      localStorage.removeItem("id_login");

      dispatch(setAdminInformation(data.user));

      rememberMe();

      history.push(PATHS.merchant());
      return data.user;
    } catch (error) {
      message.error(MESSAGES.MC1);
      return;
    }
  }

  async function getCurrentAdminPermission(role_id: number) {
    try {
      const { data } = await memberService.getRoleDetail(role_id);

      dispatch(setAdminPermission(data.authorities));
    } catch (error) {
      console.log(error);
    }
  }

  const onFinish = async (values: any) => {
    if (steps === STEPS_LOGIN.NOT_LOGIN) {
      const { identifier, password } = values;
      try {
        const res = await authService.login({ identifier, password });
        const id = res?.data?.id;
        if (id > 0) {
          localStorage.setItem("id_login", String(id));
        }
        setSteps(STEPS_LOGIN.WAITTING_CONFIRM_EMAIL);
        setEmail(identifier);
      } catch (error) {
        message.error(MESSAGES.MC2);
        return;
      }
    } else {
      const { otp } = values;
      if (otp) {
        const { role_id } = await validateOtpAndGetRole(otp);
        await getCurrentAdminPermission(role_id);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {};

  const handlBack = () => {
    setSteps(STEPS_LOGIN.NOT_LOGIN);
    localStorage.removeItem("id_login");
  };

  const renderLoginForm = () => {
    return (
      <>
        <Form.Item
          name="identifier"
          rules={[
            { required: true, message: "Please input your email / username!" },
          ]}
        >
          <Input
            size="large"
            placeholder="Email / Username"
            prefix={<UserOutlined className="color-default" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<LockOutlined className="color-default" />}
          />
        </Form.Item>
        <div className="login-page__form__area">
          <div>
            <TridentityCheckBox
              handleRemember={handleRemember}
              isCheck={isRemember}
            >
              Remmerber me
            </TridentityCheckBox>
          </div>
          <div
            className="color-default pointer"
            onClick={() => history.push(PATHS.forgotPassword())}
          >
            Forgot your password?
          </div>
        </div>
        <ButtonLogin htmlType="submit" />
      </>
    );
  };

  const renderWaitingConfirmEmail = () => {
    return (
      <>
        <div className="login-page__form__info">
          Welcome to Tridentity Admin portal
          <br />
          Please enter the OTP we have sent to {email}
        </div>
        <div className="flex backLogin" onClick={handlBack}>
          <ArrowLeftOutlined className="color-default" /> <div>Back</div>
        </div>
        <Form.Item
          name="code"
          rules={[{ required: true, message: "Please input your code!" }]}
          style={{ marginTop: 20 }}
        >
          <Form.Item dependencies={["code"]} style={{ marginBottom: 0 }}>
            {({ setFieldsValue }) => {
              return (
                <InputOtp
                  setOtp={(value) => {
                    setFieldsValue({ code: value });
                  }}
                />
              );
            }}
          </Form.Item>
        </Form.Item>
        <ButtonConfirm htmlType="submit" />
      </>
    );
  };

  return (
    <div className="login-page">
      <div className="login-page__wrapperLogo">
        <img src={LogoTrifood} alt="login-background" />
      </div>
      <div className="login-page__form">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          {steps === STEPS_LOGIN.NOT_LOGIN ? (
            renderLoginForm()
          ) : (
            <Otp email={email} handlBack={handlBack} />
          )}
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
