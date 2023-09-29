import { Form } from "antd";
import { useHistory } from "react-router";
import { LogoTrifood } from "src/assets/icons";
import ButtonLogin from "src/components/08.buttons/ButtonLogin";
import { PATHS } from "src/constants/paths";
import "./styles.scss";

const ForgotSuccessPage = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const urlParams = new URLSearchParams(window.location.search);
  const myEmail =
    window.location.search.split("=")[1] || urlParams.get("email");

  const onFinish = async (values: any) => {
    history.push(PATHS.login());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const renderEmailForm = () => {
    return (
      <>
        <div className="forgot-success-page__form__area">
          <div className="">
            An email has been sent to:{" "}
            <span style={{ fontWeight: 600 }}>{myEmail}</span> Please check your
            email to reset your password
          </div>
        </div>
        <ButtonLogin htmlType="submit" label="Back To Login" />
      </>
    );
  };

  return (
    <div className="forgot-success-page">
      <div className="forgot-success-page__wrapperLogo">
        <img src={LogoTrifood} alt="login-background" />
      </div>
      <div className="forgot-success-page__form">
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

export default ForgotSuccessPage;
