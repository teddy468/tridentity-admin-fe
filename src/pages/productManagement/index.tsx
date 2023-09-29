import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  message,
  Modal,
  Rate,
  Row,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { get, set } from "lodash";
import moment from "moment";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  ApprovalStatus,
  ProductActionType,
  Product,
  ProductApprovalParams,
  ProductParams,
} from "src/types/Product";
import { ApproveIcon, RejectIcon } from "../../assets/icons";
import TridentityPageHeader from "../../components/02.page-header";
import CustomTabs from "../../components/10.tab/CustomTabs";
import SearchTable from "../../components/11.tables/SearchTable";
import { Loading } from "../../components/17.loading/Loading";
import CardContent from "../../routes/components/CardContent";
import { productManagementService } from "../../services/product-management";
import ConfirmApprove from "./ConfirmApprove";
import ConfirmReject from "./ConfirmReject";
import PreviewProduct from "./PreviewProduct/PreviewProduct";
import ProductSearch from "./ProductSearch";
import "./styles.scss";
import { addTableIndex } from "src/helpers";
import ModalPreviewUpdate from "./ModalPreviewUpdate/ModalPreviewUpdate";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

interface DataType {
  key: React.Key;
  id: ReactNode;
  amount: string;
  date: string;
  vault: ReactNode;
}

interface DataTypeApproval {
  key: React.Key;
  id: ReactNode;
  product_id: string;
  product_name: string;
  category: string;
  merchant_name: string;
  last_update: string;
  type: string;
  description: string;
  item: ProductItemApproval;
  approval_status: number;
  indexTable?: string;
}

export enum Tab {
  ACTIVE = 1,
  APPROVE = 2,
  REJECT = 3,
}

