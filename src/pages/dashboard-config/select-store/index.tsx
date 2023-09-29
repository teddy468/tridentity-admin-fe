import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Modal, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import { STATUS_CODE } from "src/constants/status-code";
import CardContent from "src/routes/components/CardContent";
import { UserServices } from "src/services/user-service";
import { StoreParams } from "../../../services/params-type";
import "./styles.scss";
import { toast } from "react-toastify";
import { merchantStoreService } from "src/services/merchant-store-service";
import { handleError } from "src/helpers/error";
import InputSearch from "src/components/07.inputs/InputSearch";
import { formatIndexTable } from "src/helpers/formatNumber";
import { set } from "lodash";

const { Search } = Input;

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  reviews: number;
  order: number;
  product_count: number;
  order_count: number;
}

export enum MerchantStatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
}

const SelectStore = () => {
  const history = useHistory();
  const [listChossen, setListChossen] = useState<null | ListChoosenStore[]>(
    null
  );
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>();
  const [paramsStore, setParamsStore] = useState<StoreParams>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
    keyword: "",
  });
  const [stores, setStores] = useState([]);
  const [metadataStore, setMetadataStore] = useState();
  const userService = new UserServices();
  const params: any = useParams();
  const index = params.index;
  useEffect(() => {
    if (listChossen) getMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsStore, listChossen]);
  useEffect(() => {
    getFeaturedRestaurant();
  }, []);

  function checkIsSelectedRestaurantInList() {
    if (listChossen && listChossen.length > 0) {
      const check = listChossen.find(
        (item) => item.merchantStore.id === selectedStoreId
      );
      if (check) {
        return check;
      } else {
        return null;
      }
    }
  }
  const getMerchants = async () => {
    try {
      const res = await userService.fetchStores(paramsStore);

      if (
        res.data.data &&
        res.status === STATUS_CODE.SUCCESS &&
        res.data.metadata
      ) {
        const dataRes = res.data.data as any[];
        const storesRes = dataRes.map((item, index) => {
          return {
            ...item,
            id: dataRes[index]?.id,
            orders: dataRes[index]?.orders,
            name: dataRes[index]?.name,
            reviews: dataRes[index]?.reviews,
            indexTable: formatIndexTable(
              index,
              res.data.metadata["x-per-page"],
              res.data.metadata["x-page"]
            ),
          };
        });

        setStores(storesRes as any);
        setMetadataStore(res.data.metadata);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFeaturedRestaurant = async () => {
    try {
      const result = await merchantStoreService.getFeaturedRestaurantDashboard(
        "featured"
      );
      if (result.status === 200) {
        setListChossen(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function handleSwapRestaurant(positionA: number) {
    try {
      const result = await merchantStoreService.swapFeatureRestaurant(
        "featured",
        positionA,
        index
      );
      if (result.status === 200) {
        toast.success("Set top selling dishes successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.goBack();
      }
    } catch (error) {
      handleError(error);
    }
  }
  async function setStore() {
    try {
      const result = await merchantStoreService.setFeatureRestaurant(
        "featured",
        index,
        selectedStoreId!
      );
      if (result.status === 200) {
        toast.success("Set top selling dishes successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.goBack();
      }
    } catch (error) {
      handleError(error);
    }
  }
  async function handleSetRestaurant() {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to set the store?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        setStore();
      },
    });
  }
  const setFeaturedRestaurant = async () => {
    if (!selectedStoreId) {
      toast.error("Please select a store", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (index === undefined || index === null) {
      toast.error("Index not found", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const checkRestaurant = checkIsSelectedRestaurantInList();

    const listPosition = listChossen?.map((item) => item.position);

    const checkIsPositionSwapAble = listPosition?.find(
      (item) => item === Number(index)
    );
    // if the selected position is not in the listPosition, then set the selected store to this position
    if (!checkIsPositionSwapAble) {
      handleSetRestaurant();
      return;
    }
    if (checkRestaurant) {
      Modal.confirm({
        title: "Do you want to swap the store?",
        icon: <ExclamationCircleOutlined />,
        content: `This store is already in the ${checkRestaurant.position} position. Do you want to swap the store?`,
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          handleSwapRestaurant(checkRestaurant.position);
        },
        onCancel: () => {
          handleSetRestaurant();
        },
      });
    } else {
      handleSetRestaurant();
    }
  };
  const columnsMerchant: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span className="pointer">{text}</span>,
    },
    {
      title: "Store ID",
      dataIndex: "id",
      render: (_, record: any, index) => (
        <span className="pointer">{record.id}</span>
      ),
    },
    {
      title: "Store name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <span className="pointer">{text}</span>
      ),
    },
    {
      title: "Product quantity",
      dataIndex: "product_count",
      key: "product_count",
      render: (text: string, record: any) => (
        <span className="pointer">{text || 0}</span>
      ),
    },
    {
      title: "Order",
      dataIndex: "order_count",
      render: (text, record: any) => (
        <span className="pointer">{text || 0}</span>
      ),
    },
    {
      title: "Review",
      dataIndex: "reviews",
      render: (text, record: any) => (
        <span className="pointer">{text || 0}</span>
      ),
      sorter: true,
    },

    {
      title: "Top Restaurant",
      width: 200,
      render: (text, record) => (
        <Button
          onClick={() => setSelectedStoreId(record.id)}
          type="primary"
          disabled={selectedStoreId === record.id}
        >
          Choose Restaurant{" "}
        </Button>
      ),
    },
  ];

  const onChangeTable = async (
    pagination: any,
    filters: any,
    sorters: any,
    extra: any
  ) => {
    const { current, pageSize } = pagination;

    const newParams = {
      ...paramsStore,
      page: current,
      perPage: pageSize,
    };
    if (sorters.order) {
      newParams.order_by = sorters.order === "ascend" ? "ASC" : "DESC";
      newParams.sort_by = sorters.field;
    }

    setParamsStore(newParams);
  };

  const handleChangeSearch = (e: any) => {
    setParamsStore({
      page: 1,
      perPage: 10,
      paginationMetadataStyle: "body",
      keyword: e.target.value,
    });
  };

  return (
    <div>
      <TridentityPageHeader title="Dashboard config" />
      <CardContent className="transaction-search">
        <div
          style={{ fontSize: "16px", fontWeight: 500, marginBottom: "30px" }}
        >
          Top Restaurants
        </div>
        <div className="transaction-search-form">
          <Row gutter={30}>
            <Col span={24}>
              <InputSearch
                searchResultCount={metadataStore?.["x-total-count"] || 0}
                placeholder="Search Store"
                debounceTime={800}
                handleChangeSearch={handleChangeSearch}
              />
            </Col>
          </Row>
        </div>
      </CardContent>
      <CardContent>
        <SearchTable
          title={() => <div className="title-table">Store list</div>}
          columns={columnsMerchant}
          dataSource={stores}
          onChange={onChangeTable}
          totalItems={metadataStore?.["x-total-count"] || 0}
          // rowSelection={{ ...rowSelection }}
          current={metadataStore?.["x-page"]}
          rowKey={"id"}
        />
        <div className="footer-actions">
          <Button onClick={() => history.goBack()}>Cancel</Button>
          <Button onClick={() => setFeaturedRestaurant()} type="primary">
            Save
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default SelectStore;
