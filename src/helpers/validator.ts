import { ValidatorRule } from "rc-field-form/lib/interface";

export const isValidAddress =
  (latLng: StoreAddress["coordinate"] | null): ValidatorRule["validator"] =>
  async (_, value) => {
    if (!value || (latLng?.lat && latLng?.lng)) return Promise.resolve();
    return Promise.reject(new Error(`Address invalid`));
  };
