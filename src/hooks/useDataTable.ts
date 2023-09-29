import React, { useState } from 'react';
import { STATUS_CODE } from 'src/constants/status-code';
import { addTableIndex } from 'src/helpers';
import { PageQueryParams } from 'src/services/params-type';

const useDataTable = (fetchDataTable: (param: PageQueryParams) => any) => {
  const [dataSrc, setDataSrc] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<PageQueryParams>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: 'body',
  });
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    'x-next-page': 0,
    'x-page': 0,
    'x-pages-count': 0,
    'x-per-page': 0,
    'x-total-count': 0,
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

  async function getData(params: PageQueryParams) {
    try {
      setLoading(true);
      const res = await fetchDataTable(params);
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        const { data, metadata } = res.data as PaginationData<any>;
        const dataTable = addTableIndex(
          data,
          metadata['x-per-page'],
          metadata['x-page']
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

  async function getDataNoPagination(params: PageQueryParams) {
    try {
      setLoading(true);
      const res = await fetchDataTable(params);
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

  function fetchData(params: PageQueryParams) {
    getData(params);
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(
        selectedRows.map((item) => item.settlement_last_transaction_date)
      );
    },
  };

  function fetchDataNoPagination(params: PageQueryParams) {
    getDataNoPagination(params);
  }
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

export default useDataTable;
