export type ProductResponse = {
  data: Product[];
  metadata: PaginationMetadata;
};

declare interface PaginationMetadata {
  "x-next-page": number;
  "x-page": number;
  "x-pages-count": number;
  "x-per-page": number;
  "x-total-count": number;
}

export type Product = {
  create_time: string;
  id: number;
  name: string;
  category_id: number;
  price: number;
  slug: string;
  rating: number;
  store: {
    merchant_id: number;
    name: string;
    merchant: {};
  };
  category: { id: number; name: string };
  indexTable?: string;
};

export type Store = {
  merchant_id: number;
  name: string;
  merchant: {};
};

export type Category = {
  id: number;
  name: string;
};

export type ProductParams = {
  paginationMetadataStyle: string;
  page: number;
  perPage: number;
  keyword: string;
  order_by?: string;
  sort_by?: string;
  status?: string;
};

export type ProductApprovalParams = {
  paginationMetadataStyle: string;
  page: number;
  perPage: number;
  keyword: string;
  status: string;
  actions?: string;
};

export enum ApprovalStatus {
  PENDING = 0,
  APPROVE = 1,
  REJECT = 2,
  DELETE = 3,
}
export enum ProductActionType {
  CREATE = "Create",
  UPDATE = "Update",
  PUBLISH = "Publish",
}

export enum ProductStatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  DRAFT = 2,
  BANNED = 3,
  PENDING_FOR_REVIEW = 4,
  REJECTED = 5,
}

export enum PRODUCT_SORTS {
  name = "name",
  createdAt = "createdAt",
}

export enum MAIN_TAG {
  hot = "hot",
  best_seller = "best_seller",
  new = "new",
}

export const MAIN_TAG_OPTIONS = [
  { value: MAIN_TAG.new, label: "New Dish" },
  { value: MAIN_TAG.hot, label: "Hot" },
  { value: MAIN_TAG.best_seller, label: "Best Seller" },
];
export enum SUB_TAG {
  special_on_today = "special_on_today",
  milk_tea = "milk_tea",
  juice = "juice",
  coffee = "coffee",
}
export enum PRODUCT_WARRANTY {
  INTERNATIONAL_WRRANTY = "International warranty",
}
