import { ServiceBase } from "./core/service-base";
import { FiatParams, OrdersParams } from "./params-type";
export class ReportService extends ServiceBase {
  // Implement method call API
  fetchOrders = async (params: OrdersParams) => {
    return this.get("admin/orders", params);
  };

  fetchOrderDetail = async (id: string | number) => {
    return this.get(`admin/orders/${id}`);
  };

  fetchGeneral = () => {
    return this.get(`admin/orders/report/general`);
  };


  fetchUserGeneral = () => {
    return this.get(`admin/user/report/general`);
  };

  fetchFiat = (params: FiatParams) => {
    return this.get(`admin/orders/report/fiat`, params);
  };

  fetchUserFiat = (params: FiatParams) => {
    return this.get(`admin/user/report`, params);
  };

  fetchGeneralMerchant = (id: number) => {
    return this.get(`admin/merchants/${id}/orders/report/general`);
  };

  fetchFiatMerchant = (params: FiatParams, id: number) => {
    return this.get(`admin/merchants/${id}/report/fiat`, params);
  };

  fetchMerchantOrders = (params: OrdersParams, id: number) => {
    return this.get(`admin/merchants/${id}/orders`, params);
  };
}
