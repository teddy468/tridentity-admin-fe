declare interface MerchantStoreDashboardConfig {
  position: number;
  merchantStore: MerchantStore | null;
}

declare interface MerchantStore {
  create_time: string;
  update_time: string;
  id: number;
  merchant_id: number;
  name: string;
  description: string;
  logo: string;
  banners: string[];
  is_restaurant: boolean;
  open_at: string;
  close_at: string;
  is_open_on_weekend: boolean;
  weekend_open_at: string;
  weekend_close_at: string;
  service_supports: string[];
  status: number;
  rating: number | null;
  reviews: number | null;
  likes: number | null;
  settings: Settings;
  tags: string[];
  indexTable?: string;
}
declare interface ListChoosenStore {
  position: number;
  merchantStore: MerchantStore;
}
declare interface StoreMerchant {
  create_time: Date;
  update_time: Date;
  id: number;
  name: string;
  merchant_user_id: string;
  description: string | null;
  rating: string | null;
  reviews: [] | null;
  likes: [] | null;
  status: number;
  logo: string;
  banners: [];
  settings: {};
  merchant_onboard: Merchant;
  indexTable?: string;
}

declare interface Merchant {
  create_time: Date;
  update_time: Date;
  id: number;
  company_name: string;
  email: string;
  phone: string;
  status: string;
  documents: string[];
  categories: MerchantCategory[];
}

declare interface MerchantOnboard extends Merchant {
  merchant_status: number;
  merchant_id: number;
  merchant_user_id: string;
  merchant_name: string;
  mechant_id: number;
}
declare interface MerchantCategory {
  create_time: Date;
  update_time: Date;
  id: number;
  name: string;
  description: string;
  cover: string;
  image: string;
  parent_category_id: number;
  attributes: object;
  settings: {
    is_top: boolean;
    is_highlight: boolean;
  };
  status: number;
}

declare interface MerchantOnboardRequest {
  create_time: Date;
  update_time: Date;
  id: number;
  company_name: string;
  email: string;
  phone: string;
  status: string;
  documents: string[];
  categories: merchantCategory[];
  indexTable?: string;
  // newProperties
  financeRepresentativeName: string;
  bankOfficeNo: string;
  bankMobileNo: string;
  bankEmailAddress: string;
  bankName: string;
  accountName: string;
  accountNo: string;
  // newProperties
  registeredOfficeAddress: string;
  sfaNumber: string;
  gstRegistrationNumber: string;
  representativeName: string;
  contactOfficeNo: string;
  contactEmailAddress: string;
  territory: string;
  businessNature: string;
  contactMobileNo: string;
  // newProperties
  category_ids: string[];
  documents: File[];
}
declare enum RejectedField {
  EMAIL = "EMAIL",
  CATEGORY = "CATEGORY",
  PHONE = "PHONE",
  NAME = "NAME",
  DOCUMENTS = "DOCUMENTS",
  REGISTERED_OFFICE_ADDRESS = "REGISTERED_OFFICE_ADDRESS",
  SFA_NUMBER = "SFA_NUMBER",
  GST_REGISTRATION_NUMBER = "GST_REGISTRATION_NUMBER",
  REPRESENTATIVE_NAME = "REPRESENTATIVE_NAME",
  CONTACT_OFFICE_NO = "CONTACT_OFFICE_NO",
  CONTACT_MOBILE_NO = "CONTACT_MOBILE_NO",
  CONTACT_EMAIL_ADDRESS = "CONTACT_EMAIL_ADDRESS",
  TERRITORY = "TERRITORY",
  BUSINESS_NATURE = "BUSINESS_NATURE",
  FINANCE_REPRESENTATIVE_NAME = "FINANCE_REPRESENTATIVE_NAME",
  BANK_OFFICE_NO = "BANK_OFFICE_NO",
  BANK_MOBILE_NO = "BANK_MOBILE_NO",
  BANK_EMAIL_ADDRESS = "BANK_EMAIL_ADDRESS",
  BANK_NAME = "BANK_NAME",
  ACCOUNT_NAME = "ACCOUNT_NAME",
  ACCOUNT_NO = "ACCOUNT_NO",
}

declare interface ValueFormApprove {
  EMAIL: string | number;
  CATEGORY: string | number;
  PHONE: string | number;
  NAME: string | number;
  DESCRIPTION: string | number;
  LOGO: string | number;
  BANNERS: string | number;
  SETTINGS: string | number;
  DOCUMENTS: string | number;
  REGISTERED_OFFICE_ADDRESS: string | number;
  SFA_NUMBER: string | number;
  GST_REGISTRATION_NUMBER: string | number;
  REPRESENTATIVE_NAME: string | number;
  CONTACT_OFFICE_NO: string | number;
  CONTACT_MOBILE_NO: string | number;
  CONTACT_EMAIL_ADDRESS: string | number;
  TERRITORY: string | number;
  BUSINESS_NATURE: string | number;
  FINANCE_REPRESENTATIVE_NAME: string | number;
  BANK_OFFICE_NO: string | number;
  BANK_MOBILE_NO: string | number;
  BANK_EMAIL_ADDRESS: string | number;
  BANK_NAME: string | number;
  ACCOUNT_NAME: string | number;
  ACCOUNT_NO: string | number;
}
declare interface MerchantUser {
  create_time: Date;
  email: string;
  first_name: string | null;
  id: string;
  identifier: string;
  last_login_at: Date;
  last_name: string | null;
  phone: string;
  status: number;
  update_time: Date;
}

declare interface MerchantUserRequest {
  create_time: Date;
  update_time: Date;
  id: number;
  merchant_id: number;
  merchant_user_id: string;
  status: number;
  level: number;
  request_date: Date;
  rejected_date: Date | null;
  received_date: Date | null;
  cancelled_date: Date | null;
  merchant: MerchantStore;
  merchant_user: MerchantUser;
  indexTable?: string;
}

declare interface MerchantBuyMoreLpRequest extends MerchantUserRequest {
  paid_date: null | Date;
  lp_amount: number;
  payment_amount: number;
  request_date: Date;
}

declare interface MerchantRequestCashOut extends MerchantUserRequest {
  paid_date: null | Date;
  lp_amount: number;
  cashout_amount: number;
  request_date: Date;
}

