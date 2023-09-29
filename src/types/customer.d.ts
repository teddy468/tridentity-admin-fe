declare interface Customer {
  create_time: Date;
  update_time: Date;
  id: number;
  email: string;
  username: string;
  status: number;
  user_oauth_id: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  full_name: string;
  address: string;
  identity_token_id: string;
  avatar: string;
  date_of_birth: Date | null;
  gender: number;
  login_for_first_time: boolean;
  is_allowed_lp_for_blc: boolean;
  memberships: CustomerMembership[];
  loyalty_point: {
    create_time: Date;
    update_time: Date;
    id: number;
    point: number;
    pending_point: number;
    total_point: number;
  };
  membership: {
    create_time: Date;
    update_time: Date;
    id: number;
    status: number;
    token_id: null | number;
    level: number;
    active_date: Date;
  };
  total_spending: bigint;
  indexTable?: string;
}

declare interface CustomerMembership {
  create_time: Date;
  update_time: Date;
  id: number;
  status: number;
  token_id: string | null;
  level: number;
  active_date: Date;
}
