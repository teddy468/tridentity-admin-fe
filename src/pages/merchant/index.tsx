//eslint-disable jsx-a11y/anchor-is-valid
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Empty,
  Input,
  MenuProps,
  message,
  Modal,
  Row,
  Tabs,
  TabsProps,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import _, { get, set } from "lodash";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { Bronze, Diamond, Gold, Silver } from "src/assets/icons";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { STATUS_CODE } from "src/constants/status-code";
import { formatIndexTable, formatPhoneNumber } from "src/helpers/formatNumber";
import CardContent from "src/routes/components/CardContent";
import { UserServices } from "src/services/user-service";
import { PageQueryParams } from "../../services/params-type";
import { MembershipEnum } from "../consumer";
import "./styles.scss";

import InputSearch from "src/components/07.inputs/InputSearch";
import { addTableIndex } from "src/helpers";
import { handleDisplayNodata } from "src/helpers/display";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";
import ModalDetailMerchantInformationForApproval from "src/components/05.modal/components/ModalDetailMerchantInformationForApproval/ModalDetailMerchantInformationForApproval";

interface DataType {
  key: React.Key;
  id: ReactNode;
  amount: string;
  date: string;
  vault: ReactNode;
}

enum MerchantEnum {
  MERCHANT,
  ONBOARDING,
  UPDATE_REQUEST,
  UPDATE_INFO_REQUEST,
}

export enum MerchantStatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
}

