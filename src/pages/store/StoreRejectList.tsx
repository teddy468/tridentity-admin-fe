import { ColumnsType } from "antd/lib/table";
import React, { useEffect } from "react";
import SearchTable from "src/components/11.tables/SearchTable";
import useDataTable from "src/hooks/useDataTable";
import { merchantStoreService } from "src/services/merchant-store-service";
import { StoreTabEnum } from ".";
interface Props {
  search: string;
  setTotalItems: (total: number) => void;
  activeTab: string;
}

const StoreRejectedList: React.FC<Props> = ({
  search,
  setTotalItems,
  activeTab,
}) => {
  const { dataSrc, loading, params, metadata, fetchData, onChangeTable } =
    useDataTable(merchantStoreService.fetchListStoreRejected);

  useEffect(() => {
    setTotalItems(metadata?.["x-total-count"] || 0);
  }, [metadata, setTotalItems]);

  useEffect(() => {
    if (activeTab === StoreTabEnum.STORE_REJECTED_LIST.toString()) {
      fetchData({ ...params, search: search });
    }
  }, [search, activeTab, params]);

  const columns: ColumnsType<Store> = [
    {
      key: "No",
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "name",

      title: "Store name",
      dataIndex: "name",
      render: (_, record) => <span>{record.name}</span>,
    },

    {
      key: "min_order",
      title: "Minimum order",
      dataIndex: "min_order",
      render: (text) => <span>${text}</span>,
    },
    {
      key: "status",
      title: "Status",
      render: () => {
        return <div className="close status"> Rejected</div>;
      },
    },
  ];

  return (
    <div className="table-store">
      <SearchTable
        title={() => <div className="title-table">Store rejected list</div>}
        columns={columns}
        dataSource={dataSrc}
        onChange={onChangeTable}
        current={metadata?.["x-page"]}
        totalItems={metadata?.["x-total-count"] || 0}
        rowKey={"id"}
        loading={loading}
      />
    </div>
  );
};

export default StoreRejectedList;
