import { UserOutlined } from "@ant-design/icons";
import { Input, InputProps } from "antd";
import "./styles.scss";

interface IInputEmail extends InputProps {
  zindexicon?: number;
}

const InputEmail: React.FC<IInputEmail> = (props: IInputEmail) => {
  return (
    <Input
      size="large"
      placeholder="Email"
      prefix={<UserOutlined className="color-default" />}
    />
  );
};

export default InputEmail;
