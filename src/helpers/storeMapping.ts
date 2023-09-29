import dayjs from "dayjs";
import { CODE_SINGAPORE, handlePhoneNumber } from "src/constants/patern";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StoreStatusRequest } from "src/constants";

dayjs.extend(customParseFormat);

export function getValueStoreForForm(value: any) {
  return {
    ...value,
    address: value.addresses[0].address || "",
    country: value.addresses[0].country || undefined,
    district: value.addresses[0].district || "",
    city_or_province: value.addresses[0].city_or_province || "",
    postal_code: value.addresses[0].postal_code || "",
    phone: value.addresses[0].phone
      ? handlePhoneNumber(value.addresses[0].phone)
      : "",
    coordinate: {
      lat: value.addresses[0].coordinate?.lat.toString() || "",
      lng: value.addresses[0].coordinate.lng?.toString() || "",
    },
    location_type: value.addresses[0].location_type || "",
    openingHoursMon: value.openingHoursMon
      ? dayjs(value.openingHoursMon, "HH:mm")
      : undefined,
    openingHoursTue: value.openingHoursTue
      ? dayjs(value.openingHoursTue, "HH:mm")
      : undefined,
    openingHoursWed: value.openingHoursWed
      ? dayjs(value.openingHoursWed, "HH:mm")
      : undefined,
    openingHoursThu: value.openingHoursThu
      ? dayjs(value.openingHoursThu, "HH:mm")
      : undefined,
    openingHoursFri: value.openingHoursFri
      ? dayjs(value.openingHoursFri, "HH:mm")
      : undefined,
    openingHoursSat: value.openingHoursSat
      ? dayjs(value.openingHoursSat, "HH:mm")
      : undefined,
    openingHoursSun: value.openingHoursSun
      ? dayjs(value.openingHoursSun, "HH:mm")
      : undefined,
    closingHoursMon: value.closingHoursMon
      ? dayjs(value.closingHoursMon, "HH:mm")
      : undefined,
    closingHoursTue: value.closingHoursTue
      ? dayjs(value.closingHoursTue, "HH:mm")
      : undefined,
    closingHoursWed: value.closingHoursWed
      ? dayjs(value.closingHoursWed, "HH:mm")
      : undefined,
    closingHoursThu: value.closingHoursThu
      ? dayjs(value.closingHoursThu, "HH:mm")
      : undefined,
    closingHoursFri: value.closingHoursFri
      ? dayjs(value.closingHoursFri, "HH:mm")
      : undefined,
    closingHoursSat: value.closingHoursSat
      ? dayjs(value.closingHoursSat, "HH:mm")
      : undefined,
    closingHoursSun: value.closingHoursSun
      ? dayjs(value.closingHoursSun, "HH:mm")
      : undefined,
  };
}

export const getBodyFromStoreValues = (
  values: UpdateStoreRequest
): StoreFormBody => {
  return {
    name: values.name,
    description: values.description,
    logo: values.logo,
    banners: values.banners,
    is_restaurant: values.is_restaurant ?? true,
    open_at: values.open_at?.format("HH:mm") || "",
    close_at: values.close_at?.format("HH:mm") || "",
    is_open_on_weekend: values.is_open_on_weekend ?? false,
    weekend_open_at: values.weekend_open_at,
    weekend_close_at: values.weekend_close_at || "",
    service_supports: values.service_supports,
    status: 1,
    min_order: Number(values.min_order),
    isOpen24Hours: values.isOpen24Hours,
    outletContactPerson: values?.outletContactPerson || undefined,
    halalCertified: values.halalCertified,
    muslimOwned: values.muslimOwned,
    openingHoursMon: values.openingHoursMon?.format("HH:mm") || undefined,
    openingHoursTue: values.openingHoursTue?.format("HH:mm") || undefined,
    openingHoursWed: values.openingHoursWed?.format("HH:mm") || undefined,
    openingHoursThu: values.openingHoursThu?.format("HH:mm") || undefined,
    openingHoursFri: values.openingHoursFri?.format("HH:mm") || undefined,
    openingHoursSat: values.openingHoursSat?.format("HH:mm") || undefined,
    openingHoursSun: values.openingHoursSun?.format("HH:mm") || undefined,
    closingHoursMon: values.closingHoursMon?.format("HH:mm") || undefined,
    closingHoursTue: values.closingHoursTue?.format("HH:mm") || undefined,
    closingHoursWed: values.closingHoursWed?.format("HH:mm") || undefined,
    closingHoursThu: values.closingHoursThu?.format("HH:mm") || undefined,
    closingHoursFri: values.closingHoursFri?.format("HH:mm") || undefined,
    closingHoursSat: values.closingHoursSat?.format("HH:mm") || undefined,
    closingHoursSun: values.closingHoursSun?.format("HH:mm") || undefined,
    categoryLevel1Ids: values.categoryLevel1Ids ? values.categoryLevel1Ids : [],
    categoryLevel2Ids: values.categoryLevel2Ids ? values.categoryLevel2Ids : [],
    categoryLevel3Ids: values.categoryLevel3Ids ? values.categoryLevel3Ids : [],
    hours_until_auto_complete: Number(values.hours_until_auto_complete),
  };
};

