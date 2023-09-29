import { useEffect, useMemo, useState } from "react";

import "./styles.scss";
import { Button, Form, Modal, Rate } from "antd";
import { ColumnsType } from "antd/lib/table";
import ProductSearch from "./ProductSearch";
import SearchTable from "src/components/11.tables/SearchTable";
import CardContent from "src/routes/components/CardContent";
import { productManagementService } from "src/services/product-management";
import { Product, ProductParams } from "src/types/Product";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import { handleError } from "src/helpers/error";
import TridentityPageHeader from "src/components/02.page-header";
import { addTableIndex } from "src/helpers";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const SelectProduct = () => {
  const [currentTopSellingDished, setCurrentTopSellingDished] = useState<
    { product_id: number; position: number; product_name: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(2);
  const [numPerPage, setNumberPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const history = useHistory();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>();
  const [dataSrc, setDataSrc] = useState<Product[]>([]);
  const params: any = useParams();
  const index = params.index;

  const columns: ColumnsType<Product> = [
    {
      title: "No",
      dataIndex: "indexTable",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Product ID",
      dataIndex: "id",
      render: (text, record) => <span>{text}</span>,
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
      render: (text) => <span>{text?.merchant?.name}</span>,
    },
    {
      title: "Rating & Review",
      dataIndex: "rating",
      render: (text) => (
        <span>
          <Rate disabled value={text} />
        </span>
      ),
      sorter: true,
    },
    {
      title: "Top Dish",
      dataIndex: "topdish",
      render: (text, record) => (
        <Button
          onClick={() => setSelectedProduct(record)}
          type="primary"
          disabled={record.id === selectedProduct?.id}
        >
          Choose Dish
        </Button>
      ),
    },
  ];

  const getProductDashboardSetting = async () => {
    try {
      const result = await productManagementService.getProductDashboardConfig(
        "top_selling"
      );
      if (result.status === 200) {
        setCurrentTopSellingDished(
          result.data.map((item: ProductItemConfig) => ({
            product_id: item.product!.id,
            position: item.position,
            product_name: item.product!.name,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProductDashboardSetting();
  }, []);
  useEffect(() => {
    const params: ProductParams = {
      page: currentPage,
      perPage: numPerPage,
      keyword: searchKey,
      paginationMetadataStyle: "body",
    };
    productManagementService.getProduct(params).then((res) => {
      setTotalItems(res?.metadata["x-total-count"]);
      const dataTable = addTableIndex(
        res?.data,
        res?.metadata["x-per-page"],
        res?.metadata["x-page"]
      );
      setDataSrc(dataTable);
    });
  }, [currentPage, numPerPage, searchKey]);

  async function handleAddNewItem(
    listNewDishes: {
      product_id: number;
      position: number;
      product_name: string;
    }[]
  ) {
    try {
      const result = await productManagementService.setProductDashboardConfig(
        "top_selling",
        listNewDishes.sort((a, b) => a.position - b.position)
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
  const isEditPosition = useMemo(() => {
    if (
      currentTopSellingDished.findIndex(
        (item) => item.position === Number(index)
      ) !== -1
    ) {
      return true;
    } else {
      return false;
    }
  }, [currentTopSellingDished]);
  const setTopSellingDish = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product", {
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

    if (!isEditPosition) {
      // case new position is empty - case selected dish is not in list
      if (
        currentTopSellingDished.findIndex(
          (item) => item.product_id === selectedProduct.id
        ) === -1
      ) {
        const newListItem = [
          ...currentTopSellingDished,
          {
            product_id: selectedProduct.id,
            position: Number(index),
            product_name: selectedProduct.name,
          },
        ];
        Modal.confirm({
          title: "Do you want add new top selling dish?",
          icon: <ExclamationCircleOutlined />,
          content: ``,
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            handleAddNewItem(newListItem);
          },
        });
        return;
      } else {
        // case new position is empty - case selected dish is in list
        const newListItem = currentTopSellingDished.filter(
          (item) => item.product_id !== selectedProduct.id
        );
        newListItem.push({
          product_id: selectedProduct.id,
          position: Number(index),
          product_name: selectedProduct.name,
        });

        Modal.confirm({
          title: "Do you want add new top selling dish?",
          icon: <ExclamationCircleOutlined />,
          content: ``,
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            handleAddNewItem(newListItem);
          },
        });
      }
    } else {
      // case edit position - case new selected dish is not in list
      if (
        currentTopSellingDished.findIndex(
          (item) => item.product_id === selectedProduct.id
        ) === -1
      ) {
        const newListItem = currentTopSellingDished.map((item) => {
          if (item.position === Number(index)) {
            return {
              product_id: selectedProduct.id,
              position: Number(index),
              product_name: selectedProduct.name,
            };
          } else {
            return item;
          }
        });
        Modal.confirm({
          title: `Do you want replace ${index} position with new top selling dish? `,
          icon: <ExclamationCircleOutlined />,
          content: ``,
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            handleAddNewItem(newListItem);
          },
        });
        return;
      }
      // case edit position - case selected dish is in list
      if (
        currentTopSellingDished.findIndex(
          (item) => item.product_id === selectedProduct.id
        ) !== -1
      ) {
        const newItem = currentTopSellingDished.find(
          (item) => item.product_id === selectedProduct.id
        );

        const oldItem = currentTopSellingDished.find(
          (item) => item.position === Number(index)
        );

        const newListItem = currentTopSellingDished.map((item) => {
          if (item.product_id === selectedProduct.id) {
            // swap position
            return {
              product_id: selectedProduct.id,
              position: Number(index),
              product_name: selectedProduct.name,
            };
          }
          if (item.position === Number(index)) {
            // swap position
            return {
              product_id: item.product_id,
              position: newItem!.position,
              product_name: item.product_name,
            };
          }
          return item;
        });
        Modal.confirm({
          title: `Do you want to swap position of ${oldItem?.product_name} with ${newItem?.product_name} dish ? `,
          icon: <ExclamationCircleOutlined />,
          content: ``,
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            handleAddNewItem(newListItem);
          },
        });
        return;
      }
    }
  };

  const onChangeTable = async (pagination: any) => {
    setNumberPerPage(pagination.pageSize);
    const { current } = pagination;
    if (current && current !== currentPage) {
      await Promise.all([setCurrentPage(current)]);
    }
  };

  const initialValues = {
    typeSearch: "all",
    vaultId: "all",
  };

  const onFinish = async (values: any) => {
    setSearchKey(values.keyword);
    setCurrentPage(1);
  };

  return (
    <div>
      <TridentityPageHeader title="Dashboard config" />
      <Form
        onFinish={onFinish}
        initialValues={initialValues}
        className="product-management-page"
      >
        <CardContent className="transaction-search">
          <div
            style={{ fontSize: "16px", fontWeight: 500, marginBottom: "30px" }}
          >
            Top Dish
          </div>
          <ProductSearch onFinish={onFinish} totalItems={totalItems} />
          <div className="panel">
            <CardContent>
              {dataSrc.length ? (
                <SearchTable
                  title={() => <div className="title-table">Product list</div>}
                  columns={columns}
                  dataSource={dataSrc}
                  onChange={onChangeTable}
                  totalItems={totalItems}
                  rowKey={"id"}
                />
              ) : (
                <div>No Data</div>
              )}
            </CardContent>
            <div className="footer-actions">
              <Button onClick={() => history.goBack()}>Cancel</Button>
              <Button type="primary" onClick={() => setTopSellingDish()}>
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Form>
    </div>
  );
};

export default SelectProduct;
