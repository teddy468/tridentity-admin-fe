import { Button, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import SearchTable from "src/components/11.tables/SearchTable";
import useDataTable from "src/hooks/useDataTable";
import { merchantStoreService } from "src/services/merchant-store-service";
import { ReduxStore } from "src/types/globalStore";
import { StoreTabEnum } from ".";
import useAcceptOrReject from "src/hooks/useAcceptOrReject";
import ConfirmPopup from "../parameters/confirm-popup/confirm-popup";
import { MerchantStoreStatus } from "src/constants";
import { useHistory } from "react-router";
import { PATHS } from "src/constants/paths";

interface Props {
  search: string;
  setTotalItems: (total: number) => void;
  activeTab: string;
}

const StoreList: React.FC<Props> = ({ search, setTotalItems, activeTab }) => {
  const history = useHistory();
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["user-management-permission"]
  );
  const { dataSrc, loading, params, metadata, fetchData, onChangeTable } =
    useDataTable(merchantStoreService.fetchListStoreOffical);

  const {
    openModalAccept,
    handleConfirmAccept,
    handleCloseModalAccept,
    selectedItem,
  } = useAcceptOrReject();

  async function handleToggleStoreStatus() {
    const isActive =
      selectedItem.status === MerchantStoreStatus.LIVE
        ? MerchantStoreStatus.SUSPENDED
        : MerchantStoreStatus.LIVE;
    try {
      await merchantStoreService.toggleStoreActiveStatus(selectedItem.id, {
        status: isActive,
      });
      handleCloseModalAccept();
      fetchData(params);
      message.success("Store status has been updated");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  }

  function handleNavigateStoreDetail(id: number) {
    history.push(PATHS.storeDetail().replace(":id", id.toString()));
  }

  useEffect(() => {
    setTotalItems(metadata?.["x-total-count"] || 0);
  }, [metadata, setTotalItems]);

  useEffect(() => {
    if (activeTab === StoreTabEnum.STORE_LIST.toString()) {
      fetchData({ ...params, keyword: search });
    }
  }, [search, activeTab, params]);

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
      key: "id",
      title: "Store ID",
      dataIndex: "id",
      render: (text, record) => (
        <span onClick={() => handleNavigateStoreDetail(record.id)}>{text}</span>
      ),
    },
    {
      key: "pos",
      title: "Trifood POS ID",
      dataIndex: "trifood_pos_id",
      render: (_, record) => (
        <span onClick={() => handleNavigateStoreDetail(record.id)}>
          {record.triFoodPOSes.map((item) => item.POSId).join(", ")}
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
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        if (record.status === MerchantStoreStatus.LIVE) {
          return (
            <span
              className="live status"
              onClick={() => handleNavigateStoreDetail(record.id)}
            >
              Live
            </span>
          );
        } else if (record.status === MerchantStoreStatus.SUSPENDED) {
          return (
            <span
              className="sus status"
              onClick={() => handleNavigateStoreDetail(record.id)}
            >
              Suspended
            </span>
          );
        } else {
          return (
            <span
              className="close status"
              onClick={() => handleNavigateStoreDetail(record.id)}
            >
              Close
            </span>
          );
        }
      },
    },
    {
      key: "action",
      title: "Action",
      render: (text, record) => {
        const isActive = record.status === MerchantStoreStatus.LIVE;
        return (
          <div className="antd-btn-nostyles-box">
            <Button
              style={{ width: "fit-content" }}
              disabled={!doHavePermissionToEdit}
              className={
                isActive
                  ? "antd-btn-nostyles button1"
                  : " antd-btn-nostyles button3"
              }
              onClick={() => handleConfirmAccept(record)}
              loading={loading}
            >
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="table-store">
      <SearchTable
        title={() => <div className="title-table">Store list</div>}
        columns={columns}
        dataSource={dataSrc}
        onChange={onChangeTable}
        current={metadata?.["x-page"]}
        totalItems={metadata?.["x-total-count"] || 0}
        rowKey={"id"}
        loading={loading}
      />

      <ConfirmPopup
        open={openModalAccept}
        onClose={handleCloseModalAccept}
        onOk={handleToggleStoreStatus}
      />
    </div>
  );
};

export default StoreList;
