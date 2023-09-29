import {
  CURRENT_NOTIFICATION,
  CLEAR_CURRENT_NOTIFICATION,
} from "../constants/notification";

export const clearCurrentNotification = () => {
  return {
    type: CLEAR_CURRENT_NOTIFICATION,
  };
};

export const setCurrentNotification = (count: string | number) => {
  return {
    type: CURRENT_NOTIFICATION,
    payload: { count },
  };
};
