import { MerchantSettlementReport } from "src/types/settlemets";
import { last } from "lodash";
import { PaginationMetadata } from "./index";

export type SettlementResponse = {
  data: SettlementItem[];
  metadata: PaginationMetadata;
};

// export type InvolvedMerchantResponse = {
//     data: InvolvedMerchant[];
//     metadata: PaginationMetadata;
// };

export type InvolvedMerchant = {
  merchant_id: number;
  merchant_name: string;
};

export type SettlementOrderResponse = {
  data: SettlementOrder[];
  metadata: PaginationMetadata;
};

declare interface SettlementItem {
  actual_transaction_date: string;
  last_transaction_date: string;
  create_time: string;
  id: number;
  merchant_store_id: number;
  amount_breakdown: {
    DISCOUNT_AMOUNT: number;
    LP_AMOUNT: number;
    NET_AMOUNT: number;
    ITEM_AMOUNT: number;
    DELIVERY_FEE: number;
    PLATFORM_FEE: number;
    LP_DISCOUNT_AMOUNT: number;
    LP_SPENT: number;
    TOTAL_ORDER: number;
    TOTAL_USER_PAID_AMOUNT: number;
  };
  merchant: {
    id: number;
    name: string;
  };
  histories: [{ time: string; status: number }];
  status: number;
}

declare interface LoyaltyPointMerchant {
  balance: number;
}

declare interface SettlementOrder {
  create_time: string;
  id: number;
  merchant_store_id: number;
  store: {
    name: string;
  };
  transactions: SettlementOrderTrans[];
  histories: { create_time: string; order_id: string; status: number }[];
  status: number;
}

declare interface SettlementOrderTrans {
  amount_breakdown: {
    platform_fee: number;
    used_loyalty_point: number;
    net_amount: number;
    item_amount: number;
  };
}

declare interface DailySettlementReport {
  tx_date: string;
  established_date: string;
  total_transaction: number;
  total_amonut: number;
}

declare interface MerchantSettlementReport {
  settlement_id: string;
  settlement_last_transaction_date: string;
  merchant_id: string;
  merchant_name: string;
  merchantBank_bank_name: string;
  merchantBank_account_name: string;
  merchantBank_account_no: string;
  total_order: string;
  total_amount: string;
}

declare interface StoreSettlementReport {
  settlement_last_transaction_date: string;
  store_name: string;
  store_id: string;
  store_total_order: string;
  store_total_amount: string;
  settlement_id: string;
}
declare interface ShipmentDataStop {
  deliveryID: string;
  merchantOrderID: string;
  paymentMethod: string;
  pickupPin: string;
  recipient: {
    firstName: string;
    phone: string;
  };
}
declare interface Shipment {
  id: number;
  address: string;
  data: ShipmentDataStop;
}

declare interface AmountBreakdown {
  discount_amount: number;
  delivery_fee: number;
  platform_fee: number;
  item_amount: number;
  net_amount: number;
  loyalty_discount_amount: number;
  lp_campaign_discount: number;
  used_loyalty_point: number;
}
declare interface OrderSettlementReport {
  id: string;
  items: orderItemSettlement[];
  payment: OrderPaymentSettlementReport;
  shipments: Shipment[];
  transactions: { amount_breakdown: AmountBreakdown }[];
}
declare interface orderItemSettlement {
  id: string;
  product: {
    id: string;
    name: string;
  };
}
declare interface OrderPaymentSettlementReport {
  amount: number;
  campaign_loyalty_point: number;
  delivery_fee: number;
  description: string;
  discount_amount: number;
  id: string;
  loyalty_discount_amount: number;
  loyalty_point: number;
  min_order: number;
  order_id: string;
  rewardLoyaltyPointForUser: number;
  status: number;
  total_amount: number;
}
declare interface MerchantSettlementReportDetail {
  account_name: string;
  account_no: string;
  bank_name: string;
  merchant_id: string;
  merchant_name: string;
  total_amount: string;
  total_order: string;
}
