export const PHONE_NUMBER_PATTERN = /^\.*[6|8|9]\d{7}$/gm;
export const PHONE_NUMBER_VIETNAM = /([3|5|7|8|9])+([0-9]{8})\b/g;

export const CODE_SINGAPORE = "+65";
export const CODE_SINGAPORE_OPEN = "+650";

export const handlePhoneNumber = (phone: string) => {
  const prefixLocation = phone.includes(CODE_SINGAPORE);
  if (prefixLocation) {
    if (phone.includes(CODE_SINGAPORE_OPEN)) {
      return phone.replace(CODE_SINGAPORE_OPEN, "");
    } else {
      return phone.replace(CODE_SINGAPORE, "");
    }
  } else {
    return phone;
  }
};
