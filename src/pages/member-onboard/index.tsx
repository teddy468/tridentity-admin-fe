import React, { useEffect, useState } from "react";
import Otp from "../login/Otp";
import { Form, message } from "antd";
import { useHistory, useParams } from "react-router";
import { PATHS } from "src/constants/paths";
import { LogoTrifood } from "src/assets/icons";
import { MemberService } from "src/services/membere-service";
import {
  removeStorageJwtToken,
  removeStorageRefreshToken,
} from "src/helpers/storage";

const MemberOnboard = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<{ otp: string }>();
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email") as string;

  const memberService = new MemberService();

  async function handleGetOtp() {
    try {
      const result = await memberService.getOtpMemberOnboard(id);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleVerifyOtp(values: { otp: string }) {
    message.loading("Verifying otp...", 0);
    try {
      const activeToken = await memberService.verifyOtpMemberOnboard(
        id,
        values
      );
      message.success("Verify otp success");
      history.push(
        PATHS.resetPassword().concat(
          `?tokenMember=${activeToken.data.activate_token}`
        )
      );
    } catch (error) {
      console.log(error);
      message.error("Verify otp fail");
    }
    message.destroy();
  }

  function onFinish(values: any) {
    handleVerifyOtp(values);
  }

  function onFinishFailed(errorInfo: any) {
    console.log("Failed:", errorInfo);
  }

  useEffect(() => {
    removeStorageJwtToken();
    removeStorageRefreshToken();
    handleGetOtp();
  }, []);

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
          <Otp email={email} />
        </Form>
      </div>
    </div>
  );
};

export default MemberOnboard;
