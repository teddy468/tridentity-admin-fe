import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { format2Digit } from "src/constants";
import { formatDateTime } from "src/helpers/date";
import useDataTable from "src/hooks/useDataTable";
import useDataTableWithId from "src/hooks/useDataTableWithId";
import CardContent from "src/routes/components/CardContent";
import { SettlementService } from "src/services/settlement-service";
import {
  MerchantSettlementReport,
  MerchantSettlementReportDetail,
  OrderPaymentSettlementReport,
  OrderSettlementReport,
  orderItemSettlement,
} from "src/types/settlemets";
import useGetMerchantSettlementReportSummary from "./hooks/useGetMerchantSettlementReportSummary";

const StoreSettlementReportDetail = () => {
  const { settlementId } = useParams<{ settlementId: string }>();
  const { merchantId } = useParams<{ merchantId: string }>();

  const {
    dataSrc: orderDataSrc,
    loading,
    params,
    metadata,
    fetchData,
    onChangeTable,
  } = useDataTableWithId(SettlementService.getStoreOrderSettlementReports);
  const { merchantDataSrc, getMerchantSettlementReportsSummary } =
    useGetMerchantSettlementReportSummary();
    
  const merchantColumn: ColumnsType<MerchantSettlementReportDetail> = [
    {
      title: "Merchant Name",
      dataIndex: "merchant_name",
      key: "merchantName",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Merchant ID",
      dataIndex: "merchant_id",
      key: "merchantID",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Payment Information",
      dataIndex: "paymentInformation",
      key: "paymentInformation",
      render: (text: string, record) => (
        <div>
          <div>
            {record.bank_name} | {record.account_no}
          </div>
          <span className="bankAccount">{record.account_name}</span>
        </div>
      ),
      width: 220,
    },
    {
      title: "Total Orders",
      dataIndex: "total_order",
      key: "totalOrder",
      render: (text: string, record) => <span>{text}</span>,
    },
    {
      title: "Settlement Amount",
      dataIndex: "total_amount",
      key: "settlementAmount",
      render: (text: string) => <span>S${format2Digit(text)}</span>,
    },
  ];

  const orderColumn: ColumnsType<OrderSettlementReport> = [
    {
      title: "Last Transaction",
      dataIndex: "create_time",
      key: "lastTransaction",
      render: (text: string) => <span>{formatDateTime(text)}</span>,
    },
    {
      title: "Order ID",
      dataIndex: "id",
      key: "orderID",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Product Name",
      dataIndex: "items",
      key: "productName",
      render: (products: orderItemSettlement[]) => {
        return (
          <span>{products.map((item) => item.product.name).join(", ")}</span>
        );
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customerName",
      render: (text: string, record) => (
        <span>{record?.shipments?.[0]?.data?.recipient?.firstName}</span>
      ),
    },
    {
      title: "Customer Phone",
      dataIndex: "customer_phone",
      key: "customerPhone",
      render: (text: string, record) => (
        <span>
          {record?.shipments?.[0]?.data?.recipient?.phone &&
            "+" + record?.shipments?.[0]?.data?.recipient?.phone}
        </span>
      ),
    },
    {
      title: "Order address",
      dataIndex: "order_address",
      key: "orderAddress",
      render: (text: string, record) => (
        <span>{record?.shipments?.[0]?.address}</span>
      ),
    },
    {
      title: "Platform fee",
      dataIndex: "platform_fee",
      key: "platformFee",
      render: (text: string, record) => (
        <span>
          S$
          {format2Digit(
            record?.transactions?.[0].amount_breakdown.platform_fee
          )}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: string, record) => (
        <span>
          S$
          {format2Digit(record?.transactions?.[0].amount_breakdown.net_amount)}
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (!merchantId) return;
    getMerchantSettlementReportsSummary(merchantId);
  }, [merchantId]);

  useEffect(() => {
    if (!settlementId) return;
    fetchData(settlementId, params);
  }, [settlementId, params]);
  return (
    <>
      <TridentityPageHeader title="Order List" backIcon={true} />{" "}
      <CardContent>
        <SearchTable columns={merchantColumn} dataSource={merchantDataSrc} />

        <SearchTable
          columns={orderColumn}
          dataSource={orderDataSrc}
          onChange={onChangeTable}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
          rowKey={"indexTable"}
          loading={loading}
          className="cursor-pointer"
        />
      </CardContent>
    </>
  );
};

export default StoreSettlementReportDetail;
