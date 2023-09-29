import { ServiceBase } from "./core/service-base";
import {
  InvolvedMerchant,
  SettlementItem,
  SettlementOrderResponse,
  SettlementResponse,
} from "../types/settlemets";
import { AxiosError, AxiosResponse } from "axios";
import { message } from "antd";

export class ReconciliationService extends ServiceBase {
  getSettlements = async (params: any): Promise<SettlementResponse> => {
    const res = await this.get(`/admin-management/settlements`, params);
    return res.data;
  };
  getSettlementsDetail = async (id: number): Promise<SettlementItem> => {
    const res = await this.get(`/admin-management/settlements/${id}`);
    return res.data;
  };

  getSettlementOrder = async (
    params: any
  ): Promise<SettlementOrderResponse> => {
    const res = await this.get(`/admin/orders`, params);
    return res.data;
  };

  getInvolvedMerchant = async (params: any): Promise<InvolvedMerchant[]> => {
    const res = await this.get(
      `/admin-management/settlements/involved-merchants`,
      params
    );
    return res.data;
  };

  getInvolveStores = async (
    settlementId: number
  ): Promise<{ store_id: number; store_name: string }[]> => {
    const res = await this.get(
      `admin-management/settlements/${settlementId}/involved-stores`
    );
    return res.data;
  };

  exportOrder = async (settlementId: number, storeId: string) => {
    const url = `/admin/orders/export?settlement_id=${settlementId}&merchant_store_id=${storeId}`;
    this.get(url, { responseType: "blob" })
      .then((response: AxiosResponse) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "order.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Release the object URL
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        const error = (err as AxiosError<any>)?.response?.data;
        const messageText =
          typeof error?.error.message === "string"
            ? error?.error.message
            : typeof error?.error.message?.[0] === "string"
            ? error.error.message[0]
            : "Export fail";
        message.error(messageText);
      });
  };

  approvePayment = async (id: number[]): Promise<any> => {
    try {
      return await this.put(
        `admin-management/settlements/bulk-approve-payment`,
        { settlementIds: id }
      );
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const messageText =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Approve fail";
      message.error(messageText);
    }
  };
}

export const reconciliationService = new ReconciliationService();
