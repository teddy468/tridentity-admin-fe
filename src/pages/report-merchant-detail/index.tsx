import { Avatar, Button, Col, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router";
import SearchTable from "src/components/11.tables/SearchTable";
import { format2Digit, getOrderStatus, ORDER_STATUS } from "src/constants";
import { STATUS_CODE } from "src/constants/status-code";
import CardContent from "src/routes/components/CardContent";
import { FiatParams, OrdersParams } from "src/services/params-type";
import { ReportService } from "src/services/report-service";
import { REVENUE_REPORT } from "../report";
import StackChart from "./Charts/StackChart";
import "./styles.scss";
import TotalInfo from "./TotalInfo";
import { addTableIndex } from "src/helpers";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const styleStatus = (status: number) => {
  if (status === ORDER_STATUS.ON_GOING) {
    return "#1890FF";
  } else if (status === ORDER_STATUS.CANCELLED) {
    return "#FF4D4F";
  } else if (status === ORDER_STATUS.COMPLETED) {
    return "#52C41A";
  } else {
    return "#FAAD14";
  }
};

interface DataType {
  key: React.Key;
  id: ReactNode;
  amount: string;
  date: string;
  vault: ReactNode;
}

const ReportMerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const startWeekDefault = dayjs().startOf("week").utc().format();
  const endWeekDefault = dayjs().endOf("week").utc().format();
  const startMonthDefault = dayjs().startOf("month").utc().format();
  const endMonthDefault = dayjs().endOf("month").utc().format();
  const startYearDefault = dayjs().startOf("year").utc().format();
  const endYearDefault = dayjs().endOf("year").utc().format();
  const [activeRevenue, setActiveRevenue] = useState<REVENUE_REPORT>(
    REVENUE_REPORT.WEEK
  );
  const [dataChart, setDataChart] = useState<any[]>([]);
  const [fiatParams, setFiatParams] = useState<FiatParams>({
    start_date: startWeekDefault,
    end_date: endWeekDefault,
    reportView: "weekly",
  });

  const [dataSrc, setDataSrc] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<OrdersParams>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  });
  const [metadata, setMetadata] = useState<PaginationMetadata>();
  const [general, setGeneral] = useState<{
    total_order: number;
    total_revenue: number;
  }>({
    total_order: 0,
    total_revenue: 0,
  });

  const reportService = new ReportService();

  useEffect(() => {
    if (Number(id) > 0) {
      getListOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, id]);

  useEffect(() => {
    if (Number(id) > 0) {
      getGeneral();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (Number(id) > 0) {
      getFiat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fiatParams, id]);

  const getFiat = async () => {
    try {
      const res = await reportService.fetchFiatMerchant(fiatParams, Number(id));
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDataChart(res.data);
      }
    } catch (error) {}
  };

  const getGeneral = async () => {
    try {
      const res = await reportService.fetchGeneralMerchant(Number(id));
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setGeneral(res.data);
      }
    } catch (error) {}
  };

  const getListOrder = async () => {
    try {
      setLoading(true);
      const res = await reportService.fetchMerchantOrders(
        params as any,
        Number(id)
      );
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        const { data, metadata } = res.data as PaginationData<OrderHistory>;
        const dataTable = addTableIndex(
          data,
          metadata["x-per-page"],
          metadata["x-page"]
        );
        setDataSrc(dataTable);
        setMetadata(metadata);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Order",
      dataIndex: "id",
      render: (_, record: any, index) => <span>{record.id}</span>,
    },
    {
      title: "Buyer ID",
      dataIndex: "user_id",
      render: (text, record: any) => <span>{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "create_time",
      render: (text, record: any) => (
        <span>{moment(text).format("DD/MM/YYYY HH:mm")}</span>
      ),
    },
    {
      title: "Amount",
      render: (text, record: any) => (
        <span>S$ {format2Digit(record?.payment?.amount || 0)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      render: (text, record: any) => {
        return (
          <div className="payment pointer">
            <Avatar style={{ backgroundColor: styleStatus(text) }} size={5} />
            <div>{getOrderStatus(text)}</div>
          </div>
        );
      },
    },
  ];

  const onChangeTable = async (pagination: any) => {
    const { current, pageSize } = pagination;
    setParams({
      page: current,
      perPage: pageSize,
      paginationMetadataStyle: "body",
    });
  };

  return (
    <>
      {/* <TridentityPageHeader title="Report" /> */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <CardContent className="transaction-search">
            <TotalInfo
              title="Total Order"
              amount={`${new BigNumber(general.total_order).toFormat(2)}`}
              percent="4,6%"
              image="/images/bell.svg"
            />
          </CardContent>
        </Col>
        <Col span={12}>
          <CardContent className="transaction-search">
            <TotalInfo
              title="Total sale"
              amount={`S$ ${new BigNumber(general.total_revenue).toFormat(2)}`}
              percent="6%"
              image="/images/dollar.svg"
            />
          </CardContent>
        </Col>
      </Row>
      <Row>
        <CardContent
          className="transaction-search"
          customTitle="Sale report"
          isShowExportBtn={true}
          exportButtonElement={
            <div className="list-button">
              <Button
                type="text"
                onClick={() => {
                  setActiveRevenue(REVENUE_REPORT.WEEK);
                  setFiatParams({
                    start_date: startWeekDefault,
                    end_date: endWeekDefault,
                    reportView: "weekly",
                  });
                }}
                className={`${
                  activeRevenue === REVENUE_REPORT.WEEK && "active"
                } pointer`}
              >
                Week
              </Button>
              <Button
                type="text"
                onClick={() => {
                  setActiveRevenue(REVENUE_REPORT.MONTH);
                  setFiatParams({
                    start_date: startMonthDefault,
                    end_date: endMonthDefault,
                    reportView: "monthly",
                  });
                }}
                className={`${
                  activeRevenue === REVENUE_REPORT.MONTH && "active"
                } pointer`}
              >
                Month
              </Button>
              <Button
                type="text"
                onClick={() => {
                  setActiveRevenue(REVENUE_REPORT.YEAR);
                  setFiatParams({
                    start_date: startYearDefault,
                    end_date: endYearDefault,
                    reportView: "yearly",
                  });
                }}
                className={`${
                  activeRevenue === REVENUE_REPORT.YEAR && "active"
                } pointer`}
              >
                Year
              </Button>
            </div>
          }
        >
          <StackChart dataChart={dataChart} activeKey={activeRevenue} />
        </CardContent>
      </Row>

      <CardContent>
        <SearchTable
          title={() => <div className="title-table">Order list</div>}
          columns={columns}
          dataSource={dataSrc}
          onChange={onChangeTable}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
          bordered
          rowKey={"id"}
          loading={loading}
        />
      </CardContent>
    </>
  );
};

export default ReportMerchantDetailPage;
