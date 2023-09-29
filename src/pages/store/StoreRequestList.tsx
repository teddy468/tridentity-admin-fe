import { Button, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useSelector } from "react-redux";
import SearchTable from "src/components/11.tables/SearchTable";
import useDataTable from "src/hooks/useDataTable";
import { merchantStoreService } from "src/services/merchant-store-service";
import { ReduxStore } from "src/types/globalStore";
import { ApproveIcon, RejectIcon } from "../../assets/icons";
import ConfirmWithData from "../productManagement/ConfirmReject";
import { useEffect } from "react";
import { StoreTabEnum } from ".";
import useAcceptOrReject from "src/hooks/useAcceptOrReject";
import { useHistory } from "react-router";
import { PATHS } from "src/constants/paths";
interface Props {
  search: string;
  setTotalItems: (total: number) => void;
  activeTab: string;
}

const StoreRequestList: React.FC<Props> = ({
  search,
  setTotalItems,
  activeTab,
}) => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["user-management-permission"]
  );

  const {
    dataSrc,
    loading,
    params,
    metadata,
    setParams,
    fetchData,
    onChangeTable,
  } = useDataTable(merchantStoreService.fetchStoreOnboardingRequests);

  const {
    openModalAccept,
    handleConfirmAccept,
    handleCloseModalAccept,
    openModalReject,
    handleConfirmReject,
    handleCloseModalReject,
    selectedItem,
  } = useAcceptOrReject();

  const history = useHistory();

  useEffect(() => {
    setTotalItems(metadata?.["x-total-count"] || 0);
  }, [metadata, setTotalItems]);

  useEffect(() => {
    if (activeTab === StoreTabEnum.STORE_REQUESTS_LIST.toString()) {
      fetchData({ ...params, search: search });
    }
  }, [search, activeTab, params]);

  async function handleRejectStore(description: string) {
    handleCloseModalReject();
    message.loading("Rejecting store...");
    try {
      await merchantStoreService.rejectStoreOnboardingRequest({
        merchantStoreOnboardId: selectedItem!.id,
        rejectedReason: description,
      });
      message.success("Reject store successfully");
      fetchData(params);
    } catch (error) {
      message.error("Reject store failed");
    } finally {
      message.destroy();
    }
  }

  async function handleAcceptStore(podsId: string) {
    message.loading("Accepting store...");
    handleCloseModalAccept();
    try {
      const body = {
        POSIds: podsId.split(","),
      };
      await merchantStoreService.updateStoreOnboardRequestDetail(
        selectedItem!.id,
        body
      );

      message.success("Accept store successfully");
      fetchData(params);
    } catch (error) {
      message.error("Accept store failed");
    } finally {
      message.destroy();
    }
  }

  function handleNavigateStoreDetail(id: number) {
    history.push(PATHS.storeOnboardDetail().replace(":id", id.toString()));
  }

  const columns: ColumnsType<Store> = [
    {
      key: "no",
      title: "No",
      dataIndex: "indexTable",
      render: (text, record) => (
        <span onClick={() => handleNavigateStoreDetail(record.id)}>{text}</span>
      ),
    },
    {
      key: "name",
      title: "Store name",
      dataIndex: "name",
      render: (_, record) => (
        <span onClick={() => handleNavigateStoreDetail(record.id)}>
          {record.name}
        </span>
      ),
    },
    {
      key: "min_order",
      title: "Minimum order",
      dataIndex: "min_order",
      render: (text, record) => (
        <span onClick={() => handleNavigateStoreDetail(record.id)}>
          ${text}
        </span>
      ),
    },
    {
      key: "action",
      title: "Action",
      render: (text, record) => {
        return (
          <div className="antd-btn-nostyles-box">
            <Button
              disabled={!doHavePermissionToEdit}
              onClick={() => {
                handleConfirmAccept(record);
              }}
              className={"antd-btn-nostyles"}
            >
              <img src={ApproveIcon} alt={""}></img>
            </Button>
            <Button
              disabled={!doHavePermissionToEdit}
              onClick={() => {
                handleConfirmReject(record);
              }}
              className={"antd-btn-nostyles"}
            >
              <img src={RejectIcon} alt={""}></img>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="table-store">
      <SearchTable
        title={() => <div className="title-table">Store request list</div>}
        columns={columns}
        dataSource={dataSrc}
        onChange={onChangeTable}
        current={metadata?.["x-page"]}
        totalItems={metadata?.["x-total-count"] || 0}
        rowKey={"id"}
        loading={loading}
      />

      <ConfirmWithData
        open={openModalReject}
        onClose={handleCloseModalReject}
        onOk={handleRejectStore}
      />
      <ConfirmWithData
        title={"Are you sure to accept this store?"}
        placeholder="POS ID"
        open={openModalAccept}
        onClose={handleCloseModalAccept}
        onOk={handleAcceptStore}
      />
    </div>
  );
};

export default StoreRequestList;
