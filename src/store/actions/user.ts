import { AdminPermission } from "src/types/globalStore";
import { SET_ADMIN_PERMISSION, SET_ADMIN_INFORMATION, SET_ADMIN_ROLE_ID } from "../constants/user";

export const setAdminPermission = (payload: AdminPermission) => {
  return {
    type: SET_ADMIN_PERMISSION,
    payload,
  };
};

export const setAdminInformation = (payload: any) => {
  return {
    type: SET_ADMIN_INFORMATION,
    payload,
  };
};

export const setAdminRoleId = (payload: any) => {
  return {
    type: SET_ADMIN_ROLE_ID,
    payload,
  };
}
