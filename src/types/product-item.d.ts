type MAIN_TAG = keyof typeof import("src/constants").MAIN_TAG;

declare interface ProductItem {
  create_time: string;
  update_time: string;
  id: number;
  name: string;
  description: string;
  merchant_store_id: number;
  category_id: number;
  thumbnail: string;
  brand: string;
  manufacturer: string;
  manufacturer_address: string;
  product_warranty: string;
  shipment_weight: number;
  width: number;
  height: number;
  depth: number;
  lead_time: number;
  price: number;
  condition: number;
  slug: string;
  day_to_prepare_order: number;
  sku: string;
  attributes: Attribute[];
  images: string[];
  videos: string[];
  settings: Settings;
  rating: number;
  reviews: number;
  total_sales: number;
  status: number;
  main_tags: MAIN_TAG[];
  sub_tags: string[];
  position: string;
  store: {
    name: string;
  };
}

declare interface Attribute {
  attribute_name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
}

declare interface Settings {
  is_featured: boolean;
}

declare interface ProductItemConfig {
  position: number;
  product: ProductItem | null;
}

declare interface ProductItemApproval {
  id: number;
  product_id: number;
  type: string;
  update_time: string;
  price: number;
  description: string;
  approval_status: ApprovalStatus;
  product?: Product;
  payload: CreateUpdateProductBody;
  store: Store;
}

declare interface Store {
  id: number;
  name: string;
  description: string;
  logo: string;
  banners: string[];
  is_restaurant: boolean;
  open_at: string;
  close_at: string;
  is_open_on_weekend: boolean;
  weekend_open_at: string;
  weekend_close_at: string;
  status: number;
  create_time: string;
  update_time: string;
  merchantId: number;
  merchant: {
    id: number;
    name: string;
  };
  isOpen24Hours: boolean;
  outletName: srting;
  outletAddress: string;
  outletContactPerson: string;
  outletContact: string;
  halalCertified: boolean;
  muslimOwned: boolean;
  openingHoursMon: string;
  openingHoursTue: string;
  openingHoursWed: string;
  openingHoursThu: string;
  openingHoursFri: string;
  openingHoursSat: string;
  openingHoursSun: string;
  closingHoursMon: string;
  closingHoursTue: string;
  closingHoursWed: string;
  closingHoursThu: string;
  closingHoursFri: string;
  closingHoursSat: string;
  closingHoursSun: string;
  triFoodPOSes: {
    id: number;
    POSId: string;
  }[];
}

declare interface StoreUpdate extends Store {
  merchantStoreId: number;
}

declare interface CreateUpdateProductBody {
  merchant_store_id: number;
  price: number;
  category_id: number;
  category?: { name: string };
  name: string;
  description: string;
  thumbnail: string;
  attributes: ProductAttribute[];
  images: string[];
  videos: string[];
  brand?: string;
  manufacturer: string;
  manufacturer_address: string;
  warranty: string;
  product_warranty: PRODUCT_WARRANTY;
  shipment_weight: number;
  width: number;
  height: number;
  depth: number;
  condition: number;
  day_to_prepare_order: number;
  lead_time: number;
  sku: string;
  status: number;
  settings?: {
    is_featured: boolean;
  };
  main_tags: MAIN_TAG[];
  sub_tags: SUB_TAG[];
}

declare interface Product {
  id: number;
  merchant_store_id: number;
  category_id: number;
  category?: { name: string };
  name: string;
  price?: number;
  description: string;
  thumbnail: string;
  attributes: ProductAttribute[];
  images: string[];
  videos: string[];
  brand?: string;
  total_sales?: number;
  manufacturer: string;
  manufacturer_address: string;
  warranty: string;
  product_warranty?: string;
  shipment_weight: number;
  width: number;
  height: number;
  depth: number;
  condition: number;
  day_to_prepare_order: number;
  lead_time: number;
  sku: string;
  status: number;
  settings?: {
    is_featured: boolean;
  };
  main_tags: MAIN_TAG[];
  sub_tags: SUB_TAG[];
  items: {
    current_quantity: number;
    price: number;
  }[];
}

declare interface ProductVariation {
  attribute_value: string;
  price: number;
  total_quantity: number;
}

declare type ProductAttribute = {
  attribute_name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
  variants: ProductVariation[];
};

declare type ProductApprovalResponse = {
  data: ProductItemApproval[];
  metadata: PaginationMetadata;
};
