import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, message, Modal, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Bronze, Diamond, Gold, Silver } from "src/assets/icons";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { STATUS_CODE } from "src/constants/status-code";
import { formatLP } from "src/helpers/formatNumber";
import CardContent from "src/routes/components/CardContent";
import { UserServices } from "src/services/user-service";
import { MerchantStatusEnum } from "../merchant";
import "./styles.scss";
import InputSearch from "src/components/07.inputs/InputSearch";
import { addTableIndex } from "src/helpers";
import { PageQueryParams } from "src/services/params-type";
import { format2Digit } from "src/constants";
import { handleDisplayNodata } from "src/helpers/display";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

export enum MembershipEnum {
  Standard,
  Premium,
  Gold,
  Diamond,
}

const ConsumerPage = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["user-management-permission"]
  );
  const [dataSrc, setDataSrc] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<PageQueryParams>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
    email: "",
  });
  const [metadata, setMetadata] = useState<PaginationMetadata>();

  const userService = new UserServices();

  useEffect(() => {
    getListUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleChangeSearch = (e: any) => {
    setParams({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      email: e.target.value,
    });
  };

  const getListUser = async () => {
    if (!params.email) {
      setDataSrc([]);
      setMetadata({
        "x-total-count": 0,
        "x-per-page": 0,
        "x-page": 0,
        "x-next-page": 0,
        "x-pages-count": 0,
      });
      return;
    }
    try {
      setLoading(true);
      const res = await userService.fetchListUser(params);
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        const { data, metadata } = res.data as PaginationData<Customer>;
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

  const columns: ColumnsType<Customer> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "User ID",
      dataIndex: "id",
      render: (_, record, index) => <span>{record.id}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Membership",
      render: (text: string, record: any) => {
        let src;
        const level = Number(record?.membership?.level);
        if (level === MembershipEnum.Standard) {
          src = Bronze;
        } else if (level === MembershipEnum.Premium) {
          src = Silver;
        } else if (level === MembershipEnum.Gold) {
          src = Gold;
        } else {
          src = Diamond;
        }
        return <img src={src} alt="icon" />;
      },
    },

    {
      title: "LP point",
      render: (text, record: any) => {
        return <span>{formatLP(record?.loyalty_point?.total_point || 0)}</span>;
      },
    },
    {
      title: "Total spending",
      dataIndex: "total_spending",
      render: (text) => <span>S$ {format2Digit(text)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 90,
      render: (text, record: any) => {
        const isActive = Number(text) === MerchantStatusEnum.ACTIVE;
        const activeShow = (
          <div className="flex space-beetween center">
            <Avatar style={{ backgroundColor: "#52C41A" }} size={5} />
            <div>Active</div>
          </div>
        );

        const inactiveShow = (
          <div className="flex space-beetween center">
            <Avatar style={{ backgroundColor: "#FF4D4F" }} size={5} />
            <div>Inactive</div>
          </div>
        );

        return (
          <span className="pointer" onClick={() => {}}>
            {isActive ? activeShow : inactiveShow}
          </span>
        );
      },
    },
    {
      title: "Action",
      width: 160,
      render: (text, record: any) => {
        const isActive = Number(record.status) === MerchantStatusEnum.ACTIVE;
        return (
          <Button
            disabled={!doHavePermissionToEdit}
            type="text"
            className={isActive ? "button1" : "button3"}
            onClick={() => confirm(isActive, record.id)}
            loading={loading}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        );
      },
    },
  ];

  const onChangeTable = async (pagination: any) => {
    const { current, pageSize } = pagination;
    setParams({
      ...params,
      page: current,
      perPage: pageSize,
    });
  };

  const confirm = (isActive: boolean, id: number) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure ${
        isActive ? "deactivate" : "activate"
      } this user?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        if (!isActive) {
          handleActivateUser(id);
        } else {
          console.log({ id });
          handleDeactivateUser(id);
        }
      },
    });
  };

  const handleActivateUser = async (userId: number) => {
    try {
      setLoading(true);
      await userService.activateUser(userId);
      await getListUser();
      message.success("The activate user is successfully");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "The activate user is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      setLoading(true);
      await userService.deActivateUser(userId);
      await getListUser();
      message.success("The deactivate user is successfully");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "The deactivate user is fail")
      );
    } finally {
      setLoading(false);
    }
  };
  const EmptyData = useMemo(
    () => handleDisplayNodata(params.email === ""),
    [params]
  );
  return (
    <>
      <TridentityPageHeader title="Consumer" />
      <CardContent className="transaction-search">
        <div className="transaction-search-form">
          <Row gutter={30}>
            <Col span={10}>
              <InputSearch
                searchResultCount={metadata?.["x-total-count"] || 0}
                placeholder="Search Consumer"
                handleChangeSearch={handleChangeSearch}
                debounceTime={800}
              />
            </Col>
            <Col span={10}></Col>
            <Col
              span={4}
              style={{ justifyContent: "flex-end", display: "flex" }}
            ></Col>
          </Row>
        </div>
      </CardContent>
      <CardContent>
        <SearchTable
          locale={{ emptyText: EmptyData }}
          title={() => <div className="title-table">Consumer list</div>}
          columns={columns}
          dataSource={dataSrc}
          onChange={onChangeTable}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
          rowKey={"id"}
          loading={loading}
        />
      </CardContent>
    </>
  );
};

export default ConsumerPage;
