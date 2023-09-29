import { Avatar, Col, Divider, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import BigNumber from "bignumber.js";
import _, { get } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { format2Digit, getOrderStatus } from "src/constants";
import { STATUS_CODE } from "src/constants/status-code";
import CardContent from "src/routes/components/CardContent";
import { ReportService } from "src/services/report-service";
import { styleStatus } from "../report";
import "./styles.scss";

const columnsStoreTable: ColumnsType<any> = [
  {
    title: "Order",
    render: (_, record, index) => {
      return (
        <div className="flex">
          <img
            src={get(record, "product.images[0]", "")}
            alt="product-icon"
            className="product-image"
          />
          <div className="left8">{record?.product?.name}</div>
        </div>
      );
    },
  },
  {
    title: "Price",
    dataIndex: "original_price",
    render: (text, record: any) => (
      <span>S$ {format2Digit(get(record, "original_price", 0))}</span>
    ),
  },
  {
    title: "Product quantity",
    dataIndex: "quantity",
    render: (text, record: any) => (
      <span>{new BigNumber(get(record, "quantity", 0)).toFormat()}</span>
    ),
  },
  {
    title: "Total",
    dataIndex: "final_price",
    render: (text, record: any) => (
      <span>S$ {format2Digit(get(record, "final_price", 0))}</span>
    ),
  },
];

const ReportDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [detail, setDetail] = useState<any>({});

  const reportService = new ReportService();

  const products = useMemo(() => {
    return detail?.items || [];
  }, [detail?.items]) as any[];

  const events = useMemo(() => {
    return _.reverse(detail?.histories) || [];
  }, [detail?.histories]) as any[];

  useEffect(() => {
    if (id && Number(id) > 0) {
      getOrderDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getOrderDetail = async () => {
    try {
      const res = await reportService.fetchOrderDetail(id);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDetail(res.data);
      }
    } catch (error) {}
  };

  return (
    <>
      <TridentityPageHeader title="Order report" />
      <CardContent customTitle="">
        <Row className="flex between">
          <div className="small-item gray">Order ID</div>
          <div className="small-item gray">Order Value</div>
        </Row>
        <Row className="flex between">
          <div className="big-item black">{detail?.id}</div>
          <div className="big-item black">
            S$ {format2Digit(detail?.payment?.amount)}
          </div>
        </Row>
        <Row className="flex between top16">
          <div className="">
            <span className="medium-item black">Merchant:</span>
            <span className="small-item black left12">
              {detail?.store?.merchant?.name}
            </span>
          </div>
          <div className="small-item gray">Profit</div>
        </Row>
        <Row className="flex between top16">
          <div className="flex">
            <div className="status flex">
              <span className="medium-item black">Payment status:</span>
              <span className="small-item black left12">
                <Avatar style={{ backgroundColor: "#52C41A" }} size={5} />
                <span className="left12">Complete</span>
              </span>
            </div>
            <div className="status left60">
              <span className="medium-item black">Delivery status:</span>
              <span className="small-item black left12">
                <Avatar
                  style={{ backgroundColor: styleStatus(detail?.status) }}
                  size={5}
                />
                <span className="left12">{getOrderStatus(detail?.status)}</span>
              </span>
            </div>
          </div>
          <div className="big-item black">
            S${" "}
            {format2Digit(
              get(detail, "transactions[0].amount_breakdown.net_amount", 0)
            )}
          </div>
        </Row>
      </CardContent>

      <CardContent customTitle="Product">
        <SearchTable
          rowKey="id"
          columns={columnsStoreTable}
          dataSource={products}
          totalItems={0}
          bordered
        />
      </CardContent>

      <CardContent customTitle="Product">
        <Row className="bottom34 top30 left20">
          <Col span={12} className="medium-item gray">
            Events
          </Col>
          <Col span={12} className="medium-item gray">
            Time
          </Col>
        </Row>
        {events.length > 0 &&
          events.map((e, index) => {
            return (
              <div key={index}>
                <Row className="left20">
                  <Col span={12} className="small-item black">
                    {e?.event_name}
                  </Col>
                  <Col span={12} className="small-item black">
                    {moment(e?.create_time).format("DD/MM/YYYY HH:mm")}
                  </Col>
                </Row>
                <Divider />
              </div>
            );
          })}
      </CardContent>
    </>
  );
};

export default ReportDetailPage;
