import { LockOutlined } from "@ant-design/icons";
import { Input, InputProps } from "antd";
import "./styles.scss";

interface IInputPassword extends InputProps {
  zindexicon?: number;
}

const InputPassword: React.FC<IInputPassword> = (props: IInputPassword) => {
  return (
    <Input.Password
      size="large"
      placeholder="Password"
      prefix={<LockOutlined className="color-default"/>}
    />
  );
};

export default InputPassword;
