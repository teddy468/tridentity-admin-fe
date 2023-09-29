import { Button, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import SearchTable from "src/components/11.tables/SearchTable";
import { format2Digit } from "src/constants";
import { formatDateTime } from "src/helpers/date";
import { SettlementService } from "src/services/settlement-service";
import {
  MerchantSettlementReport,
  OrderSettlementReport,
} from "src/types/settlemets";

interface Props {
  orderId: string;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
}
const SearchSettlementReports: React.FC<Props> = ({
  orderId,
  setTotalItems,
}) => {
  const [orderDataSrc, setOrderDataSrc] = useState<any>([]);
  const [merchantDataSrc, setMerchantDataSrc] = useState<any>([]);

  const getOrderDetail = async (orderId: string) => {
    try {
      const res = await SettlementService.getOrderSettlementReportsDetail(
        orderId
      );
      if (!res.data) {
        setTotalItems(0);
        return;
      }

      const merchantRes =
        await SettlementService.getMerchantSettlementReportsSummary(
          res.data.store.merchant.id
        );
      setMerchantDataSrc([
        {
          merchant_name: res.data.store.merchant.name,
          store_name: res.data.store.name,
          store_id: res.data.store.id,
          total_order: merchantRes.data.total_order,
          total_amount: merchantRes.data.total_amount,
        },
      ]);

      setOrderDataSrc([
        {
          create_time: res.data.payment.create_time,
          order_id: res.data.id,
          product_name: res.data.items
            .map((item: any) => item.product.name)
            .join(", "),
          customer_name: res.data?.shipments?.[0]?.data?.recipient?.firstName,
          customer_phone:
            "+" + res.data?.shipments?.[0]?.data?.recipient?.phone,
          order_address: res.data?.shipments?.[0]?.address,
          amount: res.data.payment.total_amount,
        },
      ]);
      setTotalItems(1);
    } catch (error) {
      console.log(error);
    }
  };

  const merchantColumn: ColumnsType<MerchantSettlementReport> = [
    {
      title: "Merchant Name",
      dataIndex: "merchant_name",
      key: "merchantName",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Store Name",
      dataIndex: "store_name",
      key: "merchantID",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Store ID",
      dataIndex: "store_id",
      key: "storeID",
      render: (text: string, record) => <span>{text}</span>,
      width: 220,
    },
    {
      title: "Total Order",
      dataIndex: "total_order",
      key: "totalOrder",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "totalAmount",
      render: (text: string) => <span>S${format2Digit(text)}</span>,
    },
  ];

  const orderColumn: ColumnsType<OrderSettlementReport> = [
    {
      title: "Order Date",
      dataIndex: "create_time",
      key: "lastTransaction",
      render: (text: string) => <span>{formatDateTime(text)}</span>,
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "orderID",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "productName",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customerName",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Customer Phone",
      dataIndex: "customer_phone",
      key: "customerPhone",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Order address",
      dataIndex: "order_address",
      key: "orderAddress",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: string) => <span>S${format2Digit(text)}</span>,
    },
  ];

  useEffect(() => {
    if (!orderId) return;
    getOrderDetail(orderId);
  }, [orderId]);

  return (
    <Modal
      width={"1400px"}
      open={
        orderDataSrc.length > 0 && merchantDataSrc.length > 0 ? true : false
      }
      onCancel={() => {
        setMerchantDataSrc([]);
        setOrderDataSrc([]);
      }}
      footer={
        <Button
          onClick={() => {
            setMerchantDataSrc([]);
            setOrderDataSrc([]);
          }}
        >
          Cancel
        </Button>
      }
    >
      <SearchTable columns={merchantColumn} dataSource={merchantDataSrc} />

      <SearchTable columns={orderColumn} dataSource={orderDataSrc} />
    </Modal>
  );
};

export default SearchSettlementReports;