export const getAddressFromStoreValues = (
  values: UpdateStoreRequest,
  merchantId: string,
  id: string
): AddressBody => {
  return {
    address: values.address,
    service_supports: values.service_supports,
    description: "",
    coordinate: values.coordinate,
    country: values?.country || "",
    district: values?.district || "",
    city_or_province: values?.city_or_province || "",
    postal_code: values?.postal_code || "",
    phone: `${CODE_SINGAPORE}${
      values.phone[0] === "0" ? values.phone.replace("0", "") : values.phone
    }`,
    location_type: values.location_type,
    merchantStoreApprovalId: merchantId,
    id: id,
  };
};

export function getValueStoreForFormOnboard(value: any) {
  return {
    ...value,
    addressId: value.merchantStoreOnboardAddresses[0].id,
    address: value.merchantStoreOnboardAddresses[0].address || "",
    country: value.merchantStoreOnboardAddresses[0].country || undefined,
    district: value.merchantStoreOnboardAddresses[0].district || "",
    city_or_province:
      value.merchantStoreOnboardAddresses[0].city_or_province || "",
    postal_code: value.merchantStoreOnboardAddresses[0].postal_code || "",
    phone: value.merchantStoreOnboardAddresses[0].phone
      ? handlePhoneNumber(value.merchantStoreOnboardAddresses[0].phone)
      : "",
    coordinate: {
      lat:
        value.merchantStoreOnboardAddresses[0].coordinate?.lat.toString() || "",
      lng:
        value.merchantStoreOnboardAddresses[0].coordinate.lng?.toString() || "",
    },
    location_type: value.merchantStoreOnboardAddresses[0].location_type || "",
    openingHoursMon: value.openingHoursMon
      ? dayjs(value.openingHoursMon, "HH:mm")
      : undefined,
    openingHoursTue: value.openingHoursTue
      ? dayjs(value.openingHoursTue, "HH:mm")
      : undefined,
    openingHoursWed: value.openingHoursWed
      ? dayjs(value.openingHoursWed, "HH:mm")
      : undefined,
    openingHoursThu: value.openingHoursThu
      ? dayjs(value.openingHoursThu, "HH:mm")
      : undefined,
    openingHoursFri: value.openingHoursFri
      ? dayjs(value.openingHoursFri, "HH:mm")
      : undefined,
    openingHoursSat: value.openingHoursSat
      ? dayjs(value.openingHoursSat, "HH:mm")
      : undefined,
    openingHoursSun: value.openingHoursSun
      ? dayjs(value.openingHoursSun, "HH:mm")
      : undefined,
    closingHoursMon: value.closingHoursMon
      ? dayjs(value.closingHoursMon, "HH:mm")
      : undefined,
    closingHoursTue: value.closingHoursTue
      ? dayjs(value.closingHoursTue, "HH:mm")
      : undefined,
    closingHoursWed: value.closingHoursWed
      ? dayjs(value.closingHoursWed, "HH:mm")
      : undefined,
    closingHoursThu: value.closingHoursThu
      ? dayjs(value.closingHoursThu, "HH:mm")
      : undefined,
    closingHoursFri: value.closingHoursFri
      ? dayjs(value.closingHoursFri, "HH:mm")
      : undefined,
    closingHoursSat: value.closingHoursSat
      ? dayjs(value.closingHoursSat, "HH:mm")
      : undefined,
    closingHoursSun: value.closingHoursSun
      ? dayjs(value.closingHoursSun, "HH:mm")
      : undefined,
  };
}

// todo: define type for values
export function getBodyForForm(
  values: UpdateStoreRequest,
  logoUrl: string,
  bannerUrl: string[],
  addressBody: AddressBody
) {
  return {
    ...getBodyFromStoreValues(values),
    logo: logoUrl,
    banners: bannerUrl,
    updatedAddresses: [addressBody],
  };
}
