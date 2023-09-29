import { ServiceBase } from "./core/service-base";
export class SystemServices extends ServiceBase {
  getMetaParameters = async () => {
    return this.get("system-meta-parameters");
  };
  setLpConversion = async (percent: number) => {
    return this.put("system-meta-parameters/lp-conversion", { percent });
  };
  setPlatformFee = async (percent: number) => {
    return this.put("system-meta-parameters/platform-fee", { percent });
  };
  setShippingFee = async (fixed_shipping_fee: number) => {
    return this.put("admin/parameter-config/fixed-shipping-fee", {
      fixed_shipping_fee,
    });
  };
  setMinOrderFee = async (min_order: number) => {
    return this.put("system-meta-parameters/platform-min-order", {
      min_order,
    });
  };
  setFixedShippingFee = async (is_fixed_shipping_fee_enabled: boolean) => {
    return this.put("admin/parameter-config/is-fixed-shipping-fee-enabled", {
      is_fixed_shipping_fee_enabled,
    });
  };
  setOrderReceivedTimeout = async (timeout: number) => {
    return this.put("system-meta-parameters/order-received-timeout", {
      timeout,
    });
  };
  setRefundTimeout = async (timeout: number) => {
    return this.put("system-meta-parameters/refund-timeout", { timeout });
  };
  setExchangeRate = async (lp_rate: number, sgd_rate: number) => {
    return this.put("system-meta-parameters/exchange-rate", {
      lp_rate,
      sgd_rate,
    });
  };
  setMerchantExchangeRate = async (lp_rate: number, sgd_rate: number) => {
    return this.put("system-meta-parameters/merchant-exchange-rate", {
      lp_rate,
      sgd_rate,
    });
  };
  getUserMembership = async () => {
    return this.get("system-meta-parameters/user-membership");
  };
  setUserMembership = async (
    tier: string,

    extra_lp: number
  ) => {
    return this.put("system-meta-parameters/user-membership/" + tier, {
      extra_lp,
    });
  };
  setMerchantMembership = async (
    tier: string,
    platform_fee_discount: number
  ) => {
    return this.put("system-meta-parameters/merchant-membership/" + tier, {
      platform_fee_discount,
    });
  };
  updateAvatarByTier = async (tier: number, url: string) => {
    return this.put("system-meta-parameters/user-membership-avatar/" + tier, {
      url,
    });
  };
  setPlatformSettlementReportTime = async (time: {
    hour: number;
    minute: number;
    second: number;
  }) => {
    return this.put("system-meta-parameters/settlement-report-time", time);
  };
}
