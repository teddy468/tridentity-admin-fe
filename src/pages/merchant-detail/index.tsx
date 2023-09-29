import { FileOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import _, { last } from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { STATUS_CODE } from "src/constants/status-code";
import { formatPhoneNumber } from "src/helpers/formatNumber";
import CardContent from "src/routes/components/CardContent";
import { UserServices } from "src/services/user-service";
import "./styles.scss";

// const columns: ColumnsType<DataType> = [
//   {
//     title: "Transaction Type",
//     dataIndex: "tx_type",
//     width: "45%",
//     render: (text) => <span>{text}</span>,
//   },

//   {
//     title: "Order ID",
//     dataIndex: "order_id",
//     render: (text) => <span>{text}</span>,
//     // sorter: (a: any, b: any) => a.currentInvestment - b.currentInvestment,
//   },
//   {
//     title: "Store",
//     dataIndex: "store",
//     render: (text) => <span>{text}</span>,
//     // sorter: (a: any, b: any) => a.currentInvestment - b.currentInvestment,
//   },
//   {
//     title: "Amount",
//     dataIndex: "amount",
//     render: (text) => <span>{text}</span>,
//     // sorter: (a: any, b: any) => a.currentInvestment - b.currentInvestment,
//   },
//   {
//     title: "Date",
//     dataIndex: "date",
//     render: (text) => <span>{text}</span>,
//     // sorter: (a: any, b: any) => a.currentInvestment - b.currentInvestment,
//   },
// ];

const columnsStoreTable: ColumnsType<any> = [
  {
    title: "Store ID",
    dataIndex: "id",
    render: (_, record, index) => <span>{record.id}</span>,
  },
  {
    title: "Store name",
    dataIndex: "name",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Product quantity",
    dataIndex: "product_quantity",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Order",
    dataIndex: "order_quantity",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Review",
    dataIndex: "review",
    width: "45%",
    render: (text, record: any) => (
      <span>{record?.reviews || record?.reviews?.length || 0}</span>
    ),
  },
  {
    title: "Badge",
    dataIndex: "badge_quantity",
    render: (text) => <span>{text}</span>,
  },
];

const MerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [storeList, setStoreList] = useState([]);

  const [metadata, setMetadata] = useState();

  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  });

  const [detail, setDetail] = useState({
    company_name: "",
    phone: "",
    documents: [],
    email: "",
    categories: [],
  });

  const userService = new UserServices();

  useEffect(() => {
    if (id && Number(id) > 0) {
      getMerchantDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id && Number(id) > 0) {
      getStores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, params]);

  const getMerchantDetail = async () => {
    try {
      const res = await userService.fetchMerchantDetail(id);
      if (res.data?.merchant_onboard && res.status === STATUS_CODE.SUCCESS) {
        setDetail(res.data?.merchant_onboard);
      }
    } catch (error) {}
  };

  const getStores = async () => {
    try {
      const res = await userService.fetchStoreByMerchant(id, params);
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        setStoreList(res.data?.data);
      }
      if (res.data.metadata && res.status === STATUS_CODE.SUCCESS) {
        setMetadata(res.data.metadata);
      }
    } catch (error) {}
  };

  const onChangeTable = async (pagination: any) => {
    const { current, pageSize } = pagination;
    setParams({
      page: current,
      perPage: pageSize,
      paginationMetadataStyle: "body",
    });
  };

  const list = detail?.categories?.map((item: any) => item.name);

  return (
    <>
      <TridentityPageHeader title="Merchant detail" />
      <CardContent customTitle="Basic information">
        <Row>
          <Col span={8}>
            <Row className="a-item">
              <div className="field-name">Company name:</div>
              <div className="field-content">{detail?.company_name}</div>
            </Row>
            <Row className="a-item">
              <div className="field-name">Phone number:</div>
              <div className="field-content">{formatPhoneNumber( detail?.phone)}</div>
            </Row>
            <Row className="a-item b-item">
              <div className="field-name">Business document</div>
              {detail.documents.length > 0 &&
                detail.documents.map((item: string, index: number) => {
                  return (
                    <a
                      className="a-item c-item"
                      key={index}
                      href={item}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FileOutlined className="color-blue" />
                      <div className="field-content color-blue">
                        {last(item.split("/"))}
                      </div>
                    </a>
                  );
                })}
            </Row>
          </Col>
          <Col span={16}>
            <Row className="a-item">
              <div className="field-name">Email address:</div>
              <div className="field-content">{detail.email}</div>
            </Row>
            <Row className="a-item">
              <div className="field-name" style={{ marginRight: 12 }}>
                Category:
              </div>
              {list.length > 0 && _.join(list, `, `)}
            </Row>
          </Col>
        </Row>
      </CardContent>
      {/* <CardContent customTitle="LP balance:  30,345 LP">
        <SearchTable
          title={() => (
            <div className="title-table">Loyalty point transaction</div>
          )}
          rowKey="id"
          columns={columns}
          dataSource={vaultPerformanceData}
        />
      </CardContent> */}
      <CardContent customTitle="Store list">
        <SearchTable
          rowKey="id"
          columns={columnsStoreTable}
          dataSource={storeList}
          onChange={onChangeTable}
          // rowSelection={rowSelection}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
        />
      </CardContent>
    </>
  );
};

export default MerchantDetailPage;
