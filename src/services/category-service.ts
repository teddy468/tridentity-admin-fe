import { ServiceBase } from "./core/service-base";
import { CategoryParams } from "./params-type";

export class CategoryService extends ServiceBase {
  createCategory = async (body: CreateUpdateCategoryBody) => {
    return this.post("/admin/categories", body);
  };

  getCategories = async (params?: CategoryParams) => {
    return this.get("/admin/categories/", params);
  };

  getCategoryDetail = async (id: Category["id"]) => {
    return this.get(`/admin/categories/${id}`);
  };

  getChildCategories = async (ids: string) => {
    return this.get(`/admin/categories/descendants`, {
      categoryIds: ids,
    });
  };

  updateCategory = async (
    id: Category["id"],
    body: CreateUpdateCategoryBody
  ) => {
    return this.patch(`/admin/categories/${id}`, body);
  };

  deleteCategory = async (id: Category["id"]) => {
    return this.delete("/admin/categories", id);
  };

  getDirectChildren = async (id: Category["id"]) => {
    return this.get(`/admin/categories/${id}/direct-children`);
  };

  getCountProducts = async (id: Category["id"]) => {
    return this.get(`/admin/categories/${id}/count-products`);
  };

  getHierarchyTree = async (id: Category["id"]) => {
    return this.get(`/admin/categories/${id}/hierarchy-tree`);
  };

  setMenuConfig = async (id: Category["id"], index: number) => {
    return this.put(
      `admin/categories/dashboard-settings/position/${index}/category/${id}`,
      {}
    );
  };
  getCategoriesDashboardSettings = async () => {
    return this.get("admin/categories/dashboard-settings");
  };
}

export const categoryService = new CategoryService();
