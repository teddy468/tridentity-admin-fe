import React, { useEffect, useState } from "react";
import "./styles.scss";
import { ColumnsType } from "antd/lib/table";
import {
  MerchantSettlementReport,
  MerchantSettlementReportDetail,
  StoreSettlementReport,
} from "src/types/settlemets";
import { format2Digit } from "src/constants";
import { formatDateTime } from "src/helpers/date";
import CardContent from "src/routes/components/CardContent";
import SearchTable from "src/components/11.tables/SearchTable";
import TridentityPageHeader from "src/components/02.page-header";
import { SettlementService } from "src/services/settlement-service";
import { useHistory, useParams } from "react-router";
import useDataTableWithId from "src/hooks/useDataTableWithId";
import { PATHS } from "src/constants/paths";
import useGetMerchantSettlementReportSummary from "./hooks/useGetMerchantSettlementReportSummary";

const StoreSettlementReportByDate = () => {
  const history = useHistory();
  const { merchantId } = useParams<{ merchantId: string }>();

  const {
    dataSrc: storeDataSrc,
    loading,
    params,
    metadata,
    fetchData,
    onChangeTable,
  } = useDataTableWithId(SettlementService.getMerchantStoreSettlementReports);

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
      title: "Total Orders",
      dataIndex: "total_order",
      key: "totalOrder",
      render: (text: string, record) => <span>{text}</span>,
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
      title: "Settlement Amount",
      dataIndex: "total_amount",
      key: "settlementAmount",
      render: (text: string) => <span>S${format2Digit(text)}</span>,
    },
  ];

  const storeColumn: ColumnsType<StoreSettlementReport> = [
    {
      title: "Last Transaction",
      dataIndex: "settlement_last_transaction_date",
      key: "lastTransaction",
      render: (text: string) => <span>{formatDateTime(text)}</span>,
    },
    {
      title: "Store Name",
      dataIndex: "store_name",
      key: "storeName",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Store ID",
      dataIndex: "store_id",
      key: "storeID",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Total Order",
      dataIndex: "store_total_order",
      key: "totalOrder",
      render: (text: string) => <span className="totalOrder">{text}</span>,
    },
    {
      title: "Total Amount",
      dataIndex: "store_total_amount",
      key: "totalAmount",
      render: (text: string) => <span>S${format2Digit(text)}</span>,
    },
  ];

  const handleNavigateStoreOrderDetail = (
    settlementId: string,
    merchantId: string
  ) => {
    history.push(
      PATHS.reconciliationOrderByDate()
        .replace(":settlementId", settlementId)
        .replace(":merchantId", merchantId)
    );
  };

  useEffect(() => {
    if (!merchantId) return;
    getMerchantSettlementReportsSummary(merchantId);
  }, [merchantId]);
  useEffect(() => {
    if (!merchantId) return;
    fetchData(merchantId, params);
  }, [params, merchantId]);
  return (
    <>
      <TridentityPageHeader title="Store List" backIcon={true} />{" "}
      <CardContent>
        <SearchTable columns={merchantColumn} dataSource={merchantDataSrc} />

        <SearchTable
          columns={storeColumn}
          dataSource={storeDataSrc}
          onChange={onChangeTable}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
          rowKey={"indexTable"}
          loading={loading}
          className="cursor-pointer"
          onRow={(record: StoreSettlementReport) => {
            return {
              onClick: () => {
                handleNavigateStoreOrderDetail(
                  record.settlement_id,
                  merchantId
                );
              },
            };
          }}
        />
      </CardContent>
    </>
  );
};

export default StoreSettlementReportByDate;
