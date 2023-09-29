import { FormItemProps } from "antd";

export interface FormMap {
  label: string;
  formName: string;
  placeholder: string;
  rules: FormItemProps["rules"];
  type:
    | "text"
    | "number"
    | "select"
    | "checkbox"
    | "ratio"
    | "textarea"
    | "image";
  options?: { label: string; value: string }[];
  optionsRatio?: { label: string; value: string | boolean }[];
  isDecimal?: boolean;
  isSingle?: boolean;
  multiple?: number;
}
