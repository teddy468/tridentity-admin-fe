import React from "react";
import "./styles.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Form } from "antd";
import ButtonConfirm from "src/components/08.buttons/ButtonConfirm";
import InputOtp from "src/components/07.inputs/InputOtp";

interface Props {
  email: string;
  handlBack?: () => void;
}
const Otp: React.FC<Props> = ({ email, handlBack }) => {
  return (
    <div>
      {" "}
      <div className="login-page__form__info">
        Welcome to Tridentity Admin portal
        <br />
        Please enter the OTP we have sent to {email}
      </div>
      {handlBack && (
        <div className="flex backLogin" onClick={handlBack}>
          <ArrowLeftOutlined className="color-default" /> <div>Back</div>
        </div>
      )}
      <Form.Item
        name="otp"
        rules={[{ required: true, message: "Please input your code!" }]}
        style={{ marginTop: 20 }}
      >
        <Form.Item dependencies={["otp"]} style={{ marginBottom: 0 }}>
          {({ setFieldsValue }) => {
            return (
              <InputOtp
                setOtp={(value) => {
                  setFieldsValue({ otp: value });
                }}
              />
            );
          }}
        </Form.Item>
      </Form.Item>
      <ButtonConfirm htmlType="submit" />
    </div>
  );
};

export default Otp;
