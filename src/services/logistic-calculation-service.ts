import { ServiceBase } from "./core/service-base";
import { PageQueryParams } from "./params-type";

export class logisticService extends ServiceBase {
  getListLogistic = async (params: PageQueryParams) => {
    const res = await this.get("/admin/logistic-calculations", params);
    return res;
  };

  addNewLogistic = async (body: any) => {
    const res = await this.post("/admin/logistic-calculations", body);
    return res;
  };

  editLogistic = async (id: number, body: any) => {
    const res = await this.patch(`/admin/logistic-calculations/${id}`, body);
    return res;
  };

  deleteLogistic = async (id: number) => {
    const res = await this.delete(`/admin/logistic-calculations`, id);
    return res;
  };
}

export const LogisticService = new logisticService();
