import { Button, DatePicker, Input, Modal, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useMemo, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { DailySettlementReport } from "src/types/settlemets";
import CategoryAttributeSearch from "../category-and-attribute/CategoryAttributeSearch";
import useDataTable from "src/hooks/useDataTable";
import moment from "moment";
import CardContent from "src/routes/components/CardContent";
import { SettlementService } from "src/services/settlement-service";
import "./styles.scss";
import {
  formatDate,
  formatDateTime,
  formatYearComeFirst,
} from "src/helpers/date";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import SearchSettlementReports from "src/components/05.modal/components/SearchSettlementReports/SearchSettlementReports";
import { format2Digit } from "src/constants";

const { RangePicker } = DatePicker;

interface DataType extends DailySettlementReport {
  key: React.Key;
}
const { Search } = Input;

const DailySettlement = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [startDate, setStartDate] = useState(moment().startOf("month"));
  const [endDate, setEndDate] = useState(moment().endOf("month"));
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const { dataSrc, loading, params, metadata, fetchData, onChangeTable } =
    useDataTable(SettlementService.getDailySettlementReports);

  const tableData = useMemo(() => {
    return dataSrc.map((item, idx) => {
      return {
        ...item,
        key: idx + 1,
      };
    });
  }, [dataSrc]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "tx_date",
      key: "date",
      render: (text: string) => (
        <Link
          to={`/settlement-report/merchants?date=${formatYearComeFirst(text)}`}
        >
          {formatDate(text)}
        </Link>
      ),
    },
    {
      title: "Established date",
      dataIndex: "established_date",
      key: "establishedDate",
      render: (text: string) => <span>{formatDateTime(text)}</span>,
    },
    {
      title: "Total transactions",
      dataIndex: "total_transaction",
      key: "totalTransactions",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Total amount",
      dataIndex: "total_amount",
      key: "totalAmount",
      render: (text: string) => <span>S${format2Digit(text)}</span>,
    },
    {
      title: "Settlement Report File",
      dataIndex: "settlementReportFile",
      key: "settlementReportFile",
      render: (text: string, record) => (
        <Button
          type="primary"
          onClick={() => {
            handleConfirmExportCSV([record.tx_date]);
          }}
        >
          Export CSV
        </Button>
      ),
    },
  ];

  const dateChange = (values: any, dateStrings: [string, string]) => {
    if (values && values.length >= 2) {
      setStartDate(values[0]);
      setEndDate(values[1]);
    }
  };

  const Header = () => {
    return (
      <div className="datePicker">
        <RangePicker
          size={"large"}
          format={"DD/MM/YYYY"}
          onChange={dateChange}
          defaultValue={[
            moment(startDate, "YYYY-MM-DD"),
            moment(endDate, "YYYY-MM-DD"),
          ]}
        />
        <Button
          type="primary"
          onClick={() => handleConfirmExportCSV(selectedRowKeys)}
          disabled={selectedRowKeys.length === 0}
        >
          Export CSV
        </Button>
      </div>
    );
  };

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: DailySettlementReport[]
    ) => {
      setSelectedRowKeys(selectedRows.map((item) => item.tx_date));
    },
  };

  const handleExportCSV = async (selectedRowKeys: string[]) => {
    try {
      await SettlementService.exportDailySettlementReports(selectedRowKeys);
      message.success("Export CSV successfully");
    } catch (error) {
      message.error("Export CSV failed");
      console.log(error);
    }
  };

  const handleConfirmExportCSV = (selectedRowKeys: string[]) => {
    Modal.confirm({
      title: "Do you want to export CSV?",
      icon: <ExclamationCircleOutlined />,
      content: "Export CSV will download a file to your computer",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleExportCSV(selectedRowKeys),
    });
  };

  useEffect(() => {
    fetchData({
      ...params,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });
  }, [params, startDate, endDate]);

  return (
    <div>
      <TridentityPageHeader title="Settlement Report" backIcon={true} />

      <CategoryAttributeSearch
        onSearch={(e) => {
          setOrderId(e.target.value);
        }}
        placeholder="Search Order ID"
        totalItemsTable={totalItems}
      />

      <CardContent>
        <SearchTable
          title={() => (
            <div>
              <Header />
            </div>
          )}
          columns={columns}
          dataSource={tableData}
          onChange={onChangeTable}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
          rowKey={"key"}
          loading={loading}
          rowSelection={rowSelection}
        />
      </CardContent>
      <SearchSettlementReports
        orderId={orderId}
        setTotalItems={setTotalItems}
      />
    </div>
  );
};

export default DailySettlement;