const ProductManagement = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["product-management-permission"]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(2);
  const [numPerPage, setNumPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [actionsFilter, setActionsFilter] = useState("Create,Publish,Update");
  const [activeTab, setActiveTab] = useState(Tab.APPROVE.toString());
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openRejectPopup, setOpenRejectPopup] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<
    DataTypeApproval | undefined
  >(undefined);
  const [refresh, setRefresh] = useState(0);
  const [countWaiting, setCountWaiting] = useState<number | "">(0);
  const [countReject, setCountReject] = useState<number | "">(0);
  const [countActive, setCountActive] = useState<number | "">(0);

  const [previewProduct, setPreviewProduct] = useState<
    ProductItemApproval | undefined
  >(undefined);
  const [openPreview, setOpenPreview] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys as any);
    },
  };
  const [dataSrc, setDataSrc] = useState<Product[]>([]);
  const [dataSrcApproval, setDataSrcApproval] = useState<DataTypeApproval[]>(
    []
  );
  const [openModalPreviewUpdate, setOpenModalPreviewUpdate] = useState(false);
  const [chosenProduct, setChosenProduct] = useState<ProductItemApproval>();
  const [dataSrcReject, setDataSrcReject] = useState<DataTypeApproval[]>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      width: 60,

      dataIndex: "indexTable",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Product name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text) => <span>{text?.name}</span>,
    },
    {
      title: "Merchant",
      dataIndex: "store",
      render: (text) => <span>{text.merchant.name}</span>,
    },
    {
      title: "Store",
      dataIndex: "store",
      render: (text) => <span>{text?.name}</span>,
    },
    {
      title: "Rating & Review",
      dataIndex: "rating",
      width: 170,
      render: (text) => (
        <span>
          <Rate value={text} disabled={true} />
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <>
          <span className={`${text === 1 ? "show" : "hidden"} status`}></span>
          {text === 1 ? "show" : "hidden"}
        </>
      ),
    },
  ];

  const columnsApproval: ColumnsType<DataTypeApproval> = [
    {
      title: "No",
      dataIndex: "indexTable",
      width: 60,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "id",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Product name",
      dataIndex: "product_name",
      key: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Merchant",
      dataIndex: "merchant_name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Store",
      dataIndex: "store",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Last update",
      dataIndex: "last_update",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      // create filter function for the column
      filterMultiple: false,
      filters: [
        {
          text: "Create",
          value: "Create",
        },
        {
          text: "Update",
          value: "Update",
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value: any, record: any) => {
        if (value === "Create") {
          setActionsFilter("Create,Publish");
        } else {
          setActionsFilter("Update");
        }
        return record.type.indexOf(value) === 0;
      },
      filterMode: "tree",
      filterSearch: true,
      render: (text, record) => {
        if (record.type === ProductActionType.UPDATE) {
          return (
            <span
              className="update"
              onClick={() => {
                setOpenModalPreviewUpdate(true);
                setChosenProduct(record.item);
              }}
            >
              {text}{" "}
            </span>
          );
        }
        return <span>{text}</span>;
      },
    },

    {
      title: "Action",
      key: "key",
      width: 244,
      render: (record, index) => (
        <>
          <div className={"actionBtnGroup"}>
            {record.approval_status === ApprovalStatus.PENDING && (
              <>
                <Button
                  disabled={!doHavePermissionToEdit}
                  onClick={() => {
                    setOpenConfirmPopup(true);
                    setSelectedApproval(record);
                  }}
                  className={"btnAction"}
                >
                  <img src={ApproveIcon} alt={""}></img>
                </Button>
                <Button
                  disabled={!doHavePermissionToEdit}
                  onClick={() => {
                    setOpenRejectPopup(true);
                    setSelectedApproval(record);
                  }}
                  className={"btnAction"}
                >
                  <img src={RejectIcon} alt={""}></img>
                </Button>
              </>
            )}

            <Button
              type={"primary"}
              onClick={() => {
                setPreviewProduct(record.item);
                setOpenPreview(true);
              }}
            >
              Preview Product
            </Button>
          </div>
        </>
      ),
    },
  ];

  const columnsReject: ColumnsType<DataTypeApproval> = [
    {
      title: "No",
      dataIndex: "indexTable",
      width: 60,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "id",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Product name",
      dataIndex: "product_name",
      key: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Merchant",
      dataIndex: "merchant_name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Store",
      dataIndex: "store",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Last update",
      dataIndex: "last_update",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Admin note",
      dataIndex: "description",
      render: (text) => <span className="note">{text}</span>,
      width: 250,
    },
    {
      title: "Action",
      key: "key",
      width: 180,

      render: (record, index) => (
        <div className={"actionBtnGroup"}>
          <Button
            type={"primary"}
            onClick={async () => {
              const approval = await productManagementService.getApprovalDetail(
                record.item.id
              );
              setPreviewProduct(approval);
              setOpenPreview(true);
            }}
          >
            Preview Product
          </Button>
        </div>
      ),
    },
  ];

  const clickConfirmApprove = async () => {
    setLoading(true);
    try {
      const result = await productManagementService.approveRejectApproval(
        Number(selectedApproval?.key),
        ApprovalStatus.APPROVE,
        ""
      );
      if (result) {
        setOpenConfirmPopup(false);
        message.success("Approval request success !");
        setSearchKey("");
        setRefresh(refresh + 1);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setOpenConfirmPopup(false);
      message.error(
        get(error, "response.data.error.message", "Approval request fail !")
      );
    }
  };

  const clickConfirmReject = async (description: string) => {
    try {
      setLoading(true);
      const result = await productManagementService.approveRejectApproval(
        Number(selectedApproval?.key),
        ApprovalStatus.REJECT,
        description
      );
      if (result) {
        setOpenRejectPopup(false);
        message.success("Reject request success !");
        setSearchKey("");
        setRefresh(refresh + 1);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setOpenConfirmPopup(false);
      message.error(
        get(error, "response.data.error.message", "Approval request fail !")
      );
    }
  };
  function getCateProductName(data: ProductItemApproval) {
    let productId = "";
    switch (data.type) {
      case ProductActionType.UPDATE:
        productId = data.product_id.toString();
        break;
      case ProductActionType.PUBLISH:
        productId = data.product_id.toString();
        break;
      default:
        break;
    }
    return {
      productId,
    };
  }
  useEffect(() => {
    productManagementService.countWaiting().then((value) => {
      setCountWaiting(value.pending);
      setCountActive(value.approved);
      setCountReject(value.rejected);
    });
  }, [refresh, activeTab]);

  useEffect(() => {
    if (activeTab === Tab.ACTIVE.toString()) {
      const params: ProductParams = {
        page: currentPage,
        perPage: numPerPage,
        keyword: searchKey,
        order_by: "DESC",
        sort_by: "create_time",
        paginationMetadataStyle: "body",
        status: `${ApprovalStatus.APPROVE}`,
      };
      productManagementService.getProduct(params).then(({ data, metadata }) => {
        setTotalItems(metadata["x-total-count"]);
        const tableData: Product[] = addTableIndex(
          data,
          metadata["x-per-page"],
          metadata["x-page"]
        );
        setDataSrc(tableData);
      });
    }
  }, [currentPage, numPerPage, searchKey, activeTab, refresh]);

  useEffect(() => {
    if (activeTab === Tab.REJECT.toString()) {
      const params: ProductApprovalParams = {
        page: currentPage,
        perPage: numPerPage,
        keyword: searchKey,
        paginationMetadataStyle: "body",
        status: `${ApprovalStatus.REJECT}`,
      };
      productManagementService
        .getProductPending(params)
        .then(({ data, metadata }) => {
          setTotalItems(metadata["x-total-count"]);
          const dataReject: DataTypeApproval[] = data.map((reject) => {
            const { productId } = getCateProductName(reject);

            return {
              key: reject.id,
              category: reject.payload.category
                ? reject.payload.category.name
                : "",
              product_id: productId,
              id: reject.id,
              item: reject,
              product_name: reject.payload.name,
              last_update: moment(reject.update_time).format(
                "DD/MM/yyyy HH:mm"
              ),
              merchant_name: reject.store.merchant.name,
              type: "Reject",
              description: reject.description,
              approval_status: reject.approval_status,
              store: reject.store.name,
            };
          });
          const DataTable = addTableIndex(
            dataReject,
            metadata["x-per-page"],
            metadata["x-page"]
          );
          setDataSrcReject(DataTable);
        });
    }
  }, [currentPage, numPerPage, searchKey, activeTab, refresh]);

  useEffect(() => {
    if (activeTab === Tab.APPROVE.toString()) {
      const params: ProductApprovalParams = {
        page: currentPage,
        perPage: numPerPage,
        keyword: searchKey,
        paginationMetadataStyle: "body",
        status: `${ApprovalStatus.PENDING}`,
        actions: actionsFilter,
      };
      productManagementService
        .getProductPending(params)
        .then(({ data, metadata }) => {
          setTotalItems(metadata["x-total-count"]);
          const dataApproval: DataTypeApproval[] = data.map((approval) => {
            const { productId } = getCateProductName(approval);
            return {
              key: approval.id,
              category: approval.payload.category
                ? approval.payload.category.name
                : "",
              product_id: productId,
              id: approval.id,
              item: approval,
              product_name: approval.payload.name,
              last_update: moment(approval.update_time).format(
                "DD/MM/yyyy HH:mm"
              ),
              merchant_name: approval.store.merchant.name,
              type:
                approval.type === ProductActionType.PUBLISH
                  ? ProductActionType.CREATE
                  : approval.type,
              description: approval.description,
              approval_status: approval.approval_status,
              store: approval.store.name,
            };
          });
          const DataTable = addTableIndex(
            dataApproval,
            metadata["x-per-page"],
            metadata["x-page"]
          );

          setDataSrcApproval(DataTable);
        });
    }
  }, [currentPage, numPerPage, searchKey, activeTab, refresh, actionsFilter]);

  const onChangeTable = async (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    const { current, pageSize } = pagination;
    if (
      (current && current !== currentPage) ||
      (pageSize && pageSize !== numPerPage)
    ) {
      setCurrentPage(current);
      setNumPerPage(pageSize);
    }
  };

  const onFinish = async (value: string) => {
    setSearchKey(value);
    setCurrentPage(1);
  };

  const Tabs = [
    {
      title: "Waiting Approval",
      key: Tab.APPROVE.toString(),
      children: <span>({countWaiting})</span>,
    },
    {
      title: "Approved",
      key: Tab.ACTIVE.toString(),
      children: <span>({countActive})</span>,
    },
    {
      title: "Rejected",
      key: Tab.REJECT.toString(),
      children: <span>({countReject})</span>,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleHideProducts = async (productIds: any[]) => {
    try {
      setLoading(true);
      await productManagementService.hideProduct(productIds);
      setRefresh(refresh + 1);
      message.success("The hide products is successfully");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "The hide products is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowProducts = async (productIds: any[]) => {
    try {
      setLoading(true);
      await productManagementService.showProduct(productIds);
      setRefresh(refresh + 1);
      message.success("The show products is successfully");
    } catch (error) {
      message.error(
        get(error, "response.data.error.message", "The show products is fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const confirm = (textAction: string, productIds: any[]) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure ${textAction} this product?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        if (textAction === "hide") {
          handleHideProducts(productIds);
        } else {
          handleShowProducts(productIds);
        }
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div onClick={() => confirm("hide", selectedRowKeys)}>Hide product</div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={() => confirm("show", selectedRowKeys)}>Show product</div>
      ),
    },
  ];
  const getColumn = useMemo(() => {
    if (activeTab === Tab.APPROVE.toString()) {
      return columnsApproval;
    } else if (activeTab === Tab.ACTIVE.toString()) {
      return columns;
    } else {
      return columnsReject;
    }
  }, [activeTab]);
  const getDataSource = useMemo(() => {
    if (activeTab === Tab.APPROVE.toString()) {
      return dataSrcApproval;
    } else if (activeTab === Tab.ACTIVE.toString()) {
      return dataSrc;
    } else {
      return dataSrcReject;
    }
  }, [activeTab, dataSrc, dataSrcApproval, dataSrcReject]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="product-management-page">
            <TridentityPageHeader title="Product management" />
            <CardContent className="transaction-search">
              <div className="transaction-search-form">
                <Row gutter={30}>
                  <Col span={10}>
                    <ProductSearch
                      onFinish={onFinish}
                      searchResultCount={totalItems}
                    />
                  </Col>
                  <Col span={10}></Col>
                  <Col
                    span={4}
                    style={{ justifyContent: "flex-end", display: "flex" }}
                  >
                    <Dropdown
                      menu={{ items }}
                      placement="bottom"
                      disabled={
                        activeTab === Tab.APPROVE.toString() ||
                        selectedRowKeys.length === 0 ||
                        !doHavePermissionToEdit
                      }
                    >
                      <Button>Config</Button>
                    </Dropdown>
                  </Col>
                </Row>
              </div>
            </CardContent>

            <CardContent>
              <CustomTabs
                tabStyle={"customTab"}
                activeTab={activeTab}
                onChange={handleTabChange}
                tabs={Tabs}
              >
                <div className={"tabContent"}>
                  <SearchTable
                    title={() => (
                      <div className="title-table">Product list</div>
                    )}
                    scroll={{ x: undefined, y: "28vw" }}
                    columns={getColumn}
                    current={currentPage}
                    dataSource={getDataSource}
                    onChange={onChangeTable}
                    totalItems={totalItems}
                    rowKey={"id"}
                    rowSelection={
                      activeTab === Tab.ACTIVE.toString()
                        ? rowSelection
                        : undefined
                    }
                  />
                </div>
              </CustomTabs>
            </CardContent>

            <ConfirmApprove
              open={openConfirmPopup}
              onClose={() => {
                setOpenConfirmPopup(false);
              }}
              onOk={clickConfirmApprove}
            />

            <ConfirmReject
              open={openRejectPopup}
              onOk={clickConfirmReject}
              onClose={() => {
                setOpenRejectPopup(false);
              }}
            />

            <ModalPreviewUpdate
              chosenProduct={chosenProduct}
              open={openModalPreviewUpdate}
              onCancel={() => setOpenModalPreviewUpdate(false)}
            />
            {previewProduct &&
              (previewProduct.type === ProductActionType.UPDATE ||
                previewProduct.type === ProductActionType.CREATE) && (
                <PreviewProduct
                  productBeforeUpdate={previewProduct.product}
                  merchant_store_id={previewProduct.store.id}
                  name={previewProduct.payload.name}
                  images={previewProduct.payload.images}
                  price={previewProduct.price}
                  description={previewProduct.payload.description}
                  hashtags={previewProduct.payload.sub_tags}
                  open={openPreview}
                  onCancel={() => setOpenPreview(false)}
                  attributes={previewProduct.payload.attributes}
                  tag={
                    previewProduct.payload.main_tags &&
                    previewProduct.payload.main_tags.length > 0
                      ? previewProduct.payload.main_tags[0]
                      : ""
                  }
                />
              )}

            {previewProduct &&
              previewProduct.type === ProductActionType.PUBLISH &&
              previewProduct.product && (
                <PreviewProduct
                  merchant_store_id={previewProduct.store.id}
                  name={previewProduct.product.name}
                  images={previewProduct.product.images}
                  price={
                    previewProduct.product.price
                      ? previewProduct.product.price
                      : 0
                  }
                  description={previewProduct.product.description}
                  hashtags={previewProduct.product.sub_tags}
                  open={openPreview}
                  onCancel={() => setOpenPreview(false)}
                  attributes={previewProduct.product.attributes}
                  tag={
                    previewProduct.product.main_tags &&
                    previewProduct.product.main_tags.length > 0
                      ? previewProduct.product.main_tags[0]
                      : ""
                  }
                />
              )}
          </div>
        </>
      )}
    </>
  );
};

export default ProductManagement;
