import { Checkbox, CheckboxProps } from "antd";
import "./styles.scss";
import { useEffect, useState } from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";

interface ICheckBox extends CheckboxProps {
  isCheck?: boolean;
  handleRemember?: (e: CheckboxChangeEvent) => void;
  children?: React.ReactNode;
}

const TridentityCheckBox: React.FC<ICheckBox> = (props: ICheckBox) => {
  const { children, handleRemember, isCheck } = props;
  return (
    <Checkbox {...props} checked={isCheck} onChange={handleRemember}>
      {children}
    </Checkbox>
  );
};

export default TridentityCheckBox;
