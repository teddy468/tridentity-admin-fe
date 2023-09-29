import { UserReduxStore } from "src/types/globalStore";
import {
  SET_ADMIN_PERMISSION,
  SET_ADMIN_INFORMATION,
  SET_ADMIN_ROLE_ID,
} from "../constants/user";
import { isHavePermissionToEdit } from "src/helpers";

const initialState: UserReduxStore = {
  adminPermission: null,
  adminInformation: null,
  "user-management-permission": false,
  "notification-permission": false,
  "category-and-attribute-permission": false,
  "product-management-permission": false,
  "dashboard-config-permission": false,
  "settlement-report-permission": false,
  "parameters-permission": false,
  "email-template-permission": false,
  "report-permission": false,
  "lp-management-permission": false,
  "tri-member-permission": false,
  "logistic-fee-permission": false,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_ADMIN_PERMISSION:
      return {
        ...state,
        adminPermission: action.payload,
        "user-management-permission": isHavePermissionToEdit(
          action.payload["user-management"]
        ),
        "notification-permission": isHavePermissionToEdit(
          action.payload.notification
        ),
        "category-and-attribute-permission": isHavePermissionToEdit(
          action.payload["category-and-attribute"]
        ),
        "product-management-permission": isHavePermissionToEdit(
          action.payload["product-management"]
        ),
        "dashboard-config-permission": isHavePermissionToEdit(
          action.payload["dashboard-config"]
        ),
        "settlement-report-permission": isHavePermissionToEdit(
          action.payload["settlement-report"]
        ),
        "parameters-permission": isHavePermissionToEdit(
          action.payload.parameters
        ),
        "email-template-permission": isHavePermissionToEdit(
          action.payload["email-template"]
        ),
        "report-permission": isHavePermissionToEdit(action.payload.report),
        "lp-management-permission": isHavePermissionToEdit(
          action.payload["lp-management"]
        ),
        "tri-member-permission": isHavePermissionToEdit(
          action.payload["tri-member"]
        ),
        "logistic-fee-permission": isHavePermissionToEdit(
          action.payload["logistic-fee"]
        ),
      };

    case SET_ADMIN_INFORMATION:
      return {
        ...state,
        adminInformation: action.payload,
      };

    case SET_ADMIN_ROLE_ID:
      const newState = { ...state };
      if (!newState.adminInformation) {
        return state;
      }
      newState.adminInformation.role_id = action.payload;

      return { ...newState };
    default:
      return state;
  }
};
