declare interface Notification {
  create_time: Date;
  update_time: Date;
  id: number;
  admin_user_id: string;
  content: {
    [key: string]: string;
  };
  meta: {
    eventName: string;
    merchantId: number;
  };
  read_at: Date | null;
  notify_at: Date;
  indexTable?: string;
}
