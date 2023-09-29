import { ServiceBase } from "./core/service-base";
import {
  MerchantOnboardParams,
  MerchantParams,
  PageQueryParams,
  StoreParams,
} from "./params-type";
export class UserServices extends ServiceBase {
  // Implement method call API
  fetchOnboardingRequests = async (params: PageQueryParams) => {
    const res = await this.get("admin/merchant-onboard", params);
    return res;
  };

  fetchOboardingRequestDetail = async (id: number | string) => {
    const res = await this.get(`admin/merchant-onboard/${id}`);
    return res;
  };

  fetchOnboardingUpdateRequest = async (params: PageQueryParams) => {
    const res = await this.get(`/admin/merchants/merchant-approvals`, params);
    return res;
  };

  fetchOnboardingUpdateRequestDetail = async (id: number | string) => {
    const res = await this.get(`/admin/merchants/merchant-approval/${id}`);
    return res;
  };

  rejectedMerchantOnboardRequest = async (
    id: number | string,
    body: {
      rejectedFields: string[];
    }
  ) => {
    const res = await this.patch(`admin/merchants/reject/${id}`, body);
    return res;
  };

  approveMerchantOnboardRequest = async (id: number | string) => {
    const res = await this.patch(`admin/merchants/accept/${id}`, {});
    return res;
  };

  executionMerchant = async (
    id: number | string,
    action: "DENY" | "ACCEPT",
    body?: {
      rejectedFields: string[];
    }
  ) => {
    const res = await this.put(
      `admin/merchant-onboard/${id}/execute/${action}`,
      body
    );
    return res;
  };

  executionMerchantMul = async (
    ids: number[] | string[],
    action: "DENY" | "ACCEPT"
  ) => {
    const res = await this.put(
      `admin/merchant-onboard/execute/multiple/${action}`,
      {
        merchantOnboardIds: ids,
      }
    );
    return res;
  };

  fetchListMerchant = async (params: PageQueryParams) => {
    const res = await this.get(`admin/merchants`, params);
    return res;
  };

  fetchMerchantDetail = async (id: number | string) => {
    const res = await this.get(`admin/merchants/${id}`);
    return res;
  };
  fetchStores = async (params: StoreParams) => {
    const res = await this.get(`admin/merchant-stores`, params);
    return res;
  };

  fetchStoreByMerchant = async (
    id: string | number,
    params: {
      page: number;
      perPage: number;
      paginationMetadataStyle: string;
    }
  ) => {
    const res = await this.get(`admin/merchants/${id}/stores`, params);
    return res;
  };

  fetchListUser = async (params: PageQueryParams) => {
    const res = await this.get(`admin/users`, params);
    return res;
  };

  activeMerchant = async (id: number) => {
    const res = await this.put(`admin/merchants/${id}/activate`, {});
    return res;
  };

  deactiveMerchant = async (id: number) => {
    const res = await this.put(`admin/merchants/${id}/deactivate`, {});
    return res;
  };

  activateUser = async (id: number) => {
    const res = await this.put(`admin/users/${id}/activate`, {});
    return res;
  };

  deActivateUser = async (id: number) => {
    const res = await this.put(`admin/users/${id}/deactivate`, {});
    return res;
  };

  fetchLpCashOut = (params: {
    page: number;
    perPage: number;
    paginationMetadataStyle: "body";
  }) => {
    return this.get(`lp-cashout-request/admin`, params);
  };

  fetchLpBuyMore = (params: {
    page: number;
    perPage: number;
    paginationMetadataStyle: "body";
  }) => {
    return this.get(`lp-buying-request/admin`, params);
  };

  cashOutAction = (id: number, action: "approve" | "reject") => {
    return this.put(`lp-cashout-request/admin/execute/${id}/${action}`, {});
  };

  buyMoreAction = (id: number, action: "approve" | "reject") => {
    return this.put(`lp-buying-request/admin/execute/${id}/${action}`, {});
  };

  upgradeRequestAction = (id: number, action: "approve" | "reject") => {
    return this.put(`merchant-membership/admin/execute/${id}/${action}`, {});
  };

  fetchUpgradeRequest = (params: {
    page: number;
    perPage: number;
    paginationMetadataStyle: "body";
  }) => {
    return this.get(`merchant-membership/admin`, params);
  };
}
