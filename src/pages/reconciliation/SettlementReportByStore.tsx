import { Button, Col, DatePicker, message, Row, Select, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { format2Digit } from "src/constants";
import { formatIndexTable, formatLP } from "src/helpers/formatNumber";
import TridentityPageHeader from "../../components/02.page-header";
import SearchTable from "../../components/11.tables/SearchTable";
import CardContent from "../../routes/components/CardContent";
import { reconciliationService } from "../../services/reconciliation";
import ConfirmApprove from "./ConfirmApprove";
import "./styles.scss";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

interface DataType {
  key: React.Key;
  id: number;
  actual_transaction_date: string;
  last_transaction_date: string;
  merchantId: number;
  merchantName: string;
  date: string;
  totalOrder: number;
  platformFee: number;
  lpEarned: number;
  profit: number;
  status: { status: number };
}

const { RangePicker } = DatePicker;

export enum SettlementStatus {
  CREATED = 0,
  REQUESTED = 1,
  PROCESSING = 2,
  PAID = 3,
}

export const statusMessages: Record<number, string[]> = {
  [SettlementStatus.CREATED]: ["Created", "LP Cash out Created"],
  [SettlementStatus.REQUESTED]: ["Requested", "LP Cash out Requested"],
  [SettlementStatus.PROCESSING]: ["Processing", "LP Cash out Processing"],
  [SettlementStatus.PAID]: ["Paid", "LP Cash out"],
};

export function getStatusMessageFiat(status: number): string {
  return statusMessages[status][0] || "Invalid status";
}

export function formatAmount(amount: number): string {
  if (amount === 0) {
    return "0.00";
  }

  // Round the amount to two decimal places
  const roundedAmount = amount.toFixed(2);

  // Convert the rounded amount to a string and remove any leading zeros
  const amountStr = String(roundedAmount).replace(/^0+/, "");

  // Split the string into integer and decimal parts
  const [integerPart, decimalPart = ""] = amountStr.split(".");

  // Format the integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Pad the decimal part with trailing zeros to always have two decimal places
  const formattedDecimal = decimalPart.padEnd(2, "0");

  // Combine the integer and decimal parts with a dot separator
  return formattedInteger + "." + formattedDecimal;
}

export function getStatusClass(status: number): any {
  if (status === SettlementStatus.CREATED) {
    return "createdStatus";
  } else if (status === SettlementStatus.PROCESSING) {
    return "processingStatus";
  } else if (status === SettlementStatus.REQUESTED) {
    return "requestedStatus";
  } else {
    return "paidStatus";
  }
}

const Reconciliation = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["settlement-report-permission"]
  );
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(2);
  const [numPerPage, setNumPerPage] = useState(10);
  const [searchKey] = useState("");
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [status, setStatus] = useState("");
  const [merchantId, setMerchantId] = useState<any[]>([]);
  const [disableApprove, setDisableApprove] = useState(true);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);

  const [startDate, setStartDate] = useState(moment().startOf("month"));
  const [endDate, setEndDate] = useState(moment().endOf("month"));
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(1);

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: DataType[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedId(selectedRows.map((value) => value.id));
  };

  useEffect(() => {
    if (selectedId && selectedId.length > 0) {
      setDisableApprove(false);
    } else {
      setDisableApprove(true);
    }
  }, [selectedId, setSelectedId.length]);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,

    getCheckboxProps: (record: DataType) => ({
      disabled: record.status.status !== SettlementStatus.CREATED,
      name: record.id.toString(),
    }),
  };

  const [dataSrc, setDataSrc] = useState<DataType[]>([]);
  const [merchantOptions, setMerchantOptions] = useState<any[]>([]);

  const goToDetail = (id: number) =>
    history.push(`/settlement-report/detail/${id}`);

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span>{text}</span>,
      width: 60,
    },
    {
      title: "Transaction Date",
      dataIndex: "last_transaction_date",
      key: "id",
      render: (text: string, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          {text}
        </span>
      ),
    },
    {
      title: "Settlement D&T",
      dataIndex: "date",
      key: "id",
      render: (text: string, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          {text}
        </span>
      ),
    },
    {
      title: "Actual Settlement D&T",
      dataIndex: "actual_transaction_date",
      render: (text: string, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          {text}
        </span>
      ),
    },
    {
      title: "Merchant ID",
      dataIndex: "merchantId",
      key: "merchantId",
      render: (text: string, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          {text}
        </span>
      ),
    },
    {
      title: "Merchant name",
      dataIndex: "merchantName",
      key: "merchantName",
      render: (text: string, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          {text}
        </span>
      ),
    },
    {
      title: "Total Orders",
      dataIndex: "totalOrder",
      render: (text, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          {text}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (text, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          S$ {format2Digit(text)}
        </span>
      ),
    },
    {
      title: "Platform fee",
      dataIndex: "platformFee",
      render: (text, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          S$ {format2Digit(text)}
        </span>
      ),
    },
    {
      title: "LP earned",
      dataIndex: "lpEarned",
      render: (text, record) => (
        <span className={"pointer"} onClick={() => goToDetail(record.id)}>
          {formatLP(text)}
        </span>
      ),
    },
    {
      title: "Settlement amount",
      dataIndex: "profit",
      render: (text, record) => <span>S${format2Digit(text)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div className={"pointer"} onClick={() => goToDetail(record.id)}>
            <span className={getStatusClass(record.status.status)}>
              {getStatusMessageFiat(record.status.status)}
            </span>
            <br />
          </div>
        );
      },
    },
  ];

  const handleMerchantId = (merchantId: any[]) => {
    if (merchantId.length === 1 && merchantId[0] === "all") {
      return [];
    }
    return merchantId;
  };

  useEffect(() => {
    const newDate = endDate.clone().add(1, "day");
    const params = {
      start_date: startDate.toISOString(),
      end_date: newDate.toISOString(),
      status: status ? Number(status) : "",
      page: currentPage,
      perPage: numPerPage,
      keyword: searchKey,
      merchant_ids: merchantId.length > 0 ? handleMerchantId(merchantId) : [],
      paginationMetadataStyle: "body",
    };
    setLoading(true);
    reconciliationService.getSettlements(params).then((res) => {
      setTotalItems(res?.metadata["x-total-count"]);
      setDataSrc(
        res?.data.map((product, index) => {
          return {
            key: product.id.toString(),
            date: moment(product.create_time).format("DD/MM/yyyy HH:mm"),
            last_transaction_date: product.last_transaction_date
              ? moment(product.last_transaction_date).format("DD/MM/yyyy")
              : "",
            actual_transaction_date: product.actual_transaction_date
              ? moment(product.actual_transaction_date).format(
                  "DD/MM/yyyy HH:mm"
                )
              : "",
            id: product.id,
            status: { status: product.status },
            lpEarned: product.amount_breakdown.LP_AMOUNT,
            platformFee: product.amount_breakdown.PLATFORM_FEE,
            profit: product.amount_breakdown.NET_AMOUNT,
            totalOrder: product.amount_breakdown.TOTAL_ORDER,
            total: product.amount_breakdown.TOTAL_USER_PAID_AMOUNT,
            merchantId: product.merchant.id,
            merchantName: product.merchant.name,
            indexTable: formatIndexTable(
              index,
              res?.metadata["x-per-page"],
              res?.metadata["x-page"]
            ),
          };
        })
      );
      setLoading(false);
    });
  }, [
    currentPage,
    numPerPage,
    searchKey,
    startDate,
    endDate,
    status,
    merchantId,
    refresh,
  ]);

  useEffect(() => {
    const newDate = endDate.clone().add(1, "day");
    const params = {
      start_date: startDate.toISOString(),
      end_date: newDate.toISOString(),
      status: status ? Number(status) : "",
    };
    reconciliationService.getInvolvedMerchant(params).then((res) => {
      const options = [{ value: "all", label: "All Merchant" }];
      const merchants = res.map((merchant) => ({
        value: merchant.merchant_id.toString(),
        label: merchant.merchant_name,
      }));
      for (const merchant of merchants) {
        options.push(merchant);
      }
      setMerchantOptions(options);
    });
  }, [startDate, endDate, status, merchantId]);

  const onChangeTable = async (pagination: any) => {
    const { current, pageSize } = pagination;
    if (
      (current && current !== currentPage) ||
      (pageSize && pageSize !== numPerPage)
    ) {
      await Promise.all([setCurrentPage(current), setNumPerPage(pageSize)]);
    }
  };

  const handleChangeStatus = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleChangeMerchant = (value: string) => {
    const arrValue = _.split(value, ",");
    if (arrValue.length === 1) {
      const isAll = arrValue[0] === "all" || arrValue[0] === "";
      if (!isAll) {
        setMerchantId(arrValue.map((item) => Number(item)));
      } else {
        setMerchantId(["all"]);
      }
    }
    if (arrValue.length >= 2) {
      const haveAll = arrValue.find((item: string) => item === "all");
      if (haveAll) {
        const newResult = arrValue.filter((item: string) => item !== "all");
        setMerchantId(newResult.map((item) => Number(item)));
      } else {
        setMerchantId(arrValue.map((item) => Number(item)));
      }
    }
  };

  const dateChange = (values: any, dateStrings: [string, string]) => {
    if (values && values.length >= 2) {
      setStartDate(values[0]);
      setEndDate(values[1]);
    }
  };

  const clickApproveList = () => {
    if (selectedId.length === 0) {
      message.error("No item selected");
      return;
    }

    reconciliationService.approvePayment(selectedId).then((value) => {
      message.success("Approve Success");
      setSelectedRowKeys([]);
      setSelectedId([]);
      setRefresh(refresh + 1);
      setOpenConfirmPopup(false);
    });
  };

  return (
    <div className="product-management-page">
      <TridentityPageHeader title="Settlement report" />

      {/*Search Input*/}
      <CardContent className="transaction-search">
        <div className="transaction-search-form">
          <Row gutter={30}>
            <Col span={10} className={"searchWrapper"}></Col>

            <Col className={"statusFilter"} span={16}>
              <div className={"statusLabel"}>Status</div>
              <Select
                defaultValue=""
                size={"large"}
                style={{ width: 120 }}
                onChange={handleChangeStatus}
                options={[
                  { value: "", label: "All status" },
                  { value: "0", label: "Created" },
                  { value: "2", label: "Processing" },
                  { value: "3", label: "Paid" },
                ]}
              />

              <Select
                showSearch
                mode="multiple"
                defaultValue="all"
                size={"large"}
                style={{ marginLeft: "50px", minWidth: 400 }}
                onChange={handleChangeMerchant}
                options={merchantOptions}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={
                  merchantId.length > 0
                    ? (merchantId.map((item) => String(item)) as any)
                    : "all"
                }
              />
            </Col>

            <Col span={8} className={"dateFilter"}>
              <Space direction="vertical" size={12} className={"datePicker"}>
                <RangePicker
                  size={"large"}
                  format={"DD/MM/YYYY"}
                  onChange={dateChange}
                  defaultValue={[
                    moment(startDate, "YYYY-MM-DD"),
                    moment(endDate, "YYYY-MM-DD"),
                  ]}
                />
              </Space>
            </Col>
          </Row>
        </div>
        <div className={"buttonApproveWrapper"}>
          <Button
            disabled={disableApprove || !doHavePermissionToEdit}
            size={"large"}
            className={`buttonApproveList ${
              disableApprove ? "buttonDisable" : ""
            }`}
            onClick={() => setOpenConfirmPopup(true)}
          >
            Approve
          </Button>
        </div>

        {dataSrc.length ? (
          <SearchTable
            title={() => <div className="title-table"></div>}
            columns={columns}
            current={currentPage}
            dataSource={dataSrc}
            onChange={onChangeTable}
            totalItems={totalItems}
            rowSelection={{ ...rowSelection }}
            loading={loading}
            rowKey={"id"}
            // scroll={{ x: "100vw", y: 500 }}
          />
        ) : (
          <div>No Data</div>
        )}
      </CardContent>

      <ConfirmApprove
        open={openConfirmPopup}
        onClose={() => {
          setOpenConfirmPopup(false);
        }}
        onOk={clickApproveList}
      />
    </div>
  );
};

export default Reconciliation;
