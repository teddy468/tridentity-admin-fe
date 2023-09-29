import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import moment from "moment";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { format2Digit, getOrderStatus, ORDER_STATUS } from "src/constants";
import { STATUS_CODE } from "src/constants/status-code";
import CardContent from "src/routes/components/CardContent";
import { FiatParams, OrdersParams } from "src/services/params-type";
import { ReportService } from "src/services/report-service";
import ColumnLineChart from "./Charts/ColumnLineChart";
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

export enum REVENUE_REPORT {
  WEEK,
  MONTH,
  YEAR,
}

export enum USER_REPORT {
  WEEK,
  MONTH,
  YEAR,
}

const ReportPage = () => {
  const history = useHistory();
  const startWeekDefault = dayjs().startOf("week").utc().format();
  const endWeekDefault = dayjs().endOf("week").utc().format();
  const startMonthDefault = dayjs().startOf("month").utc().format();
  const endMonthDefault = dayjs().endOf("month").utc().format();
  const startYearDefault = dayjs().startOf("year").utc().format();
  const endYearDefault = dayjs().endOf("year").utc().format();
  const [startCurrentWeek, setStartCurrentWeek] = useState(startWeekDefault);
  const [endCurrentWeek, setEndCurrentWeek] = useState(endWeekDefault);
  const [startCurrentMonth, setStartCurrentMonth] = useState(startMonthDefault);
  const [endCurrentMonth, setEndCurrentMonth] = useState(endMonthDefault);
  const [startCurrentYear, setStartCurrentYear] = useState(startYearDefault);
  const [endCurrentYear, setEndCurrentYear] = useState(endYearDefault);
  //
  const [startCurrentWeek2, setStartCurrentWeek2] = useState(startWeekDefault);
  const [endCurrentWeek2, setEndCurrentWeek2] = useState(endWeekDefault);
  const [startCurrentMonth2, setStartCurrentMonth2] =
    useState(startMonthDefault);
  const [endCurrentMonth2, setEndCurrentMonth2] = useState(endMonthDefault);
  const [startCurrentYear2, setStartCurrentYear2] = useState(startYearDefault);
  const [endCurrentYear2, setEndCurrentYear2] = useState(endYearDefault);

  const [activeRevenue, setActiveRevenue] = useState<REVENUE_REPORT>(
    REVENUE_REPORT.WEEK
  );
  const [activeUser, setActiveUser] = useState<USER_REPORT>(USER_REPORT.WEEK);
  const [dataChart, setDataChart] = useState<any[]>([]);
  const [dataUserChart, setDataUserChart] = useState<any[]>([]);

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

  const [userGeneral, setUserGeneral] = useState<{
    totalActiveUser: number;
    totalMerchant: number;
  }>({
    totalActiveUser: 0,
    totalMerchant: 0,
  });

  const textDate = useMemo(() => {
    if (activeRevenue === REVENUE_REPORT.WEEK) {
      const monthOfStart = dayjs(startCurrentWeek).startOf("M");
      const monthOfEnd = dayjs(endCurrentWeek).startOf("M");
      let isSame = monthOfStart.isSame(monthOfEnd);
      if (isSame) {
        return dayjs(startCurrentWeek).format("MMM YYYY");
      } else {
        return `${dayjs(startCurrentWeek).format("MMM")} - ${dayjs(
          endCurrentWeek
        ).format("MMM YYYY")}`;
      }
    }
    if (activeRevenue === REVENUE_REPORT.MONTH) {
      return dayjs(startCurrentMonth).format("MMM YYYY");
    }
    return dayjs(startCurrentYear).format("YYYY");
  }, [
    startCurrentWeek,
    endCurrentWeek,
    activeRevenue,
    startCurrentMonth,
    startCurrentYear,
  ]);

  const textDate2 = useMemo(() => {
    if (activeUser === USER_REPORT.WEEK) {
      const monthOfStart = dayjs(startCurrentWeek2).startOf("M");
      const monthOfEnd = dayjs(endCurrentWeek2).startOf("M");
      let isSame = monthOfStart.isSame(monthOfEnd);
      if (isSame) {
        return dayjs(startCurrentWeek2).format("MMM YYYY");
      } else {
        return `${dayjs(startCurrentWeek2).format("MMM")} - ${dayjs(
          endCurrentWeek2
        ).format("MMM YYYY")}`;
      }
    }
    if (activeUser === USER_REPORT.MONTH) {
      return dayjs(startCurrentMonth2).format("MMM YYYY");
    }
    return dayjs(startCurrentYear2).format("YYYY");
  }, [
    startCurrentWeek2,
    endCurrentWeek2,
    activeUser,
    startCurrentMonth2,
    startCurrentYear2,
  ]);

  const reportService = new ReportService();

  useEffect(() => {
    getListOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    getGeneral();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserGeneral();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getFiat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeRevenue,
    startCurrentWeek,
    endCurrentWeek,
    startCurrentMonth,
    endCurrentMonth,
    startCurrentYear,
    endCurrentYear,
  ]);

  useEffect(() => {
    getUserFiat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeUser,
    startCurrentWeek2,
    endCurrentWeek2,
    startCurrentMonth2,
    endCurrentMonth2,
    startCurrentYear2,
    endCurrentYear2,
  ]);

  const getFiat = async () => {
    try {
      let fiatParams = {
        reportView: "weekly",
        start_date: startCurrentWeek,
        end_date: endCurrentWeek,
      };
      if (activeRevenue === REVENUE_REPORT.MONTH) {
        fiatParams = {
          reportView: "monthly",
          start_date: startCurrentMonth,
          end_date: endCurrentMonth,
        };
      }
      if (activeRevenue === REVENUE_REPORT.YEAR) {
        fiatParams = {
          reportView: "yearly",
          start_date: startCurrentYear,
          end_date: endCurrentYear,
        };
      }

      const res = await reportService.fetchFiat(fiatParams as FiatParams);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDataChart(res.data);
      }
    } catch (error) {}
  };

  const getUserFiat = async () => {
    try {
      let userFiatParams = {
        reportView: "weekly",
        start_date: startCurrentWeek2,
        end_date: endCurrentWeek2,
      };
      if (activeUser === USER_REPORT.MONTH) {
        userFiatParams = {
          reportView: "monthly",
          start_date: startCurrentMonth2,
          end_date: endCurrentMonth2,
        };
      }
      if (activeUser === USER_REPORT.YEAR) {
        userFiatParams = {
          reportView: "yearly",
          start_date: startCurrentYear2,
          end_date: endCurrentYear2,
        };
      }
      const res = await reportService.fetchUserFiat(userFiatParams as any);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDataUserChart(res.data);
      }
    } catch (error) {}
  };

  const getGeneral = async () => {
    try {
      const res = await reportService.fetchGeneral();
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setGeneral(res.data);
      }
    } catch (error) {}
  };

  const getUserGeneral = async () => {
    try {
      const res = await reportService.fetchUserGeneral();
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setUserGeneral(res.data);
      }
    } catch (error) {}
  };

  const getListOrder = async () => {
    try {
      setLoading(true);
      const res = await reportService.fetchOrders(params as any);
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

  const goToDetail = (id: number, merchant_id: number) =>
    history.push(`/report/${id}?merchant_id=${merchant_id}`);
  const goToMerchantDetail = (id: number) =>
    history.push(`/report/merchant/${id}`);

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span className="pointer">{text}</span>,
    },
    {
      title: "Order",
      dataIndex: "id",
      render: (_, record: any, index) => (
        <span
          onClick={() => goToDetail(record.id, record?.store?.merchant_id)}
          className="pointer active underline"
        >
          {record.id}
        </span>
      ),
    },
    {
      title: "Buyer ID",
      dataIndex: "user_id",
      render: (text, record: any) => <span>{text}</span>,
    },
    {
      title: "Merchant",
      render: (text: string, record: any) => (
        <span
          onClick={() => goToMerchantDetail(record?.store?.merchant_id)}
          className="pointer active underline"
        >
          {record?.store?.merchant?.name}
        </span>
      ),
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
        <span>S${format2Digit(record?.payment?.amount || 0)}</span>
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

  const handleToday = () => {
    if (activeRevenue === REVENUE_REPORT.WEEK) {
      setStartCurrentWeek(startWeekDefault);
      setEndCurrentWeek(endWeekDefault);
      return;
    }
    if (activeRevenue === REVENUE_REPORT.MONTH) {
      setStartCurrentMonth(startMonthDefault);
      setEndCurrentMonth(endMonthDefault);
      return;
    }
    setStartCurrentYear(startYearDefault);
    setEndCurrentYear(endYearDefault);
  };

  const handleToday2 = () => {
    if (activeUser === USER_REPORT.WEEK) {
      setStartCurrentWeek2(startWeekDefault);
      setEndCurrentWeek2(endWeekDefault);
      return;
    }
    if (activeUser === USER_REPORT.MONTH) {
      setStartCurrentMonth2(startMonthDefault);
      setEndCurrentMonth2(endMonthDefault);
      return;
    }
    setStartCurrentYear2(startYearDefault);
    setEndCurrentYear2(endYearDefault);
  };

  const handlePrev = () => {
    console.log("Prev", activeRevenue);
    if (activeRevenue === REVENUE_REPORT.WEEK) {
      const aWeekAgo = dayjs(startCurrentWeek).subtract(7, "days");
      setStartCurrentWeek(aWeekAgo.utc().format());
      setEndCurrentWeek(
        dayjs(startCurrentWeek).subtract(1, "m").utc().format()
      );
      return;
    }
    if (activeRevenue === REVENUE_REPORT.MONTH) {
      const aMonthAgo = dayjs(startCurrentMonth).subtract(1, "M");
      setStartCurrentMonth(aMonthAgo.utc().format());
      setEndCurrentMonth(aMonthAgo.endOf("M").utc().format());
      return;
    }
    const aYearAgo = dayjs(startCurrentYear).subtract(1, "y");
    setStartCurrentYear(aYearAgo.utc().format());
    setEndCurrentYear(aYearAgo.endOf("y").utc().format());
  };

  const handlePrev2 = () => {
    console.log("Prev", activeUser);
    if (activeUser === USER_REPORT.WEEK) {
      const aWeekAgo = dayjs(startCurrentWeek2).subtract(7, "days");
      setStartCurrentWeek2(aWeekAgo.utc().format());
      setEndCurrentWeek2(
        dayjs(startCurrentWeek2).subtract(1, "m").utc().format()
      );
      return;
    }
    if (activeUser === USER_REPORT.MONTH) {
      const aMonthAgo = dayjs(startCurrentMonth2).subtract(1, "M");
      setStartCurrentMonth2(aMonthAgo.utc().format());
      setEndCurrentMonth2(aMonthAgo.endOf("M").utc().format());
      return;
    }
    const aYearAgo = dayjs(startCurrentYear2).subtract(1, "y");
    setStartCurrentYear2(aYearAgo.utc().format());
    setEndCurrentYear2(aYearAgo.endOf("y").utc().format());
  };

  const handleNext = () => {
    console.log("Next", activeRevenue);
    if (activeRevenue === REVENUE_REPORT.WEEK) {
      const nextWeek = dayjs(endCurrentWeek).add(7, "days");
      setStartCurrentWeek(dayjs(endCurrentWeek).add(1, "m").utc().format());
      setEndCurrentWeek(nextWeek.utc().format());
      return;
    }
    if (activeRevenue === REVENUE_REPORT.MONTH) {
      const nextMonth = dayjs(startCurrentMonth).add(1, "M");
      setEndCurrentMonth(nextMonth.endOf("M").utc().format());
      setStartCurrentMonth(nextMonth.utc().format());
      return;
    }
    const nextYear = dayjs(startCurrentYear).add(1, "y");
    setStartCurrentYear(nextYear.utc().format());
    setEndCurrentYear(nextYear.endOf("y").utc().format());
  };

  const handleNext2 = () => {
    console.log("Next", activeUser);
    if (activeUser === USER_REPORT.WEEK) {
      const nextWeek = dayjs(endCurrentWeek2).add(7, "days");
      setStartCurrentWeek2(dayjs(endCurrentWeek2).add(1, "m").utc().format());
      setEndCurrentWeek2(nextWeek.utc().format());
      return;
    }
    if (activeUser === USER_REPORT.MONTH) {
      const nextMonth = dayjs(startCurrentMonth2).add(1, "M");
      setEndCurrentMonth2(nextMonth.endOf("M").utc().format());
      setStartCurrentMonth2(nextMonth.utc().format());
      return;
    }
    const nextYear = dayjs(startCurrentYear2).add(1, "y");
    setStartCurrentYear2(nextYear.utc().format());
    setEndCurrentYear2(nextYear.endOf("y").utc().format());
  };

  return (
    <>
      <TridentityPageHeader title="Report" />
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <CardContent className="transaction-search">
            <TotalInfo
              title="Total Order"
              amount={`${new BigNumber(general.total_order).toFormat()}`}
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

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <CardContent className="transaction-search">
            <TotalInfo
              title="Total user"
              amount={`${new BigNumber(
                userGeneral.totalActiveUser
              ).toFormat()}`}
              percent="4,6%"
              image="/images/user.svg"
            />
          </CardContent>
        </Col>
        <Col span={12}>
          <CardContent className="transaction-search">
            <TotalInfo
              title="Total merchant"
              amount={`${new BigNumber(userGeneral.totalMerchant).toFormat()}`}
              percent="6%"
              image="/images/marketplace.svg"
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
            <>
              <div className="flex center">
                <Button onClick={handleToday}>Today</Button>
                <div className="listAction">
                  <LeftOutlined
                    onClick={handlePrev}
                    style={{ marginRight: 10 }}
                  />
                  <RightOutlined onClick={handleNext} />
                </div>
                <div className="textDate">{textDate}</div>
              </div>
              <div className="list-button">
                <Button
                  type="text"
                  onClick={() => {
                    setActiveRevenue(REVENUE_REPORT.WEEK);
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
                  }}
                  className={`${
                    activeRevenue === REVENUE_REPORT.YEAR && "active"
                  } pointer`}
                >
                  Year
                </Button>
              </div>
            </>
          }
        >
          <StackChart dataChart={dataChart} activeKey={activeRevenue} />
        </CardContent>
      </Row>
      <Row>
        <CardContent
          className="transaction-search"
          customTitle="New user report"
          isShowExportBtn={true}
          exportButtonElement={
            <>
              <div className="flex center">
                <Button onClick={handleToday2}>Today</Button>
                <div className="listAction">
                  <LeftOutlined
                    onClick={handlePrev2}
                    style={{ marginRight: 10 }}
                  />
                  <RightOutlined onClick={handleNext2} />
                </div>
                <div className="textDate">{textDate2}</div>
              </div>
              <div className="list-button">
                <Button
                  type="text"
                  onClick={() => {
                    setActiveUser(USER_REPORT.WEEK);
                  }}
                  className={`${
                    activeUser === USER_REPORT.WEEK && "active"
                  } pointer`}
                >
                  Week
                </Button>
                <Button
                  type="text"
                  onClick={() => {
                    setActiveUser(USER_REPORT.MONTH);
                  }}
                  className={`${
                    activeUser === USER_REPORT.MONTH && "active"
                  } pointer`}
                >
                  Month
                </Button>
                <Button
                  type="text"
                  onClick={() => {
                    setActiveUser(USER_REPORT.YEAR);
                  }}
                  className={`${
                    activeUser === USER_REPORT.YEAR && "active"
                  } pointer`}
                >
                  Year
                </Button>
              </div>
            </>
          }
        >
          <ColumnLineChart dataChart={dataUserChart} activeKey={activeUser} />
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

export default ReportPage;
