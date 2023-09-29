declare interface OrderHistory {
  create_time: Date;
  id: number;
  merchant_store_id: number;
  user_id: number;
  note: string;
  status: number;
  store: {
    merchant_id: number;
    name: string;
    logo: string;
    banners: string[];
    merchant: {
      name: string;
      logo: string;
    };
  };
  payment: {
    amount: number;
    discount_amount: number;
    loyalty_point: number;
    loyalty_discount_amount: number;
    delivery_fee: number;
  };
  items: [
    {
      id: number;
      product_id: number;
      quantity: number;
      original_price: number;
      final_price: number;
      bundles: [
        {
          price: number;
          attribute_name: string;
          attribute_value: string;
        }
      ];
      product: {
        name: string;
        images: string[];
      };
    }
  ];
  transactions: [
    {
      id: number;
      merchant_store_id: number;
      amount: number;
      payment_method: number;
      payment_gateway: string;
      reference_id: string;
      amount_breakdown: {
        discount_amount: number;
        delivery_fee: number;
        platform_fee: number;
        item_amount: number;
        net_amount: number;
        used_loyalty_point: number;
        loyalty_discount_amount: number;
        lp_campaign_discount: number;
      };
      status: number;
      type: number;
    }
  ];
  histories: object[];
}
