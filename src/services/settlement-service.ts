import { AxiosError, AxiosResponse } from "axios";
import { ServiceBase } from "./core/service-base";
import { PageQueryParams } from "./params-type";
import { message } from "antd";

export class settlementService extends ServiceBase {
  getDailySettlementReports = async (params: PageQueryParams): Promise<any> => {
    const res = await this.get(`/admin-management/settlements`, params);
    return res;
  };

  exportDailySettlementReports = async (data: string[]): Promise<any> => {
    const res = await this.post(`/admin-management/settlements/export`, {
      date: data,
    })
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
        throw new Error(messageText);
      });
    return res;
  };

  getMerchantSettlementReports = async (
    params: PageQueryParams
  ): Promise<any> => {
    const res = await this.get(
      `/admin-management/settlements/merchants`,
      params
    );
    return res;
  };

  exportMerchantSettlementReports = async (data: string): Promise<any> => {
    const res = await this.post(
      `/admin-management/settlements/merchants/export?settlementIds=${data}`,
      {}
    )
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
        throw new Error(messageText);
      });
    return res;
  };

  getMerchantStoreSettlementReports = async (
    merchantID: string,
    params: PageQueryParams
  ): Promise<any> => {
    const res = await this.get(
      `/admin-management/settlements/merchants/store-list/${merchantID}`,
      params
    );
    return res;
  };

  getMerchantSettlementReportsSummary = async (
    merchantID: string
  ): Promise<any> => {
    const res = await this.get(
      `/admin-management/settlements/merchants/${merchantID}`
    );
    return res;
  };

  getStoreOrderSettlementReports = async (
    settlementId: string,
    params: PageQueryParams
  ): Promise<any> => {
    const res = await this.get(
      `/admin-management/settlements/${settlementId}`,
      params
    );
    return res;
  };

  getOrderSettlementReportsDetail = async (orderId: string): Promise<any> => {
    const res = await this.get(
      `/admin-management/settlements/order/${orderId}`
    );
    return res;
  };
}

export const SettlementService = new settlementService();
