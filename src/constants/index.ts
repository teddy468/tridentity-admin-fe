import BigNumber from "bignumber.js";

export const IMAGE_TYPE_ALLOW = {
  SVG: "image/svg+xml",
  JPG: "image/jpg",
  JPEG: "image/jpeg",
  PNG: "image/png",
  MP4: "video/mp4",
};

export const IMAGE_SIZE_ALLOW = {
  twoMB: 2 * 1024 * 1024,
};

export enum ORDER_STATUS {
  PENDING = 0,
  CONFIRMED = 1,
  DELIVERING = 2,
  DELIVERED = 3,
  CANCELLED = 4,
  REFUNDING = 5,
  REFUNDED = 6,
  SUCCEEDED = 7,
  SETTLED = 8,
  WAITING_FOR_PAYMENT = 9,
  REJECTED = 10,
  EXPIRED = 11,
  ON_GOING = 12,
  COMPLETED = 13,
  USER_PICKED_UP = 14,
  PREPARED = 15,
  PAID = 16,
  REFUND_REJECTED = 17,
}

export const getOrderStatus = (status: number) => {
  if (status === ORDER_STATUS.PENDING) {
    return "Pending";
  } else if (status === ORDER_STATUS.CONFIRMED) {
    return "Confirmed";
  } else if (status === ORDER_STATUS.DELIVERING) {
    return "Delivering";
  } else if (status === ORDER_STATUS.DELIVERED) {
    return "Delivered";
  } else if (status === ORDER_STATUS.CANCELLED) {
    return "Cancelled";
  } else if (status === ORDER_STATUS.REFUNDING) {
    return "Refunding";
  } else if (status === ORDER_STATUS.REFUNDED) {
    return "Refunded";
  } else if (status === ORDER_STATUS.SUCCEEDED) {
    return "Succeeded";
  } else if (status === ORDER_STATUS.SETTLED) {
    return "Settled";
  } else if (status === ORDER_STATUS.WAITING_FOR_PAYMENT) {
    return "Waiting for payment";
  } else if (status === ORDER_STATUS.REFUNDED) {
    return "Refunded";
  } else if (status === ORDER_STATUS.EXPIRED) {
    return "Expired";
  } else if (status === ORDER_STATUS.ON_GOING) {
    return "On going";
  } else if (status === ORDER_STATUS.COMPLETED) {
    return "Completed";
  } else if (status === ORDER_STATUS.USER_PICKED_UP) {
    return "User picked up";
  } else if (status === ORDER_STATUS.PREPARED) {
    return "Prepared";
  } else if (status === ORDER_STATUS.REFUND_REJECTED) {
    return "Refund refused";
  } else {
    return "Paid";
  }
};

export const format2Digit = (value: number | string) => {
  return new BigNumber(value || 0).toFormat(2, 1);
};

export enum MAIN_TAG {
  hot = "Hot",
  best_seller = "Best Seller",
  new = "New Dish",
}

export enum ADMIN_PERMISSION {
  NoPermission = 0,
  View = 1,
  Edit = 2,
}

export enum MerchantStoreStatus {
  CLOSED = 2,
  LIVE = 1,
  SUSPENDED = 0,
}

export enum StoreStatusRequest {
  ONBOARDING = "ONBOARDING",
  OFFICAL = "OFFICAL",
  UPDATE = "UPDATE",
}

export const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
