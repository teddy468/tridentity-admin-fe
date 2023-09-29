import { ServiceBase } from "./core/service-base";
import { PageQueryParams } from "./params-type";

export class MemberService extends ServiceBase {
  getListMember = async (params: PageQueryParams) => {
    return this.get("admin-operators", params);
  };

  memberOperatorsActivation = async (id: number) => {
    return this.patch(`admin-operators/${id}/toggle-activation`, {});
  };

  editMemberOperators = async (id: number, body: any) => {
    return this.patch(`admin-operators/${id}`, body);
  };

  getListMemberOnboard = async (params: PageQueryParams) => {
    return this.get("admin-user-onboard", params);
  };

  getOtpMemberOnboard = async (id: string) => {
    return this.get(`admin-user-onboard/${id}/request-otp`);
  };

  verifyOtpMemberOnboard = async (id: string, body: { otp: string }) => {
    return this.put(`admin-user-onboard/${id}/verify`, body);
  };

  addNewMember = async (body: {
    email: string;
    name: string;
    admin_role_id: number;
  }) => {
    return this.post("admin-user-onboard/create", body);
  };

  editMember = async (id: number, body: any) => {
    return this.patch(`admin-user-onboard/${id}`, body);
  };

  deleteMemberOnboard = async (id: number) => {
    return this.delete(`admin-user-onboard`, id);
  };

  deleteMember = async (id: number) => {
    return this.delete(`admin/users`, id);
  };

  getListRoles = async (params: PageQueryParams) => {
    return this.get("admin-role", params);
  };

  getRoleDetail = async (id: number) => {
    return this.get(`admin-role/${id}`);
  };

  addNewRole = async (body: any) => {
    return this.post("admin-role", body);
  };

  editRole = async (id: number, body: any) => {
    return this.patch(`admin-role/${id}`, body);
  };

  upsertRolePermission = async (id: number, body: any) => {
    return this.patch(`admin-role/${id}/authorities`, body);
  };

  roleActivation = async (id: number) => {
    return this.patch(`admin-role/${id}/toggle-activation`, {});
  };
}
