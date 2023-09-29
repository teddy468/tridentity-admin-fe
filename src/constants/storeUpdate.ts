import { FormItemProps } from "antd";
import { FormMap } from "src/types/form-map";

export enum SERVICE_SUPPORTS {
  PICKUP = "pickup",
  DINE_IN = "dine in",
  DELIVERY = "delivery",
}
export const SERVICE_SUPPORT_OPTIONS = [
  { value: SERVICE_SUPPORTS.PICKUP, label: "Pick-up" },
  { value: SERVICE_SUPPORTS.DINE_IN, label: "Dine-in" },
  { value: SERVICE_SUPPORTS.DELIVERY, label: "Delivery" },
];

export const YES_NO_OPTIONS = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

export const basicInfo: FormMap[] = [
  {
    label: "Store name",
    formName: "name",
    placeholder: "Enter your Store name",
    rules: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
    type: "text",
  },
  {
    label: "Store logo",
    formName: "logo",
    placeholder: "Choose store logo",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "image",
    isSingle: true,
    multiple: 1,
  },
  {
    label: "Store banner",
    formName: "banners",
    placeholder: "Choose store banner",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "image",
    isSingle: false,
    multiple: 3,
  },
  {
    label: "Service support",
    formName: "service_supports",
    placeholder: "Choose service support",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "checkbox",
    options: SERVICE_SUPPORT_OPTIONS,
  },
  {
    label: "Minimum order",
    formName: "min_order",
    placeholder: "Enter minimum order",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "number",
    isDecimal: true,
  },
  {
    label: "Auto complete order timeout",
    formName: "hours_until_auto_complete",
    placeholder: "Enter auto complete order timeout",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "number",
    isDecimal: false,
  },
  {
    label: "Description",
    formName: "description",
    placeholder: "Enter store description",
    rules: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
    type: "textarea",
  },
  {
    label: "Contact person",
    formName: "outletContactPerson",
    placeholder: "Enter contact person",
    rules: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
    type: "text",
  },
  {
    label: "Halal certification",
    formName: "halalCertified",
    placeholder: "Enter halal certification",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "ratio",
    optionsRatio: YES_NO_OPTIONS,
  },
  {
    label: "Muslim owned",
    formName: "muslimOwned",
    placeholder: "Enter muslim owned",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "ratio",
    optionsRatio: YES_NO_OPTIONS,
  },
  {
    label: "Open 24 hours",
    formName: "isOpen24Hours",
    placeholder: "Choose open 24/7",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "ratio",
    optionsRatio: YES_NO_OPTIONS,
  },
];

export const basicInfoStoreOnBoard: FormMap[] = [
  {
    label: "POS ID",
    formName: "POSIds",
    placeholder: "Enter POS ID",
    rules: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
    type: "number",
    isDecimal: false,
  },
  {
    label: "Store name",
    formName: "name",
    placeholder: "Enter your Store name",
    rules: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
    type: "text",
  },
  {
    label: "Store logo",
    formName: "logo",
    placeholder: "Choose store logo",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "image",
    isSingle: true,
    multiple: 1,
  },
  {
    label: "Store banner",
    formName: "banners",
    placeholder: "Choose store banner",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "image",
    isSingle: false,
    multiple: 3,
  },
  {
    label: "Service support",
    formName: "service_supports",
    placeholder: "Choose service support",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "checkbox",
    options: SERVICE_SUPPORT_OPTIONS,
  },
  {
    label: "Minimum order",
    formName: "min_order",
    placeholder: "Enter minimum order",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "number",
    isDecimal: true,
  },
  {
    label: "Auto complete order timeout",
    formName: "hours_until_auto_complete",
    placeholder: "Enter auto complete order timeout",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "number",
    isDecimal: false,
  },
  {
    label: "Description",
    formName: "description",
    placeholder: "Enter store description",
    rules: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
    type: "textarea",
  },
  {
    label: "Contact person",
    formName: "outletContactPerson",
    placeholder: "Enter contact person",
    rules: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
    type: "text",
  },
  {
    label: "Halal certification",
    formName: "halalCertified",
    placeholder: "Enter halal certification",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "ratio",
    optionsRatio: YES_NO_OPTIONS,
  },
  {
    label: "Muslim owned",
    formName: "muslimOwned",
    placeholder: "Enter muslim owned",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "ratio",
    optionsRatio: YES_NO_OPTIONS,
  },
  {
    label: "Open 24 hours",
    formName: "isOpen24Hours",
    placeholder: "Choose open 24/7",
    rules: [
      {
        required: true,
        message: "This field is required",
      },
    ],
    type: "ratio",
    optionsRatio: YES_NO_OPTIONS,
  },
];
