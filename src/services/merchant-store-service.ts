import { MerchantStoreStatus } from "src/constants";
import { ServiceBase } from "./core/service-base";
import { PageQueryParams } from "./params-type";

export class MerchantStoreService extends ServiceBase {
  setFeatureRestaurant = async (
    setting: "featured",
    index: number,
    id: number
  ) => {
    return this.put(
      `admin/merchant-stores/dashboard-settings/${setting}/position/${index}/store/${id}`,
      {}
    );
  };

  getFeaturedRestaurantDashboard = async (setting: "featured") => {
    return this.get(`admin/merchant-stores/dashboard-settings/${setting}`);
  };

  deleteFeaturedRestaurantDashboard = async (index: number) => {
    return this.delete(
      `admin/merchant-stores/dashboard-settings/featured/position`,
      index
    );
  };

  swapFeatureRestaurant = async (
    setting: string,
    positionA: number,
    positionB: number
  ) => {
    return this.put(
      `admin/merchant-stores/dashboard-settings/${setting}/from/${positionA}/to/${positionB}`,
      {}
    );
  };

  fetchStoreOnboardingRequests = async (params: PageQueryParams) => {
    const res = await this.get("admin/merchant-store-onboard/pending", params);
    return res;
  };

  fetchStoreUpdateRequests = async (params: PageQueryParams) => {
    const res = await this.get(
      "admin/merchant-store-approvals/pending",
      params
    );
    return res;
  };

  fetchListStoreOffical = async (params: PageQueryParams) => {
    const res = await this.get("/admin/merchant-stores", params);
    return res;
  };

  fetchListStoreRejected = async (params: PageQueryParams) => {
    const res = await this.get(
      "/admin/merchant-store-onboard/rejected",
      params
    );
    return res;
  };

  fetchListStoreUpdateRejected = async (params: PageQueryParams) => {
    const res = await this.get(
      "/admin/merchant-store-approvals/rejected",
      params
    );
    return res;
  };

  rejectStoreOnboardingRequest = async (body: {
    merchantStoreOnboardId: string | number;
    rejectedReason: string;
  }) => {
    const res = await this.patch(`admin/merchant-store-onboard/reject`, body);
    return res;
  };

  acceptStoreOnboardingRequest = async (body: {
    merchantStoreOnboardId: string | number;
    POSIds: string[];
  }) => {
    const res = await this.patch(`admin/merchant-store-onboard/accept`, body);
    return res;
  };

  rejectStoreUpdateRequest = async (body: {
    merchantStoreApprovalId: string | number;
    rejectedReason: string;
  }) => {
    const res = await this.patch(`admin/merchant-store-approvals/reject`, body);
    return res;
  };

  acceptStoreUpdateRequest = async (body: {
    merchantStoreApprovalId: string | number;
  }) => {
    const res = await this.patch(`admin/merchant-store-approvals/accept`, body);
    return res;
  };

  toggleStoreActiveStatus = async (
    id: string | number,
    body: { status: MerchantStoreStatus }
  ) => {
    const res = await this.patch(
      `admin/merchant-stores/set-status/${id}`,
      body
    );
    return res;
  };

  fetchStoreDetail = async (id: string | number) => {
    const res = await this.get(`admin/merchant-stores/${id}`);
    return res;
  };

  fetchStoreOnboardDetail = async (id: string | number) => {
    const res = await this.get(`admin/merchant-store-onboard/${id}`);
    return res;
  };

  fetchStoreUpdateDetail = async (id: string | number) => {
    const res = await this.get(`admin/merchant-store-approvals/${id}`);
    return res;
  };

  updateStoreUpdateRequestDetail = async (id: string | number, body?: any) => {
    const res = await this.patch(
      `/admin/merchant-store-approvals/${id}/accept`,
      body
    );
    return res;
  };

  updateStoreOnboardRequestDetail = async (id: string | number, body: any) => {
    const res = await this.patch(
      `admin/merchant-store-onboard/${id}/accept`,
      body
    );
    return res;
  };
}

export const merchantStoreService = new MerchantStoreService();
