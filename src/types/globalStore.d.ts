import { ADMIN_PERMISSION } from "src/constants";

declare interface ReduxStore {
  user: UserReduxStore;
  notification: string;
}

declare interface UserReduxStore {
  adminPermission: AdminPermission | null;
  adminInformation: AdminInformation | null;
  "user-management-permission": boolean;
  "notification-permission": boolean;
  "category-and-attribute-permission": boolean;
  "product-management-permission": boolean;
  "dashboard-config-permission": boolean;
  "settlement-report-permission": boolean;
  "parameters-permission": boolean;
  "email-template-permission": boolean;
  "report-permission": boolean;
  "lp-management-permission": boolean;
  "tri-member-permission": boolean;
  "logistic-fee-permission": boolean;
}

declare interface AdminInformation {
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  id: string;
  identifier: string;
  last_login_at: Date | null;
  role: string;
  role_id: number;
  status: number;
}

declare interface AdminPermission {
  "user-management"?: ADMIN_PERMISSION;
  notification?: ADMIN_PERMISSION;
  "category-and-attribute"?: ADMIN_PERMISSION;
  "product-management"?: ADMIN_PERMISSION;
  "dashboard-config"?: ADMIN_PERMISSION;
  "settlement-report"?: ADMIN_PERMISSION;
  parameters?: ADMIN_PERMISSION;
  "email-template"?: ADMIN_PERMISSION;
  report?: ADMIN_PERMISSION;
  "lp-management"?: ADMIN_PERMISSION;
  "tri-member"?: ADMIN_PERMISSION;
  "logistic-fee"?: ADMIN_PERMISSION;
}
