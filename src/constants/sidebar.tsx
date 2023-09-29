import {
  AppstoreAddOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MailOutlined,
  NotificationOutlined,
  ScheduleOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { ReconIcon } from "../assets/icons";

export const MENUS_KEY = {
  MERCHANT: "merchant",
  store: "store",
  DASHBOARD: "dashboard",
  TRANSACTION: "transaction",
  BALANCE: "balance",
  PERFORMANCE: "performance",
  CONFIGURATION: "configuration",
  INVESTMENT_MANAGEMENT: "investment-management",
  CATEGORY_AND_ATTRIBUTE: "category-and-attribute",
  PRODUCT_MANAGEMENT: "product-management",
  DASHBOARD_CONFIG: "dashboard-config",
  RECONCILIATION: "settlement-report",
  PARAMETERS: "parameters",
  EMAIL_TEMPLATE: "email-template",
  REPORT: "report",
  NOTIFICATION: "notification",
  LP_MANAGEMENT: "lp-management",
  member: "member",
  LOGISTICFEE: "logistic-fee",
  roles: "roles",
};

export const MENUS_LABEL = {
  USER_MANAGEMENT: "User management",
  CATEGORY_AND_ATTRIBUTE: "Category & Attribute",
};

export const SUB_KEY = {
  TRANSACTION: [{ key: "merchant", label: "Merchant", path: "merchant" }],
};

export const MENUS_ITEM = {
  USER_MANAGEMENT: {
    key: "user-management",
    label: "User management",
    level: 1,
    icon: <UsergroupDeleteOutlined />,
    children: [
      { key: "merchant", label: "Merchant", path: "merchant", level: 2 },
      { key: "consumer", label: "Consumer", path: "consumer", level: 2 },
      { key: "store", label: "Store", path: "store", level: 2 },
    ],
  },
  NOTIFICATION: {
    key: "notification",
    label: "Notification",
    level: 1,
    icon: <NotificationOutlined />,
  },
  CATEGORY_AND_ATTRIBUTE: {
    key: "category-and-attribute",
    label: "Category & Attribute",
    level: 1,
    icon: <DeploymentUnitOutlined />,
    children: [],
  },
  PRODUCT_MANAGEMENT: {
    key: "product-management",
    label: "Product management",
    level: 1,
    icon: <UsergroupDeleteOutlined />,
  },
  DASHBOARD_CONFIG: {
    key: "dashboard-config",
    label: "Dashboard config",
    level: 1,
    icon: <AppstoreAddOutlined />,
  },
  RECONCILIATION: {
    key: "settlement-report",
    label: "Settlement Report",
    level: 1,
    icon: <ReconIcon />,
  },
  PARAMETERS: {
    key: "parameters",
    label: "Parameters",
    level: 1,
    icon: <ScheduleOutlined />,
  },
  EMAIL_TEMPLATE: {
    key: "email-template",
    label: "Email Template",
    level: 1,
    icon: <MailOutlined />,
  },
  REPORT: {
    key: "report",
    label: "Report",
    level: 1,
    icon: <FileTextOutlined />,
  },
  LP_MANAGEMENT: {
    key: "lp-management",
    label: `LP Management`,
    level: 1,
    icon: <DatabaseOutlined />,
  },
  TRI_MEMBER: {
    key: "tri-member",
    label: "Trifood Member",
    level: 1,
    icon: <UsergroupDeleteOutlined />,
    children: [
      { key: "member", label: "Member Management", path: "member", level: 2 },
      { key: "role", label: "Role management", path: "role", level: 2 },
    ],
  },
  LOGISTIC_FEE: {
    key: "logistic-fee",
    label: "Logistic Fee",
    level: 1,
    icon: <UsergroupDeleteOutlined />,
  },
  LOGOUT: {
    key: "logout",
    label: "Logout",
    level: 1,
    icon: <LogoutOutlined />,
  },
};

export const DEEP_MENUS = [
  {
    name: "User management",
    key: "user-management",
    breadcrumb: [""],
    children: [
      { key: "merchant", label: "Merchant", path: "merchant", level: 2 },
      { key: "consumer", label: "Consumer", path: "consumer", level: 2 },
      { key: "store", label: "Store", path: "store", level: 2 },
    ],
  },

  {
    name: "Notification",
    key: "notification",
    children: [],
  },
  {
    name: "Category & Attribute",
    key: "category-and-attribute",
    breadcrumb: [""],
    children: [
      {
        key: "category",
        label: "Category",
        path: "category",
        level: 2,
      },
      {
        key: "attribute",
        label: "Attribute",
        path: "attribute",
        level: 2,
      },
    ],
  },
  {
    name: "Product Management",
    key: "product-management",
    children: [],
  },
  {
    name: "Dashboard Config",
    key: "dashboard-config",
    children: [
      {
        key: "config-menu",
        label: "What’s on the menu?",
        path: "config-menu",
        level: 2,
      },
      {
        key: "config-featured-restaurants",
        label: "Featured Restaurant",
        path: "config-featured-restaurants",
        level: 2,
      },
      {
        label: "Top Selling Dishes",
        key: "config-top-selling-dishes",
        path: "config-top-selling-dishes",
        level: 2,
      },
    ],
  },
  {
    name: "Parameters",
    key: "parameters",
    children: [],
  },
  {
    name: "Email Template",
    key: "email-template",
    children: [],
  },
  {
    name: "Settlement report",
    key: "settlement-report",
    children: [],
  },
  {
    name: "Report",
    key: "report",
    children: [],
  },
  {
    name: "Trifood Member",
    key: "tri-member",
    breadcrumb: [""],
    children: [
      { key: "member", label: "Member Management", path: "member", level: 2 },
      { key: "role", label: "Role management", path: "role", level: 2 },
    ],
  },
  {
    name: "Logistic Fee",
    key: "logistic-fee",
    children: [],
  },
];
