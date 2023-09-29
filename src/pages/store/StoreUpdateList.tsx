import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useDataTable from "src/hooks/useDataTable";
import { merchantStoreService } from "src/services/merchant-store-service";
import { ReduxStore } from "src/types/globalStore";
import { StoreTabEnum } from ".";
import { ColumnsType } from "antd/lib/table";
import { ApproveIcon, RejectIcon } from "../../assets/icons";
import { Button, message } from "antd";
import SearchTable from "src/components/11.tables/SearchTable";
import useAcceptOrReject from "src/hooks/useAcceptOrReject";
import ConfirmWithData from "../productManagement/ConfirmReject";
import ConfirmPopup from "../parameters/confirm-popup/confirm-popup";
import { useHistory } from "react-router";
import { PATHS } from "src/constants/paths";

interface Props {
  search: string;
  setTotalItems: (total: number) => void;
  activeTab: string;
}

const StoreUpdateList: React.FC<Props> = ({
  search,
  setTotalItems,
  activeTab,
}) => {
  const history = useHistory();
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
  } = useDataTable(merchantStoreService.fetchStoreUpdateRequests);

  const {
    openModalAccept,
    handleConfirmAccept,
    handleCloseModalAccept,
    openModalReject,
    handleConfirmReject,
    handleCloseModalReject,
    selectedItem,
  } = useAcceptOrReject();

  async function handleAcceptStoreUpdate() {
    message.loading("Accepting store...");
    handleCloseModalAccept();
    try {
      await merchantStoreService.updateStoreUpdateRequestDetail(
        selectedItem!.id
      );
      message.success("Accept store successfully");
      fetchData(params);
    } catch (error) {
      message.error("Accept store failed");
    } finally {
      message.destroy();
    }
  }

  async function handleRejectedStoreUpdate(description: string) {
    handleCloseModalReject();
    message.loading("Rejecting store...");
    try {
      await merchantStoreService.rejectStoreUpdateRequest({
        merchantStoreApprovalId: selectedItem!.id,
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

  useEffect(() => {
    setTotalItems(metadata?.["x-total-count"] || 0);
  }, [metadata, setTotalItems]);

  useEffect(() => {
    if (activeTab === StoreTabEnum.STORE_UPDATE_LIST.toString()) {
      fetchData({ ...params, search: search });
    }
  }, [search, activeTab, params]);

  function handleNavigateStoreDetail(id: number) {
    history.push(PATHS.storeUpdateDetail().replace(":id", id.toString()));
  }

  const columns: ColumnsType<StoreUpdate> = [
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
      key: "id",
      title: "Store ID",
      dataIndex: "id",
      render: (text, record) => (
        <span onClick={() => handleNavigateStoreDetail(record.id)}>
          {record.merchantStoreId}
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
        title={() => (
          <div className="title-table">Store request update list</div>
        )}
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
        onOk={handleRejectedStoreUpdate}
      />

      <ConfirmPopup
        open={openModalAccept}
        onClose={handleCloseModalAccept}
        onOk={handleAcceptStoreUpdate}
      />
    </div>
  );
};

export default StoreUpdateList;
