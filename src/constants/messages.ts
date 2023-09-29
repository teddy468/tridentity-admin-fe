export const MESSAGES = {
  MC1: "Your code is incorrect",
  MC2: "Email/ Username or password is incorrect",
  MC3: "Network error",
  MC4: "Please connect to correct network",
  MC5: "Please connect your wallet to the correct network",
  MC6: "This field is required",
  MC7: "Invalid amount",
  MC8: "Insufficient amount, please check your wallet",
  MC9: "Transaction successfully",
  MC10: "Transaction error",
  MC11: "You dont have enough unallocated amount",
  MC12: "You do not have permission to view admin portal",
  MC13: "User refused to provide signature",
};

export const ERRORS = {
  REQUIRED: "This field is required",
  MAX_LENGTH: (maxLength: number) => `This field is max ${maxLength} charater`,
  NOT_EXCEED_2MB: "Image cannot exceed 2MB",
  NOT_ALLOW_TYPE_FILE: "Users can not upload the type file other svg, png, jpg",
};

export const formMessageCreateCategory = {
  required: "This field is required",
  string: {
    max: "This field is max 100 charater",
  },
};

export enum IMAGE {
  NOT_EXCEED_2MB = "Image cannot exceed 2MB",
  NOT_ALLOW_TYPE_FILE = "Users can not upload the type file other svg, png, jpg",
  NOT_MATCH_RATIO = "Image aspect ratio must be 3:2",
}
