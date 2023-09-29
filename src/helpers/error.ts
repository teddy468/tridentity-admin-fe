import { message } from "antd";
import { isArray } from "lodash";

export const handleError = (error: any, defaultError?: string) => {
  const errorMsg = error?.response?.data?.error?.message;
  message.error(
    isArray(errorMsg) && errorMsg.length > 0
      ? errorMsg[0]
      : errorMsg || defaultError
  );
};
