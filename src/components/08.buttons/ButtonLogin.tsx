import { Button, ButtonProps } from "antd";
import "./styles.scss";

interface IButtonLogin extends ButtonProps {
  label ?: string;
}

const ButtonLogin: React.FC<IButtonLogin> = (props: IButtonLogin) => {
  const {label} = props
  return (
    <Button type="primary" block {...props} size="large">
      {label || 'Login'}
    </Button>
  );
};

export default ButtonLogin;
