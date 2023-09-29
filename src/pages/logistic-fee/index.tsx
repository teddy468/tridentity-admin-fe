import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import useAcceptOrReject from "src/hooks/useAcceptOrReject";
import useDataTable from "src/hooks/useDataTable";
import CardContent from "src/routes/components/CardContent";
import { LogisticService } from "src/services/logistic-calculation-service";
import "./styles.scss";
import CreateUpdateLogisticFeeModal from "src/components/05.modal/components/CreateUpdateLogisticFeeModal/CreateUpdateLogisticFeeModal";
import { LogisticItem } from "src/types/logistic";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

const LogisticFee = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["logistic-fee-permission"]
  );

  const { dataSrc, loading, params, metadata, fetchData, onChangeTable } =
    useDataTable(LogisticService.getListLogistic);

  const convertTime = (time: number) => {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    return `${hour}h ${minute}m`;
  };

  const {
    openModalAccept,
    handleConfirmAccept,
    handleCloseModalAccept,
    selectedItem,
  } = useAcceptOrReject();

  async function handleDeleteLogisticFee(logisticItem: LogisticItem) {
    try {
      await LogisticService.deleteLogistic(logisticItem.id);
      message.success("Delete logistic fee success");
      fetchData(params);
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  }

  function handleOpenModalConfirmReject(logisticItem: LogisticItem) {
    Modal.confirm({
      title: "Are you sure to delete this logistic fee?",
      content: "This action cannot be undone",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleDeleteLogisticFee(logisticItem),
    });
  }
  const columns: ColumnsType<any> = [
    {
      key: "no",
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "from",
      title: "From",
      dataIndex: "from",
      render: (text) => <span>{convertTime(text)}</span>,
    },
    {
      key: "to",
      title: "To",
      dataIndex: "to",
      render: (text) => <span>{convertTime(text)}</span>,
    },
    {
      key: "baseDistance",
      title: "Base Distance",
      dataIndex: "baseDistance",
      render: (text) => <span>{text} km</span>,
    },
    {
      key: "base",
      title: "Base Fee",
      dataIndex: "base",
      render: (text) => <span>${text}</span>,
    },
    {
      key: "extra",
      title: "Extra Fee",
      dataIndex: "extra",
      render: (text) => <span>${text}</span>,
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <Space>
            <Button
              disabled={!doHavePermissionToEdit}
              icon={<EditOutlined />}
              type="link"
              onClick={() => handleConfirmAccept(record)}
            />
            <Button
              disabled={!doHavePermissionToEdit}
              icon={<DeleteOutlined />}
              danger
              type="link"
              onClick={() => handleOpenModalConfirmReject(record)}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData(params);
  }, [params]);

  return (
    <div>
      <TridentityPageHeader title="Logistic" />

      <CardContent className="transaction-search">
        <SearchTable
          title={() => (
            <div className="table-header-logistic">
              <div className="title-table">Logistic fee list</div>
              <Button
                disabled={!doHavePermissionToEdit}
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => handleConfirmAccept({})}
              >
                Create New
              </Button>
            </div>
          )}
          columns={columns}
          dataSource={dataSrc}
          onChange={onChangeTable}
          current={metadata?.["x-page"]}
          totalItems={metadata?.["x-total-count"] || 0}
          rowKey={"id"}
          loading={loading}
        />
      </CardContent>

      <CreateUpdateLogisticFeeModal
        handleCloseModal={handleCloseModalAccept}
        openModal={openModalAccept}
        logisticItem={selectedItem}
        reFetchData={() => fetchData(params)}
      />
    </div>
  );
};

export default LogisticFee;
