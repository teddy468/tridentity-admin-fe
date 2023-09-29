import { ServiceBase } from "./core/service-base";
export class AuthServices extends ServiceBase {
  // Implement method call API
  login = async (params: { identifier: string; password: string }) => {
    return this.post("auth/login/admin", params);
  };

  verifyCode = async (params: { id: string; otp: string }) => {
    return this.post("auth/login/admin/verify", params);
  };

  refreshToken = (refresh_token: string) => {
    return this.post(`auth/refresh-token/admin`, { refresh_token });
  };

  forgotPassword = (email: string) => {
    return this.get(`auth/forgot-password/admin/${email}`);
  };

  resetPassword = (body: {
    new_password: string;
    reset_password_token: string;
  }) => {
    return this.post(`/auth/reset-password/admin`, body);
  };

  getAdminPermission = (role: string) => {
    return this.post(`auth/admin-permission`, role); //rename route later
  };

  createPasswordMember = (body: {
    new_password: string;
    activate_token: string;
  }) => {
    return this.post(`/auth/admin/activate`, body);
  };
}
