declare interface AdminMember {
  name: string; //fix by seperate admin member type when onboard and update
  first_name: string;
  email: string;
  roles: {
    admin_role_id: number;
    admin_user_id: string;
    create_time: Date | string;
    id: number;
    status: string;
    update_by: string;
    name: string;
    adminRole: {
      name: string;
    };
  }[];
  create_time: Date | string;
  previous_role: string;
  current_role: string;
  status: AdminRoleStatus;
  id: number;
  admin_role: {
    create_time: Date | string;
    description: string;
    id: number;
    name: string;
    update_time: Date | string;
    status: string;
  };
}

declare interface AdminRole {
  name: string;
  description: string;
  id: number;
  create_date: Date | string;
}

declare enum AdminRoleStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}
