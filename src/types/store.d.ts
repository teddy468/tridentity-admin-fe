declare interface StoreAddress {
  service_supports: string[];
  id: number;
  merchant_store_id: number;
  address: string;
  description: string;
  phone: string;
  coordinate: {
    lat: string;
    lng: string;
  };
  status: number;
  country: string;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
  location_type: string;
}
declare interface UpdateStoreRequest {
  name: string;
  description: string;
  logo: string;
  banners: string[];
  is_restaurant: boolean;
  open_at?: Dayjs;
  close_at?: Dayjs;
  is_open_on_weekend: boolean;
  weekend_open_at: string;
  weekend_close_at: string;
  service_supports: string[];
  min_order: number | null;
  address: string;
  country: string | undefined;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
  coordinate: StoreAddress["coordinate"];
  location_type: string;
  isOpen24Hours: boolean;
  outletContactPerson?: string;
  halalCertified: boolean;
  muslimOwned: boolean;
  openingHoursMon?: Dayjs;
  openingHoursTue?: Dayjs;
  openingHoursWed?: Dayjs;
  openingHoursThu?: Dayjs;
  openingHoursFri?: Dayjs;
  openingHoursSat?: Dayjs;
  openingHoursSun?: Dayjs;
  closingHoursMon?: Dayjs;
  closingHoursTue?: Dayjs;
  closingHoursWed?: Dayjs;
  closingHoursThu?: Dayjs;
  closingHoursFri?: Dayjs;
  closingHoursSat?: Dayjs;
  closingHoursSun?: Dayjs;
  categoryLevel1Ids: number[];
  categoryLevel2Ids: number[];
  categoryLevel3Ids: number[];
  hours_until_auto_complete: number;
  merchantId: number;
  POSIds?: string;
}

declare interface AddressBody {
  address: string;
  service_supports: string[];
  description: string;
  coordinate: { lat: string; lng: string };
  country: string;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
  location_type: string;
  merchantStoreApprovalId: string;
  id: string;
}

declare interface StoreFormBody {
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
  service_supports: string[];
  status: number;
  min_order: number;
  isOpen24Hours: boolean;
  outletContactPerson?: string;
  halalCertified: boolean;
  muslimOwned: boolean;
  openingHoursMon?: string;
  openingHoursTue?: string;
  openingHoursWed?: string;
  openingHoursThu?: string;
  openingHoursFri?: string;
  openingHoursSat?: string;
  openingHoursSun?: string;
  closingHoursMon?: string;
  closingHoursTue?: string;
  closingHoursWed?: string;
  closingHoursThu?: string;
  closingHoursFri?: string;
  closingHoursSat?: string;
  closingHoursSun?: string;
  categoryLevel1Ids: number[];
  categoryLevel2Ids: number[];
  categoryLevel3Ids: number[];
  hours_until_auto_complete: number;
}

declare interface updateStoreRequestUpdate {
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
  service_supports: string[];
  status: number;
  min_order: number;
  isOpen24Hours: boolean;
  outletContactPerson?: string;
  halalCertified: boolean;
  muslimOwned: boolean;
  openingHoursMon?: string;
  openingHoursTue?: string;
  openingHoursWed?: string;
  openingHoursThu?: string;
  openingHoursFri?: string;
  openingHoursSat?: string;
  openingHoursSun?: string;
  closingHoursMon?: string;
  closingHoursTue?: string;
  closingHoursWed?: string;
  closingHoursThu?: string;
  closingHoursFri?: string;
  closingHoursSat?: string;
  closingHoursSun?: string;
  categoryLevel1Ids: number[];
  categoryLevel2Ids: number[];
  categoryLevel3Ids: number[];
  hours_until_auto_complete: number;
  updatedAddresses: AddressBody[];
}

declare interface updateStoreOnboard {
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
  service_supports: string[];
  status: number;
  min_order: number;
  isOpen24Hours: boolean;
  outletContactPerson?: string;
  halalCertified: boolean;
  muslimOwned: boolean;
  openingHoursMon?: string;
  openingHoursTue?: string;
  openingHoursWed?: string;
  openingHoursThu?: string;
  openingHoursFri?: string;
  openingHoursSat?: string;
  openingHoursSun?: string;
  closingHoursMon?: string;
  closingHoursTue?: string;
  closingHoursWed?: string;
  closingHoursThu?: string;
  closingHoursFri?: string;
  closingHoursSat?: string;
  closingHoursSun?: string;
  categoryLevel1Ids: number[];
  categoryLevel2Ids: number[];
  categoryLevel3Ids: number[];
  hours_until_auto_complete: number;
  updatedAddresses: AddressBody[];
  POSIds: string[];
}