const MerchantPage = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["user-management-permission"]
  );

  const history = useHistory();
  const [paramsMerchantOnboarding, setParamMerchantOnboarding] =
    useState<PageQueryParams>({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      company_name: "",
    });

  const [paramsMerchant, setParamsMerchant] = useState<PageQueryParams>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
    name: "",
  });

  const [paramsUpgradeRequest, setParamsUpgradeRequest] =
    useState<PageQueryParams>({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
    });

  const [onboardingRequests, setOnboardingRequests] = useState<
    MerchantOnboardRequest[]
  >([]);

  const [paramsUpdateInfoRequests, setParamsUpdateInfoRequests] =
    useState<PageQueryParams>({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      company_name: "",
    });
  const [updateInfoRequest, setUpdateInfoRequests] = useState<
    MerchantOnboardRequest[]
  >([]);
  const [metadataUpdateInfoRequest, setMetadataUpdateInfoRequest] =
    useState<PaginationMetadata>();

  const [metadataOnboarding, setMetadataOnboarding] =
    useState<PaginationMetadata>();
  const [merchants, setMerchants] = useState<MerchantOnboard[]>([]);
  const [metadataMerchant, setMetadataMerchant] =
    useState<PaginationMetadata>();
  const [upgradeRequest, setUpgradeRequest] = useState<MerchantUserRequest[]>(
    []
  );
  const [metadataUpgradeRequest, setMetadataUpgradeRequest] =
    useState<PaginationMetadata>();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(MerchantEnum.MERCHANT.toString());
  const [listMerchantSelect, setListMerchantSelect] = useState([]);
  const [selectedMerchantToApprove, setSelectedMerchantToApprove] =
    useState<MerchantOnboardRequest>();
  const [openModalApprove, setOpenModalApprove] = useState(false);

  const userService = new UserServices();

  useEffect(() => {
    getOnboardingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsMerchantOnboarding]);

  useEffect(() => {
    getMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsMerchant]);

  useEffect(() => {
    getUpgradeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsUpgradeRequest]);

  useEffect(() => {
    getUpdateInfoRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsUpdateInfoRequests]);

  function handleOpenModalApprove(merchant: MerchantOnboardRequest) {
    setSelectedMerchantToApprove(merchant);
    setOpenModalApprove(true);
  }
  function handleCloseModalApprove() {
    setOpenModalApprove(false);
    refresh();
  }

  const getMerchants = async () => {
    if (paramsMerchant.name === "") {
      setMerchants([]);
      setMetadataMerchant({
        "x-next-page": 0,
        "x-page": 0,
        "x-pages-count": 0,
        "x-per-page": 0,
        "x-total-count": 0,
      });
      return;
    }
    try {
      const res = await userService.fetchListMerchant(paramsMerchant);
      if (
        res.data.data &&
        res.status === STATUS_CODE.SUCCESS &&
        res.data.metadata
      ) {
        const { data, metadata } = res.data as PaginationData<StoreMerchant>;
        let merchantOnboard = data.map((item) => item.merchant_onboard);
        const newmerchantOnboard: MerchantOnboard[] = merchantOnboard.map(
          (item, index) => {
            return {
              ...item,
              merchant_status: data[index]?.status,
              merchant_id: data[index]?.id,
              merchant_user_id: data[index]?.merchant_user_id,
              merchant_name: data[index]?.name,
              mechant_id: data[index]?.id,
              indexTable: formatIndexTable(
                index,
                metadata["x-per-page"],
                metadata["x-page"]
              ),
            };
          }
        );

        setMerchants(newmerchantOnboard);
        setMetadataMerchant(res.data.metadata);
      }
    } catch (error) {}
  };

  const getOnboardingRequests = async () => {
    try {
      const res = await userService.fetchOnboardingRequests(
        paramsMerchantOnboarding
      );

      if (
        res.data.data &&
        res.status === STATUS_CODE.SUCCESS &&
        res.data.metadata
      ) {
        const { data, metadata } =
          res.data as PaginationData<MerchantOnboardRequest>;

        const dataTabe: MerchantOnboardRequest[] = addTableIndex(
          data,
          metadata["x-per-page"],
          metadata["x-page"]
        );
        setOnboardingRequests(dataTabe);
        setMetadataOnboarding(metadata);
      }
    } catch (error) {}
  };

  const getUpdateInfoRequests = async () => {
    try {
      const res = await userService.fetchOnboardingUpdateRequest(
        paramsMerchantOnboarding
      );

      if (
        res.data.data &&
        res.status === STATUS_CODE.SUCCESS &&
        res.data.metadata
      ) {
        const { data, metadata } =
          res.data as PaginationData<MerchantOnboardRequest>;

        const dataTabe: MerchantOnboardRequest[] = addTableIndex(
          data,
          metadata["x-per-page"],
          metadata["x-page"]
        );
        setUpdateInfoRequests(dataTabe);
        setMetadataUpdateInfoRequest(metadata);
      }
    } catch (error) {}
  };

  const getUpgradeRequest = async () => {
    try {
      const res = await userService.fetchUpgradeRequest(paramsUpgradeRequest);
      if (
        res.data.items &&
        res.status === STATUS_CODE.SUCCESS &&
        res.data.headers
      ) {
        const dataTable: MerchantUserRequest[] = addTableIndex(
          res.data.items,
          res.data.headers["x-per-page"],
          res.data.headers["x-page"]
        );
        setUpgradeRequest(dataTable);
        setMetadataUpgradeRequest(res.data.headers);
      }
    } catch (error) {}
  };

  const goToDetail = (id: number, isSignUp: boolean) => {
    if (isSignUp) {
      history.push(`/merchant/onboard-request/${id}`);
    } else {
      history.push(`/merchant/update-information/${id}`);
    }
  };

  const goToMerchantDetail = (id: number) => history.push(`/merchant/${id}`);

  const actionMerchantOnboardRequest = (
    textAction: string,
    merchantId: number,
    isMultiple = false,
    rejectedFields?: string[]
  ) => {
    setOpenModalApprove(false);
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure ${textAction} this merchant?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        if (textAction === "decline") {
          handleDeclineMerchant(merchantId, isMultiple, rejectedFields!);
        } else {
          handleAcceptMerchant(merchantId, isMultiple);
        }
      },
    });
  };

  const confirmApproveOrReject = (isApprove: boolean, requestId: number) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure ${isApprove ? "approve" : "reject"} this request?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        if (isApprove) {
          handleApproveUpgradeRequest(requestId);
        } else {
          handleRejectUpgradeRequest(requestId);
        }
      },
    });
  };

  const handleRejectUpgradeRequest = async (id: number) => {
    try {
      setLoading(true);
      await userService.upgradeRequestAction(id, "reject");
      refreshUpgradeRequest();
      message.success("Membership upgrade request has been rejected");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "This request is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUpgradeRequest = async (id: number) => {
    try {
      setLoading(true);
      await userService.upgradeRequestAction(id, "approve");
      refreshUpgradeRequest();
      message.success("Membership upgrade request has been approved");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "This request is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshUpgradeRequest = () => {
    setActiveTab(MerchantEnum.UPDATE_REQUEST.toString());
    setParamsUpgradeRequest({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
    } as any);
  };

  const confirmDeactiveOrActive = (isActive: boolean, merchantId: number) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure ${
        isActive ? "decative" : "active"
      } this merchant?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        if (isActive) {
          handeDeactiveMerchant(merchantId);
        } else {
          handeActiveMerchant(merchantId);
        }
      },
    });
  };

  const handeDeactiveMerchant = async (merchantId: number) => {
    try {
      setLoading(true);
      await userService.deactiveMerchant(merchantId);
      refreshMerchant();
      message.success("The deactive merchant is successfully");
    } catch (error) {
      message.error(
        get(
          error,
          "response.data.error.message",
          "The deactive merchant is fail"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handeActiveMerchant = async (merchantId: number) => {
    try {
      setLoading(true);
      await userService.activeMerchant(merchantId);
      refreshMerchant();
      message.success("The active merchant is successfully");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "The active merchant is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setActiveTab(MerchantEnum.ONBOARDING.toString());
    setParamMerchantOnboarding({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      company_name: paramsMerchantOnboarding.company_name,
    } as any);
  };

  const refreshMerchant = () => {
    setActiveTab(MerchantEnum.MERCHANT.toString());
    setParamsMerchant({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      name: paramsMerchant.name,
    });
  };

  const handleDeclineMerchant = async (
    merchantId: number,
    isMultiple: boolean,
    rejectedFields: string[]
  ) => {
    try {
      setLoading(true);
      if (isMultiple) {
        await userService.executionMerchantMul(listMerchantSelect, "DENY");
      } else {
        await userService.executionMerchant(merchantId, "DENY", {
          rejectedFields,
        });
      }
      refresh();
      message.success("The decline merchant is successfully");
    } catch (error) {
      message.error(
        get(
          error,
          "response.data.error.message",
          "The decline merchant is fail"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMerchant = async (
    merchantId: number,
    isMultiple: boolean
  ) => {
    try {
      setLoading(true);
      if (isMultiple) {
        await userService.executionMerchantMul(listMerchantSelect, "ACCEPT");
      } else {
        await userService.executionMerchant(merchantId, "ACCEPT");
      }
      refresh();
      message.success("The accept merchant is successfully");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "The accept merchant is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<MerchantOnboardRequest> = [
    {
      title: "No",
      width: 60,
      dataIndex: "indexTable",
      render: (text) => <span className="pointer">{text}</span>,
    },
    {
      title: "Company name",
      dataIndex: "company_name",
      key: "name",
      render: (text: string, record) => (
        <span onClick={() => goToDetail(record.id, true)} className="pointer">
          {text}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <span className="pointer" onClick={() => goToDetail(record.id, true)}>
          {text}
        </span>
      ),
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      render: (text, record) => (
        <span className="pointer" onClick={() => goToDetail(record.id, true)}>
          {formatPhoneNumber(text)}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "categories",
      render: (text, record) => {
        const list = record?.categories?.map((item) => item.name);
        return (
          <div className="pointer" onClick={() => goToDetail(record.id, true)}>
            {_.join(list, `, `)}
          </div>
        );
      },
    },
    {
      title: "Action",
      width: 160,
      render: (text, record) => {
        return (
          <div className="groupButton">
            <Button
              disabled={!doHavePermissionToEdit}
              type="link"
              className="button2"
              loading={loading}
              // onClick={() => confirm("decline", record.id)}
              onClick={() => handleOpenModalApprove(record)}
            >
              Merchant Approval
            </Button>
          </div>
        );
      },
    },
  ];
  const columnsUpdateInformation: ColumnsType<MerchantOnboardRequest> = [
    {
      title: "No",
      width: 60,
      dataIndex: "indexTable",
      render: (text) => <span className="pointer">{text}</span>,
    },
    {
      title: "Company name",
      dataIndex: "company_name",
      key: "name",
      render: (text: string, record) => (
        <span onClick={() => goToDetail(record.id, false)} className="pointer">
          {text}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <span className="pointer" onClick={() => goToDetail(record.id, false)}>
          {text}
        </span>
      ),
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      render: (text, record) => (
        <span className="pointer" onClick={() => goToDetail(record.id, false)}>
          {formatPhoneNumber(text)}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "categories",
      render: (text, record) => {
        const list = record?.categories?.map((item) => item.name);
        return (
          <div className="pointer" onClick={() => goToDetail(record.id, false)}>
            {_.join(list, `, `)}
          </div>
        );
      },
    },
    {
      title: "Action",
      width: 160,
      render: (text, record) => {
        return (
          <div className="groupButton">
            <Button
              disabled={!doHavePermissionToEdit}
              type="link"
              className="button2"
              loading={loading}
              // onClick={() => confirm("decline", record.id)}
              onClick={() => handleOpenModalApprove(record)}
            >
              Merchant Approval
            </Button>
          </div>
        );
      },
    },
  ];

  const columnsMerchant: ColumnsType<MerchantOnboard> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span className="pointer">{text}</span>,
    },
    {
      title: "Merchant ID",
      dataIndex: "merchant_id",
      render: (_, record, index) => (
        <span
          onClick={() => goToMerchantDetail(record.merchant_id)}
          className="pointer"
        >
          {record.merchant_id}
        </span>
      ),
    },
    {
      title: "Merchant name",
      dataIndex: "merchant_name",
      key: "name",
      render: (text: string, record) => (
        <span
          onClick={() => goToMerchantDetail(record.merchant_id)}
          className="pointer"
        >
          {text}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <span
          className="pointer"
          onClick={() => goToMerchantDetail(record.merchant_id)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      render: (text, record) => (
        <span
          className="pointer"
          onClick={() => goToMerchantDetail(record.merchant_id)}
        >
          {formatPhoneNumber(text)}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "categories",
      render: (text, record) => {
        const list = record?.categories?.map((item) => item.name);
        return (
          <div
            className="pointer"
            onClick={() => goToMerchantDetail(record.merchant_id)}
          >
            {_.join(list, `, `)}
          </div>
        );
      },
    },
    {
      title: "Status",
      width: 90,
      dataIndex: "merchant_status",
      render: (text, record) => {
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
          <span
            className="pointer"
            onClick={() => goToMerchantDetail(record.id)}
          >
            {isActive ? activeShow : inactiveShow}
          </span>
        );
      },
    },
    {
      title: "Action",
      width: 160,
      render: (text, record) => {
        const isActive =
          Number(record.merchant_status) === MerchantStatusEnum.ACTIVE;
        return (
          <Button
            type="text"
            className={isActive ? "button1" : "button3"}
            onClick={() =>
              confirmDeactiveOrActive(isActive, record?.mechant_id)
            }
            loading={loading}
            disabled={!doHavePermissionToEdit}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        );
      },
    },
  ];

  const columnsUpdateRequest: ColumnsType<MerchantUserRequest> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span className="pointer">{text}</span>,
    },
    {
      title: "Merchant ID",
      dataIndex: "merchant_id",
      render: (_, record, index) => (
        <span
          onClick={() => goToMerchantDetail(record.merchant_id)}
          className="pointer"
        >
          {record.merchant_id}
        </span>
      ),
    },
    {
      title: "Merchant name",
      dataIndex: "merchant_name",
      key: "name",
      render: (text: string, record) => (
        <span
          onClick={() => goToMerchantDetail(record.merchant_id)}
          className="pointer"
        >
          {record?.merchant?.name}
        </span>
      ),
    },
    {
      title: "Membership",
      render: (text: string, record) => {
        let src;
        const level = Number(record?.level) || 0;
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
      title: "Request Date",
      dataIndex: "create_time",
      render: (text, record) => (
        <span
          className="pointer"
          onClick={() => goToMerchantDetail(record.merchant_id)}
        >
          {dayjs(text).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "status",
      width: 160,
      align: "center",
      render: (text, record) => {
        return (
          <div className="flex space-beetween pointer">
            <CheckCircleOutlined
              disabled={!doHavePermissionToEdit}
              style={{ color: "green", fontSize: 30 }}
              onClick={() => confirmApproveOrReject(true, record?.id)}
            />
            <CloseCircleOutlined
              disabled={!doHavePermissionToEdit}
              style={{ color: "red", fontSize: 30 }}
              onClick={() => confirmApproveOrReject(false, record?.id)}
            />
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setListMerchantSelect(selectedRowKeys as any);
    },
  };

  const onChangeTable = async (pagination: any) => {
    const { current, pageSize } = pagination;

    if (activeTab === MerchantEnum.ONBOARDING.toString()) {
      const newParams = {
        ...paramsMerchantOnboarding,
        page: current,
        perPage: pageSize,
      };

      setParamMerchantOnboarding(newParams);
    } else if (activeTab === MerchantEnum.UPDATE_REQUEST.toString()) {
      const newParams = {
        ...paramsMerchantOnboarding,
        page: current,
        perPage: pageSize,
      };

      setParamsUpgradeRequest(newParams);
    } else if (activeTab === MerchantEnum.MERCHANT.toString()) {
      const newParams = {
        ...paramsMerchant,
        page: current,
        perPage: pageSize,
      };
      setParamsMerchant(newParams);
    } else {
      const newParams = {
        ...paramsUpdateInfoRequests,
        page: current,
        perPage: pageSize,
      };
      setParamsUpdateInfoRequests(newParams);
    }
  };

  const EmptyData = useMemo(
    () =>
      handleDisplayNodata(
        activeTab === MerchantEnum.MERCHANT.toString() &&
          paramsMerchant.name === ""
      ),
    [activeTab, paramsMerchant]
  );

  const itemsTab: TabsProps["items"] = [
    {
      key: MerchantEnum.MERCHANT.toString(),
      label: `Merchant list`,
      children: (
        <SearchTable
          locale={{ emptyText: EmptyData }}
          title={() => <div className="title-table">Merchant list</div>}
          columns={columnsMerchant}
          dataSource={merchants}
          onChange={onChangeTable}
          totalItems={metadataMerchant?.["x-total-count"] || 0}
          current={metadataMerchant?.["x-page"]}
          rowKey={"id"}
        />
      ),
    },
    {
      key: MerchantEnum.ONBOARDING.toString(),
      label: (
        <div className="flex">
          <div className="margin-right-10">Onboard request</div>
          <Avatar style={{ backgroundColor: "#FF4D4F" }} size={16}>
            {metadataOnboarding?.["x-total-count"] || 0}
          </Avatar>
        </div>
      ),
      children: (
        <>
          <SearchTable
            title={() => (
              <div className="title-table">Onboard request list</div>
            )}
            columns={columns}
            dataSource={onboardingRequests}
            onChange={onChangeTable}
            totalItems={metadataOnboarding?.["x-total-count"] || 0}
            current={metadataOnboarding?.["x-page"]}
            rowKey={"id"}
          />
          <ModalDetailMerchantInformationForApproval
            isAtSignup={true}
            selectedMerchantApproval={selectedMerchantToApprove!}
            onClose={handleCloseModalApprove}
            onOpen={openModalApprove}
            handleActionMerchant={actionMerchantOnboardRequest}
          />
        </>
      ),
    },
    {
      key: MerchantEnum.UPDATE_INFO_REQUEST.toString(),
      label: (
        <div className="flex">
          <div className="margin-right-10">Update Information Request</div>
          <Avatar style={{ backgroundColor: "#FF4D4F" }} size={16}>
            {metadataUpdateInfoRequest?.["x-total-count"] || 0}
          </Avatar>
        </div>
      ),
      children: (
        <>
          <SearchTable
            title={() => (
              <div className="title-table">Update Information Request</div>
            )}
            columns={columnsUpdateInformation}
            dataSource={updateInfoRequest}
            onChange={onChangeTable}
            totalItems={metadataUpdateInfoRequest?.["x-total-count"] || 0}
            current={metadataUpdateInfoRequest?.["x-page"]}
            rowKey={"id"}
          />
          <ModalDetailMerchantInformationForApproval
            isAtSignup={false}
            selectedMerchantApproval={selectedMerchantToApprove!}
            onClose={handleCloseModalApprove}
            onOpen={openModalApprove}
            handleActionMerchant={actionMerchantOnboardRequest}
          />
        </>
      ),
    },
    {
      key: MerchantEnum.UPDATE_REQUEST.toString(),
      label: `Upgrade Request`,
      children: (
        <SearchTable
          title={() => (
            <div className="title-table">Membership upgrade Request</div>
          )}
          columns={columnsUpdateRequest}
          dataSource={upgradeRequest}
          onChange={onChangeTable}
          totalItems={metadataUpgradeRequest?.["x-total-count"] || 0}
          current={metadataUpgradeRequest?.["x-page"]}
          rowKey={"id"}
          loading={loading}
        />
      ),
    },
  ];

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  const handleChangeSearch = (e: any) => {
    setParamMerchantOnboarding({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      company_name: e.target.value,
    });
    setParamsMerchant({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      name: e.target.value,
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "2",
      label: (
        <div onClick={() => actionMerchantOnboardRequest("decline", 1, true)}>
          Decline all request
        </div>
      ),
    },
  ];
  const totalTableItems = useMemo(() => {
    if (activeTab === MerchantEnum.ONBOARDING.toString()) {
      return metadataOnboarding?.["x-total-count"] || 0;
    } else if (activeTab === MerchantEnum.UPDATE_REQUEST.toString()) {
      return metadataUpgradeRequest?.["x-total-count"] || 0;
    } else if (activeTab === MerchantEnum.MERCHANT.toString()) {
      return metadataMerchant?.["x-total-count"] || 0;
    } else {
      return metadataUpdateInfoRequest?.["x-total-count"] || 0;
    }
  }, [
    activeTab,
    metadataMerchant,
    metadataOnboarding,
    metadataUpgradeRequest,
    metadataUpdateInfoRequest,
  ]);
  return (
    <div>
      <TridentityPageHeader title="Merchant" />
      <CardContent className="transaction-search">
        <div className="transaction-search-form">
          <Row gutter={30}>
            <Col span={10}>
              <InputSearch
                searchResultCount={totalTableItems}
                placeholder="Search Merchant"
                handleChangeSearch={handleChangeSearch}
                debounceTime={800}
              />
            </Col>
            <Col span={10}></Col>
            <Col
              span={4}
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              {/* need to ask mrs an about flow multi merchant */}
              {/* <Dropdown
                menu={{ items }}
                placement="bottom"
                disabled={
                  activeTab === MerchantEnum.MERCHANT.toString() ||
                  listMerchantSelect.length === 0 ||
                  !doHavePermissionToEdit
                }
              >
                <Button>Config</Button>
              </Dropdown> */}
            </Col>
          </Row>
        </div>
      </CardContent>
      <CardContent>
        <Tabs
          defaultActiveKey={MerchantEnum.MERCHANT.toString()}
          activeKey={activeTab}
          items={itemsTab}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};

export default MerchantPage;
