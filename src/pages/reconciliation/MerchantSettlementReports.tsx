import { DatePicker, Space, Button, message, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import useDataTable from "src/hooks/useDataTable";
import { MerchantSettlementReport } from "src/types/settlemets";
import CategoryAttributeSearch from "../category-and-attribute/CategoryAttributeSearch";
import SearchTable from "src/components/11.tables/SearchTable";
import { SettlementService } from "src/services/settlement-service";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { formatDateTime } from "src/helpers/date";
import CardContent from "src/routes/components/CardContent";
import "./styles.scss";
import { format2Digit } from "src/constants";
import { useHistory } from "react-router";
import { PATHS } from "src/constants/paths";

const MerchantSettlementReports = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get("date") as string;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const history = useHistory();

  const { dataSrc, loading, params, metadata, fetchData, onChangeTable } =
    useDataTable(SettlementService.getMerchantSettlementReports);

  const columns: ColumnsType<MerchantSettlementReport> = [
    {
      title: "Last Transaction",
      dataIndex: "settlement_last_transaction_date",
      key: "lastTransaction",
      render: (text: string) => <span>{formatDateTime(text)}</span>,
    },
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
            {record.merchantBank_bank_name} | {record.merchantBank_account_no}
          </div>
          <span className="bankAccount">
            {record.merchantBank_account_name}
          </span>
        </div>
      ),
      width: 220,
    },
    {
      title: "Total Order",
      dataIndex: "total_order",
      key: "totalOrder",
      render: (text: string) => <span className="totalOrder">{text}</span>,
    },
    {
      title: "Settlement Amount",
      dataIndex: "total_amount",
      key: "settlementAmount",
      render: (text: string) => <span>S${format2Digit(text)}</span>,
    },
  ];

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: MerchantSettlementReport[]
    ) => {
      setSelectedRowKeys(selectedRows.map((item) => item.settlement_id));
    },
  };
  const handleExportCSV = async () => {
    try {
      await SettlementService.exportMerchantSettlementReports(
        selectedRowKeys.join(",")
      );
      message.success("Export CSV successfully");
    } catch (error) {
      message.error("Export CSV failed");
      console.log(error);
    }
  };

  const handleConfirmExportCSV = () => {
    Modal.confirm({
      title: "Do you want to export CSV?",
      icon: <ExclamationCircleOutlined />,
      content: "Export CSV will download a file to your computer",
      okText: "Yes",
      cancelText: "No",
      onOk: handleExportCSV,
    });
  };
  const Header = () => {
    return (
      <Space className={"datePicker"}>
        <div></div>
        <Button
          type="primary"
          onClick={handleConfirmExportCSV}
          disabled={selectedRowKeys.length === 0}
        >
          Export CSV
        </Button>
      </Space>
    );
  };

  const handleNavigateToStoreSettlementReport = (merchantId: string) => {
    history.push(
      PATHS.reconciliationStoreByDate().replace(":merchantId", merchantId)
    );
  };

  useEffect(() => {
    fetchData({
      ...params,
      keyword: keyword,
      date: date,
    });
  }, [params, keyword]);
  return (
    <div>
      <TridentityPageHeader title="Merchant List" backIcon={true} />
      <div className="category-attribute-search  active">
        <CategoryAttributeSearch
          onSearch={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder="Search Merchant ID or name"
          totalItemsTable={Number(metadata["x-total-count"])}
        />
      </div>
      <CardContent>
        <SearchTable
          title={() => (
            <div>
              <Header />
            </div>
          )}
          columns={columns}
          dataSource={dataSrc}
          onChange={onChangeTable}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
          rowKey={"indexTable"}
          loading={loading}
          rowSelection={rowSelection}
          onRow={(record: MerchantSettlementReport, rowIndex) => {
            return {
              onClick: (event) => {
                handleNavigateToStoreSettlementReport(record.merchant_id);
              },
            };
          }}
          className="cursor-pointer"
        />
      </CardContent>
    </div>
  );
};

export default MerchantSettlementReports;
