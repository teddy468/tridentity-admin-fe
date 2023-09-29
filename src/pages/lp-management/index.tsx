//eslint-disable jsx-a11y/anchor-is-valid
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Button, message, Modal, Tabs, TabsProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { get } from "lodash";
import { useEffect, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { STATUS_CODE } from "src/constants/status-code";
import { formatLP } from "src/helpers/formatNumber";
import CardContent from "src/routes/components/CardContent";
import { UserServices } from "src/services/user-service";
import "./styles.scss";
import { addTableIndex } from "src/helpers";
import { format2Digit } from "src/constants";
import { ReduxStore } from "src/types/globalStore";
import { useSelector } from "react-redux";

export enum LPCashoutRequestStatus {
  CREATED = 0,
  APPROVED = 1,
  REJECTED = 2,
  RECEIVED = 3,
  CANCELLED = 4,
}

enum LpCashOutEnum {
  CASH_OUT_REQUEST,
  LP_BUYING_REQUEST,
}

export enum MerchantStatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
}

const LpManagementPage = () => {
  const doHavePermissionToEdit = useSelector(
    (item: ReduxStore) => item.user["lp-management-permission"]
  );
  const [paramsBuyMoreLp, setParamBuyMoreLp] = useState<any>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  });

  const [paramsLpCashOut, setParamsCashOut] = useState<any>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  });

  const [buyMoreRequests, setBuyMoreRequests] = useState<
    MerchantBuyMoreLpRequest[]
  >([]);
  const [metadataBuyMore, setMetadataBuyMore] = useState();
  const [cashOutRequests, setCashOutRequests] = useState<
    MerchantRequestCashOut[]
  >([]);
  const [metadataCashOut, setMetadataCashOut] = useState();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(
    LpCashOutEnum.CASH_OUT_REQUEST.toString()
  );

  const userService = new UserServices();

  useEffect(() => {
    getBuyMoreLp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsBuyMoreLp]);

  useEffect(() => {
    getLpCashOutRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsLpCashOut]);

  const getLpCashOutRequest = async () => {
    try {
      setLoading(true);
      const res = await userService.fetchLpCashOut(paramsLpCashOut);
      if (
        res.data.items &&
        res.status === STATUS_CODE.SUCCESS &&
        res.data.headers
      ) {
        const data = res.data.items as MerchantRequestCashOut[];
        const tableData = addTableIndex(
          data,
          res.data.headers["x-per-page"],
          res.data.headers["x-page"]
        );
        setCashOutRequests(tableData);
        setMetadataCashOut(res.data.headers);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getBuyMoreLp = async () => {
    try {
      setLoading(true);
      const res = await userService.fetchLpBuyMore(paramsBuyMoreLp);
      if (
        res.data.items &&
        res.status === STATUS_CODE.SUCCESS &&
        res.data.headers
      ) {
        const data = res.data.items as MerchantBuyMoreLpRequest[];
        const tableData = addTableIndex(
          data,
          res.data.headers["x-per-page"],
          res.data.headers["x-page"]
        );
        setBuyMoreRequests(tableData);
        setMetadataBuyMore(res.data.headers);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const confirmApproveOrReject = (
    isApprove: boolean,
    requestId: number,
    isBuyMore = false
  ) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure ${isApprove ? "approve" : "reject"} this request?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        if (!isBuyMore) {
          if (isApprove) {
            handeApproveRequest(requestId, isBuyMore);
          } else {
            handeRejectRequest(requestId, isBuyMore);
          }
        } else {
          if (isApprove) {
            handeApproveRequest(requestId, isBuyMore);
          } else {
            handeRejectRequest(requestId, isBuyMore);
          }
        }
      },
    });
  };

  const handeRejectRequest = async (requestId: number, isBuyMore = false) => {
    try {
      setLoading(true);
      if (isBuyMore) {
        await userService.buyMoreAction(requestId, "reject");
        refreshBuyMore();
      } else {
        await userService.cashOutAction(requestId, "reject");
        refreshMerchant();
      }
      message.success(
        `${isBuyMore ? "Buy LP request" : "Cashout request"} has been rejected`
      );
    } catch (error) {
      console.log({ error });
      message.error(
        get(error, "response.data.error.message", "This request is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const handeApproveRequest = async (requestId: number, isBuyMore: boolean) => {
    try {
      setLoading(true);
      if (isBuyMore) {
        await userService.buyMoreAction(requestId, "approve");
        refreshBuyMore();
      } else {
        await userService.cashOutAction(requestId, "approve");
        refreshMerchant();
      }
      message.success(
        `${isBuyMore ? "Buy LP request" : "Cashout request"} has been approved`
      );
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "This request is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshMerchant = () => {
    setActiveTab(LpCashOutEnum.CASH_OUT_REQUEST.toString());
    setParamsCashOut({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
    });
  };

  const refreshBuyMore = () => {
    setActiveTab(LpCashOutEnum.LP_BUYING_REQUEST.toString());
    setParamBuyMoreLp({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
    });
  };

  const columnsBuyMore: ColumnsType<any> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Merchant ID",
      dataIndex: "id",
      render: (text: string, record: any) => (
        <span>{record?.merchant?.id}</span>
      ),
    },
    {
      title: "Merchant name",
      key: "name",
      render: (text: string, record: any) => (
        <span>{record?.merchant?.name}</span>
      ),
    },
    {
      title: "LP Requested",
      dataIndex: "lp_amount",
      render: (text: string) => <span>{formatLP(text)}</span>,
    },
    {
      title: "Payment",
      dataIndex: "payment_amount",
      render: (text: string) => <span>S$ {format2Digit(text)}</span>,
    },
    {
      title: "Request D&T",
      dataIndex: "request_date",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Payment D&T",
      dataIndex: "paid_date",
      render: (text: string) =>
        dayjs(text).isValid() && dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: number) => {
        if (text === LPCashoutRequestStatus.CREATED) {
          return <span>Created</span>;
        } else if (text === LPCashoutRequestStatus.APPROVED) {
          return (
            <span style={{ color: "rgba(247, 144, 9, 1)" }}>Processing</span>
          );
        } else if (text === LPCashoutRequestStatus.REJECTED) {
          return (
            <span style={{ color: "rgba(242, 90, 90, 1)" }}>Rejected</span>
          );
        } else {
          return <span style={{ color: "rgba(18, 183, 106, 1)" }}>Paid</span>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      width: 160,
      align: "center",
      render: (text, record: any) => {
        const isClick = text === LPCashoutRequestStatus.CREATED;
        return (
          <>
            {text === LPCashoutRequestStatus.APPROVED && (
              <CheckCircleOutlined
                style={{ color: "green", fontSize: 30, cursor: "not-allowed" }}
              />
            )}
            {text === LPCashoutRequestStatus.REJECTED && (
              <CloseCircleOutlined
                style={{ color: "red", fontSize: 30, cursor: "not-allowed" }}
              />
            )}
            {isClick && (
              <div className="flex center pointer">
                <Button
                  disabled={!doHavePermissionToEdit}
                  className="antd-btn-nostyles"
                  onClick={() => confirmApproveOrReject(true, record?.id, true)}
                >
                  <CheckCircleOutlined
                    style={{ color: "green", fontSize: 30 }}
                  />
                </Button>

                <Button
                  disabled={!doHavePermissionToEdit}
                  className="antd-btn-nostyles"
                  onClick={() =>
                    confirmApproveOrReject(false, record?.id, true)
                  }
                >
                  <CloseCircleOutlined style={{ color: "red", fontSize: 30 }} />
                </Button>
              </div>
            )}
          </>
        );
      },
    },
  ];

  const columnsLpCashOut: ColumnsType<any> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Merchant ID",
      dataIndex: "id",
      render: (text: string, record: any) => (
        <span>{record?.merchant?.id}</span>
      ),
    },
    {
      title: "Merchant name",
      key: "name",
      render: (text: string, record: any) => (
        <span>{record?.merchant?.name}</span>
      ),
    },
    {
      title: "LP amount",
      dataIndex: "lp_amount",
      render: (text: string) => <span>{formatLP(text)}</span>,
    },
    {
      title: "Cashout Amount",
      dataIndex: "cashout_amount",
      render: (text: string) => <span>S$ {format2Digit(text)}</span>,
    },
    {
      title: "Request D&T",
      dataIndex: "request_date",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Payment D&T",
      dataIndex: "paid_date",
      render: (text: string) =>
        dayjs(text).isValid() && dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: number) => {
        if (text === LPCashoutRequestStatus.CREATED) {
          return <span>Created</span>;
        } else if (text === LPCashoutRequestStatus.APPROVED) {
          return (
            <span style={{ color: "rgba(247, 144, 9, 1)" }}>Processing</span>
          );
        } else if (text === LPCashoutRequestStatus.REJECTED) {
          return (
            <span style={{ color: "rgba(242, 90, 90, 1)" }}>Rejected</span>
          );
        } else {
          return <span style={{ color: "rgba(18, 183, 106, 1)" }}>Paid</span>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      width: 160,
      align: "center",
      render: (text, record: any) => {
        const isClick = text === LPCashoutRequestStatus.CREATED;
        return (
          <>
            {text === LPCashoutRequestStatus.APPROVED && (
              <CheckCircleOutlined
                style={{ color: "green", fontSize: 30, cursor: "not-allowed" }}
              />
            )}
            {text === LPCashoutRequestStatus.REJECTED && (
              <CloseCircleOutlined
                style={{ color: "red", fontSize: 30, cursor: "not-allowed" }}
              />
            )}
            {isClick && (
              <div className="flex center pointer">
                <Button
                  className="antd-btn-nostyles"
                  onClick={() => confirmApproveOrReject(true, record?.id)}
                  disabled={!doHavePermissionToEdit}
                >
                  <CheckCircleOutlined
                    style={{ color: "green", fontSize: 30 }}
                  />
                </Button>

                <Button
                  className="antd-btn-nostyles"
                  onClick={() => confirmApproveOrReject(false, record?.id)}
                >
                  <CloseCircleOutlined style={{ color: "red", fontSize: 30 }} />
                </Button>
              </div>
            )}
          </>
        );
      },
    },
  ];

  const onChangeTable = async (pagination: any) => {
    const { current, pageSize } = pagination;

    if (activeTab === LpCashOutEnum.LP_BUYING_REQUEST.toString()) {
      const newParams = {
        ...paramsBuyMoreLp,
        page: current,
        perPage: pageSize,
      };
      setParamBuyMoreLp(newParams);
    } else {
      const newParams = {
        ...paramsLpCashOut,
        page: current,
        perPage: pageSize,
      };
      setParamsCashOut(newParams);
    }
  };

  const itemsTab: TabsProps["items"] = [
    {
      key: LpCashOutEnum.CASH_OUT_REQUEST.toString(),
      label: `Cash out Request`,
      children: (
        <SearchTable
          title={() => (
            <div className="title-table">Merchant LP Cashout Request</div>
          )}
          columns={columnsLpCashOut}
          dataSource={cashOutRequests}
          onChange={onChangeTable}
          totalItems={metadataCashOut?.["x-total-count"] || 0}
          current={metadataCashOut?.["x-page"]}
          rowKey={"id"}
          loading={loading}
        />
      ),
    },
    {
      key: LpCashOutEnum.LP_BUYING_REQUEST.toString(),
      label: (
        <div className="flex">
          <div className="margin-right-10">Buy LP Request</div>
          <Avatar style={{ backgroundColor: "#FF4D4F" }} size={16}>
            {metadataBuyMore?.["x-total-count"] || 0}
          </Avatar>
        </div>
      ),
      children: (
        <SearchTable
          title={() => <div className="title-table">Buy LP Request list</div>}
          columns={columnsBuyMore}
          dataSource={buyMoreRequests}
          onChange={onChangeTable}
          totalItems={metadataBuyMore?.["x-total-count"] || 0}
          current={metadataBuyMore?.["x-page"]}
          rowKey={"id"}
          loading={loading}
        />
      ),
    },
  ];

  console.log({ buyMoreRequests });

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div>
      <TridentityPageHeader title="Merchant LP Cashout Request" />
      <CardContent>
        <Tabs
          defaultActiveKey={LpCashOutEnum.CASH_OUT_REQUEST.toString()}
          activeKey={activeTab}
          items={itemsTab}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};

export default LpManagementPage;
