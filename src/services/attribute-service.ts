import { ServiceBase } from "./core/service-base";
import { AttributeParams } from "./params-type";

export class AttributeService extends ServiceBase {
  createAttribute = async (body: CreateUpdateAttributeBody) => {
    return this.post("/admin/attributes", body);
  };

  getAttributes = async (params?: AttributeParams) => {
    return this.get("/admin/attributes", params);
  };

  getAttributeDetail = async (id: Attribute["id"]) => {
    return this.get(`/admin/attributes/${id}`);
  };

  updateAttribute = async (
    id: Attribute["id"],
    body: CreateUpdateAttributeBody
  ) => {
    return this.put(`/admin/attributes/${id}`, body);
  };

  deleteAttribute = async (id: Attribute["id"]) => {
    return this.delete("/admin/attributes", id);
  };
}
