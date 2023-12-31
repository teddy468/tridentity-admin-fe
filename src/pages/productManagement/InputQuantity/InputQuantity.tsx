import { useEffect, useState } from "react";
import styles from "./input-quantity.module.scss";
import { AddCircleIcon, MinusCircleIcon } from "../../../assets/icons";
import { getNumberOnRange } from "../PreviewProduct/PreviewProduct";
interface InputQuantityProps {
  quantity: number;
  max: number;
  onChange: (number: number) => void;
  disabled?: boolean;
}
const InputQuantity: React.FC<InputQuantityProps> = ({
  quantity,
  max,
  onChange,
  disabled,
}: InputQuantityProps) => {
  const [value, setValue] = useState(`${quantity}`);

  useEffect(() => {
    setValue(`${quantity}`);
  }, [quantity]);

  const handleChange = (value: string | number) => {
    onChange(getNumberOnRange(Number(value) || 1, 1, max));
  };

  const handleChangeInput = (event: any) => {
    const value = event.target.value;
    setValue(`${value ? getNumberOnRange(Number(value), 1, max) : ""}`);
    if (value) handleChange(value);
  };

  const onBlur = () => {
    setValue(`${getNumberOnRange(Number(value || quantity), 1, max)}`);
  };
  return (
    <div className={styles.wrapper}>
      <div
        className={[
          styles.buttonWrapper,
          +value <= 1 ? styles.disabled : "",
        ].join(" ")}
        onClick={() => handleChange(quantity - 1)}
      >
        <MinusCircleIcon />
      </div>
      <input
        value={value}
        onChange={handleChangeInput}
        onBlur={onBlur}
        style={{ width: "60px", marginLeft: "13px" }}
      />
      <div
        className={[
          styles.buttonWrapper,
          +value >= max ? styles.disabled : "",
        ].join(" ")}
        onClick={() => handleChange(quantity + 1)}
      >
        <AddCircleIcon />
      </div>
    </div>
  );
};

export default InputQuantity;
