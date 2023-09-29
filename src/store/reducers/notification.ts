import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { STATUS_CODE } from "src/constants/status-code";
import { NotificationServices } from "src/services/notification-service";
import { setCurrentNotification } from "../actions/notification";
import {
  CLEAR_CURRENT_NOTIFICATION,
  CURRENT_NOTIFICATION,
} from "../constants/notification";

const initialState = "";

export const notificationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CLEAR_CURRENT_NOTIFICATION:
      return 0;

    case CURRENT_NOTIFICATION:
      const { count } = action.payload;
      return count;

    default:
      return state;
  }
};

export const fetchListUnread = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const notiService = new NotificationServices();

    try {
      const res = await notiService.countUnread();

      if (res.data?.unread > -1 && res.status === STATUS_CODE.SUCCESS) {
        dispatch(setCurrentNotification(res.data?.unread));
      }
    } catch (err) {}
  };
};
