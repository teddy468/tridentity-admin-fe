import { ServiceBase } from "./core/service-base";
import {
  ApprovalStatus,
  ProductParams,
  ProductResponse,
} from "../types/Product";
import { AxiosError } from "axios";
import { message } from "antd";
import { MerchantStoreAddress } from "../pages/productManagement/PreviewProduct/PreviewProduct";

export class ProductManagementService extends ServiceBase {
  getProduct = async (params: ProductParams): Promise<ProductResponse> => {
    const res = await this.get(`/admin-management/products`, params);
    return res.data;
  };

  countWaiting = async (): Promise<{
    pending: number;
    rejected: number;
    approved: number;
  }> => {
    const res = await this.get(`/admin-management/products/count`, {});
    return res.data;
  };

  getApprovalDetail = async (
    approvalId: number
  ): Promise<ProductItemApproval> => {
    const res = await this.get(
      `/admin-management/products-approval/${approvalId}`,
      {}
    );
    return res.data;
  };

  getProductPending = async (
    params: ProductParams
  ): Promise<ProductApprovalResponse> => {
    const res = await this.get(`admin-management/products-approval`, params);
    return res.data;
  };

  getStoreAddress = async (
    storeId: number
  ): Promise<MerchantStoreAddress[]> => {
    const res = await this.get(`admin/merchant-store-addresses/${storeId}/addresses`);
    return res.data;
  };

  approveRejectApproval = async (
    approvalId: number,
    status: ApprovalStatus,
    description: string
  ): Promise<boolean> => {
    try {
      await this.put(`admin-management/products-approval/${approvalId}`, {
        approval_status: status,
        description: description,
      });

      return true;
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const messageText =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Request fail";
      message.error(messageText);
      return false;
    }
  };

  setProductDashboardConfig = async (
    setting: "featured" | "top_selling",
    body: { product_id: number; position: number; product_name: string }[]
  ): Promise<any> => {
    const bodySend = { top_selling: body };
    const res = await this.put(
      `admin-management/products/dashboard-settings/${setting}`,
      bodySend
    );
    return res;
  };

  getProductDashboardConfig = async (
    setting: "featured" | "top_selling"
  ): Promise<any> => {
    return this.get(`admin-management/products/dashboard-settings/${setting}`);
  };

  showProduct = async (productIds: any[]) => {
    return this.put(`/admin-management/products/config/show`, {
      product_ids: productIds,
    });
  };

  hideProduct = async (productIds: any[]) => {
    return this.put(`/admin-management/products/config/hide`, {
      product_ids: productIds,
    });
  };
}

export const productManagementService = new ProductManagementService();
