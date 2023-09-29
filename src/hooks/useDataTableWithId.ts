import React, { useState } from "react";
import { STATUS_CODE } from "src/constants/status-code";
import { addTableIndex } from "src/helpers";
import { PageQueryParams } from "src/services/params-type";

const useDataTableWithId = (
  fetchDataTable: (id: string, param: PageQueryParams) => any
) => {
  const [dataSrc, setDataSrc] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<PageQueryParams>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  });
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    "x-next-page": 1,
    "x-page": 1,
    "x-pages-count": 1,
    "x-per-page": 1,
    "x-total-count": 1,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const onChangeTable = async (pagination: any) => {
    const { current, pageSize } = pagination;
    setParams({
      ...params,
      page: current,
      perPage: pageSize,
    });
  };

  async function getData(id: string, params: PageQueryParams) {
    try {
      setLoading(true);
      const res = await fetchDataTable(id, params);
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        const { data, metadata } = res.data as PaginationData<any>;
        const dataTable = addTableIndex(
          data,
          metadata["x-per-page"],
          metadata["x-page"]
        );
        setDataSrc(dataTable);
        setMetadata(metadata);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getDataNoPagination(id: string, params: PageQueryParams) {
    try {
      setLoading(true);
      const res = await fetchDataTable(id, params);
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        const { data } = res.data;
        setDataSrc(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function fetchData(id: string, params: PageQueryParams) {
    getData(id, params);
  }

  function fetchDataNoPagination(id: string, params: PageQueryParams) {
    getDataNoPagination(id, params);
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(
        selectedRows.map((item) => item.settlement_last_transaction_date)
      );
    },
  };

  return {
    dataSrc,
    loading,
    params,
    metadata,
    setDataSrc,
    setLoading,
    setParams,
    setMetadata,
    fetchData,
    onChangeTable,
    fetchDataNoPagination,
    rowSelection,
    selectedRowKeys,
  };
};

export default useDataTableWithId;
