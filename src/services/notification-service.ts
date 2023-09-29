import { ServiceBase } from "./core/service-base";
import { PageParams } from "./params-type";
export class NotificationServices extends ServiceBase {
  // Implement method call API
  countUnread = async () => {
    return this.get("admin-notifications/unread");
  };

  listNotification = async (params: PageParams) => {
    return this.get("admin-notifications", params);
  };

  readNotification = async (id: number | string) => {
    return this.put(`admin-notifications/${id}/mark-as-read`, {});
  };
}
