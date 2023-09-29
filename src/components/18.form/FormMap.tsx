import React, { Fragment } from "react";
import { FormItemProps } from "antd/lib/form";
import CustomInput from "src/pages/productManagement/CustomInput/CustomInput";
import { removeExtraSpace } from "src/helpers";
import { FormInstance } from "antd/es/form/Form";
import {
  decimalOnlyInput,
  filterECharacterInputDecimal,
  filterECharacterInputNumber,
  integerOnlyInput,
} from "src/helpers/integerOnly";
import CustomCheckbox from "../09.checkbox/CustomCheckbox";
import CustomSelect from "../19.select/CustomSelect";
import { Input } from "antd";
import CustomTextarea from "../07.inputs/CustomTextarea";
import RadioBoxList from "../23.radioBoxList/RadioBoxList";
import CustomImageInput from "../25.customImageInput/CustomImageInput";

interface Props {
  arrayField: {
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
      | "date"
      | "time"
      | "textarea"
      | "image";
    options?: { label: string; value: string }[];
    optionsRatio?: { label: string; value: string | boolean }[];
    isDecimal?: boolean;
    isSingle?: boolean;
    multiple?: number;
  }[];
  form: FormInstance;
  isFormFilled: boolean;
}
const FormMap: React.FC<Props> = ({ arrayField, form, isFormFilled }) => {
  return (
    <>
      {arrayField.map((field, idx: number) => {
        if (field.type === "text") {
          return (
            <Fragment key={idx}>
              <CustomInput
                name={field.formName}
                label={field.label}
                placeholder={field.label}
                onBlur={(e) => removeExtraSpace(e, form, field.formName)}
                rules={field.rules}
              />
            </Fragment>
          );
        }
        if (field.type === "number") {
          return (
            <Fragment key={idx}>
              <CustomInput
                name={field.formName}
                label={field.label}
                placeholder={field.label}
                onBlur={(e) => removeExtraSpace(e, form, field.formName)}
                onKeyDown={
                  field.isDecimal ? decimalOnlyInput : integerOnlyInput
                }
                onChange={(e) =>
                  field.isDecimal
                    ? filterECharacterInputDecimal(field.formName, form, e)
                    : filterECharacterInputNumber(field.formName, form, e)
                }
                rules={field.rules}
              />
            </Fragment>
          );
        }
        if (field.type === "checkbox") {
          return (
            <Fragment key={idx}>
              {
                <CustomCheckbox
                  name={field.formName}
                  label={field.label}
                  rules={field.rules}
                  options={field.options}
                />
              }
            </Fragment>
          );
        }
        if (field.type === "select") {
          return (
            <Fragment key={idx}>
              <CustomSelect
                name={field.formName}
                label={field.label}
                rules={field.rules}
                placeholder={field.label}
                options={field.options}
              />
            </Fragment>
          );
        }
        if (field.type === "textarea") {
          return (
            <Fragment key={idx}>
              <CustomTextarea
                name={field.formName}
                label={field.label}
                placeholder={field.label}
                onBlur={(e) => removeExtraSpace(e, form, field.formName)}
                rules={field.rules}
                showCount={true}
                maxLength={3000}
              />
            </Fragment>
          );
        }
        if (field.type === "ratio") {
          return (
            <Fragment key={idx}>
              <RadioBoxList
                name={field.formName}
                label={field.label}
                rules={field.rules}
                options={field.optionsRatio}
              />
            </Fragment>
          );
        }
        if (field.type === "image") {
          return (
            <Fragment key={idx}>
              <CustomImageInput
                name={field.formName}
                label={field.label}
                square
                isSingle={field.isSingle}
                multiple={field.multiple}
                onError={(err) =>
                  form?.setFields([{ name: field.formName, errors: [err] }])
                }
                rules={[{ required: true, message: "This field is required" }]}
                isEdit={true}
                form={form}
                isFormFilled={isFormFilled}
              />
            </Fragment>
          );
        }
      })}
    </>
  );
};

export default FormMap;
