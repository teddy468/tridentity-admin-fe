import { format2Digit } from "src/constants";

export const convertMilisecondsToHours = (value: number) => {
  return value / 3600000;
};

export const convertHoursToMiliseconds = (value: number) => {
  return value * 3600000;
};

export const formatDisplaySystemMetaParameter = (object: {
  [key: string]: number;
}) => {
  let result = "";
  let formatedData = Object.keys(object).map((key) => {
    if (key === "percent") {
      return `${object[key]}%`;
    }
    if (key === "extra_lp") {
      return `${object[key]}% Extra LP`;
    }

    if (key === "platform_fee_discount") {
      return ` ${object[key]}% Platform Fee Discount`;
    }
    if (key === "timeout") {
      return `Timeout: ${convertMilisecondsToHours(object[key])} hour (s)`;
    }
    if (key === "lp_rate") {
      return `${object[key]} LP`;
    }
    if (key === "sgd_rate") {
      return `${format2Digit(object[key])} SGD`;
    }
    if (key === "upgrade_cost") {
      return `Upgrade Cost: ${object[key]} LP`;
    }
    if (key === "is_fixed_shipping_fee_enabled") {
      return `${object[key]}`;
    }
    if (key === "fixed_shipping_fee") {
      return `${format2Digit(object[key])} SGD`;
    }
    if (key === "min_order") {
      return `${format2Digit(object[key])} SGD`;
    }

    return `${object[key]} ${key.split("_").join(" ")}`;
  });
  if (object.lp_rate) {
    result = formatedData.join(" = ");
  } else {
    result = formatedData.join(", ");
  }
  return result;
};
