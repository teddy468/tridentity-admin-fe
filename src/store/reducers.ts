import { combineReducers } from "redux";
import { notificationReducer } from "./reducers/notification";
import { userReducer } from "./reducers/user";

const appReducer = combineReducers({
  user: userReducer,
  notification: notificationReducer,
});

export const rootReducer = (state: any, action: any) =>
  appReducer(state, action);
