import { Button, Col, message, Row, Select } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatLP } from "src/helpers/formatNumber";
import TridentityPageHeader from "../../../components/02.page-header";
import SearchTable from "../../../components/11.tables/SearchTable";
import { format2Digit, getOrderStatus } from "../../../constants";
import CardContent from "../../../routes/components/CardContent";
import { reconciliationService } from "../../../services/reconciliation";
import ConfirmApprove from "../ConfirmApprove";
import {
  getStatusClass,
  getStatusMessageFiat,
  SettlementStatus,
} from "../SettlementReportByStore";
import "../styles.scss";
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
  total: number;
  totalOrder: number;
  platformFee: number;
  lpEarned: number;
  profit: number;
  status: { status: number };
}

interface DataTypeOrder {
  key: React.Key;
  no: number;
  orderId: number;
  storeId: number;
  storeName: string;
  store: string;
  platformFee: number;
  lpEarned: number;
  profit: number;
  date: string;
  compDate: string;
  status: string;
}

const ReconciliationDetail = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["settlement-report-permission"]
  );
  const { id } = useParams<{ id: string }>();
  const [storeId, setStoreId] = useState<string>("");
  const [dataSrc, setDataSrc] = useState<DataType[]>([]);
  const [dataSrcOrder, setDataSrcOrder] = useState<DataTypeOrder[]>([]);
  const [storeOptions, setStoreOptions] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [numPerPage, setNumPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(2);
  const [loading, setLoading] = useState(false);
  const [disableApprove, setDisableApprove] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);

  const columns: ColumnsType<DataType> = [
    {
      title: "Total Orders",
      dataIndex: "totalOrder",
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (text, record) => <span>S$ {format2Digit(text)}</span>,
    },
    {
      title: "Settlement D&T",
      dataIndex: "date",
      key: "id",
      render: (text: string, record) => <span>{text}</span>,
    },
    {
      title: "Actual Settlement D&T",
      dataIndex: "actual_transaction_date",
      render: (text: string, record) => <span>{text}</span>,
    },
    {
      title: "Platform fee",
      dataIndex: "platformFee",
      render: (text, record) => <span>S$ {format2Digit(text)}</span>,
    },
    {
      title: "LP earned",
      dataIndex: "lpEarned",
      render: (text, record) => <span>{formatLP(text)}</span>,
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
          <div>
            <span className={getStatusClass(record.status.status)}>
              {getStatusMessageFiat(record.status.status)}
            </span>
            <br />
          </div>
        );
      },
    },
  ];

  const columnsOrders: ColumnsType<DataTypeOrder> = [
    {
      title: "No",
      dataIndex: "no",
      width: 60,
      render: (_, record) => {
        return <div>{record.no}</div>;
      },
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Transaction D&T",
      dataIndex: "date",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Comp. D&T",
      dataIndex: "compDate",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Store name",
      dataIndex: "storeName",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Store ID",
      dataIndex: "storeId",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    // {
    //     title: "Total",
    //     dataIndex: "total",
    //     render: (text, record) => {
    //       return <div>S$ {format2Digit(text)}</div>;
    //     },
    //   },
    {
      title: "Platform fee",
      dataIndex: "platformFee",
      render: (text, record) => {
        return <div>S$ {format2Digit(text)}</div>;
      },
    },
    {
      title: "LP Earned",
      dataIndex: "lpEarned",
      render: (text, record) => {
        return <div>{formatLP(text)}</div>;
      },
    },
    {
      title: "Settlement amount",
      dataIndex: "profit",
      render: (text, record) => {
        return <div>S$ {format2Digit(text)}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div>
            <b>{text}</b>
          </div>
        );
      },
    },
  ];

  const [tableTitle, setTableTitle] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    reconciliationService
      .getSettlementsDetail(id ? Number(id) : -1)
      .then((product) => {
        const data: DataType = {
          key: product.id.toString(),
          date: moment(product.create_time).format("DD/MM/yyyy"),
          last_transaction_date: product.last_transaction_date
            ? moment(product.last_transaction_date).format("DD/MM/yyyy HH:mm")
            : "",
          actual_transaction_date: product.actual_transaction_date
            ? moment(product.actual_transaction_date).format("DD/MM/yyyy HH:mm")
            : "",
          id: product.id,
          status: { status: product.status },
          lpEarned: product.amount_breakdown.LP_AMOUNT,
          platformFee: product.amount_breakdown.PLATFORM_FEE,
          profit: product.amount_breakdown.NET_AMOUNT,
          totalOrder: product.amount_breakdown.TOTAL_ORDER,
          total: product.amount_breakdown.ITEM_AMOUNT,
          merchantId: product.merchant.id,
          merchantName: product.merchant.name,
        };
        setTableTitle(data.date + " - Merchant " + data.merchantName);
        setDataSrc([data]);
        setDisableApprove(data.status.status !== SettlementStatus.CREATED);
        setLoading(false);

        reconciliationService
          .getInvolveStores(id ? Number(id) : -1)
          .then((res) => {
            const options = [{ value: "", label: "All Store" }];
            const stores = res.map((store) => ({
              value: store.store_id.toString(),
              label: store.store_id.toString(),
            }));
            for (const store of stores) {
              options.push(store);
            }
            setStoreOptions(options);
          });
      });
  }, [refresh, id]);

  useEffect(() => {
    const params = {
      settlement_id: id,
      page: currentPage,
      perPage: numPerPage,
      merchant_store_id: storeId ? Number(storeId) : "",
      paginationMetadataStyle: "body",
    };
    reconciliationService.getSettlementOrder(params).then((orders) => {
      const orderData: DataTypeOrder[] = orders?.data.map((product, index) => {
        const tran =
          product.transactions.length > 0 ? product.transactions[0] : undefined;
        const his =
          product.histories.length > 0 ? product.histories[0] : undefined;
        return {
          key: product.id.toString(),
          no: index + 1,
          id: product.id,
          orderId: product.id,
          storeId: product.merchant_store_id,
          storeName: product.store.name,
          store: product.store.name,
          //   total : tran ? tran.amount_breakdown.item_amount : 0,
          lpEarned: tran ? tran.amount_breakdown.used_loyalty_point : 0,
          platformFee: tran ? tran.amount_breakdown.platform_fee : 0,
          profit: tran ? tran.amount_breakdown.net_amount : 0,
          date: moment(product.create_time).format("DD/MM/yyyy HH:mm"),
          compDate: his
            ? moment(his.create_time).format("DD/MM/yyyy HH:mm")
            : "",
          status: getOrderStatus(product.status),
        };
      });
      setDataSrcOrder(orderData);
      setTotalItems(orders?.metadata["x-total-count"]);
    });
  }, [currentPage, numPerPage, storeId, id]);

  const onChangeTable = async (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    const { current, pageSize } = pagination;
    if (
      (current && current !== currentPage) ||
      (pageSize && pageSize !== numPerPage)
    ) {
      await Promise.all([setCurrentPage(current), setNumPerPage(pageSize)]);
    }
  };

  const exportOrder = () => {
    reconciliationService.exportOrder(id ? Number(id) : -1, storeId).then();
  };

  const approvePayment = () => {
    reconciliationService
      .approvePayment([id ? Number(id) : -1])
      .then((value) => {
        message.success("Approve Success");
        setRefresh(refresh + 1);
        setOpenConfirmPopup(false);
      });
  };

  const handleChangeStore = (value: string) => {
    setStoreId(value ? value : "");
  };

  return (
    <div className="product-management-page">
      <TridentityPageHeader title="Settlement report" backIcon={true} />

      {/*Search Input*/}
      <CardContent>
        <div className="transaction-search-form">
          <Row gutter={30}>
            <Col span={10} className={"searchWrapper"}>
              <div className="title-table">{tableTitle}</div>
            </Col>

            <Col className={"statusFilter"} span={6}></Col>

            <Col span={8} className={"buttonWrapper"}>
              <div className={"buttonContent"}>
                <Button type={"primary"} size={"large"} onClick={exportOrder}>
                  Export CSV
                </Button>
                <Button
                  size={"large"}
                  type="primary"
                  className={"buttonApprove"}
                  onClick={() => setOpenConfirmPopup(true)}
                  disabled={disableApprove || !doHavePermissionToEdit}
                >
                  Approve
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {dataSrc.length ? (
          <SearchTable
            pagination={false}
            columns={columns}
            dataSource={dataSrc}
            totalItems={0}
            rowKey={"id"}
            loading={loading}
          />
        ) : (
          <div>No Data</div>
        )}

        <div className={"filterReconciliation"}>
          <div className={"left"}>
            <p>Fillter by Store ID</p>
            <Select
              size={"large"}
              defaultValue=""
              className="select-reconciliation"
              style={{ width: 120 }}
              onChange={handleChangeStore}
              options={storeOptions}
            />
          </div>
        </div>

        {dataSrcOrder.length ? (
          <SearchTable
            style={{ marginTop: "20px" }}
            columns={columnsOrders}
            dataSource={dataSrcOrder}
            totalItems={totalItems}
            current={currentPage}
            onChange={onChangeTable}
            rowKey={"id"}
            loading={loading}
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
        onOk={approvePayment}
      />
    </div>
  );
};

export default ReconciliationDetail;
