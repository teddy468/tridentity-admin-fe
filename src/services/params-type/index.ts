import { ORDER_STATUS } from 'src/constants';

export interface PageParams {
  page: number;
  perPage: number;
  paginationMetadataStyle: 'body';
}
export interface PageQueryParams {
  page: number;
  perPage: number;
  paginationMetadataStyle: 'body';
  [key: string]: string | number;
}

export interface CategoryParams extends PageParams {
  is_highlight?: boolean;
  is_top?: boolean;
  status?: number;
  search_value?: string;
}

export interface AttributeParams extends PageParams {
  search_value?: string;
}

// user

export interface MerchantOnboardParams extends PageParams {
  company_name: string;
}

export interface MerchantParams extends PageParams {
  name: string;
}

export interface StoreParams extends PageParams {
  keyword?: string;
  category_ids?: Array<number>;
  sort_by?: string;
  order_by?: 'ASC' | 'DESC';
  is_featured?: boolean;
}
export interface OrdersParams extends PageParams {
  search_value?: string;
  status?: ORDER_STATUS;
}

export interface FiatParams {
  start_date: string;
  end_date: string;
  reportView: 'weekly' | 'monthly' | 'yearly';
}
