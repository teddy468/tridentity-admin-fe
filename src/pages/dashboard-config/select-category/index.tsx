import { Button, Form, Space } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { useEffect, useState } from "react";
import SearchTable from "src/components/11.tables/SearchTable";
import "./styles.scss";
import { CategoryParams } from "src/services/params-type";
import { CategoryService } from "src/services/category-service";
import { Link, useHistory, useParams } from "react-router-dom";
import { PATHS } from "src/constants/paths";
import CategoryAttributeSearch from "./CategoryAttributeSearch";
import { toast } from "react-toastify";
import { handleError } from "src/helpers/error";
import TridentityPageHeader from "src/components/02.page-header";

const SelectCategory = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  useState<Partial<CategoryItem> | null>(null);
  const history = useHistory();
  const params: any = useParams();
  const index = params.index;
  const categoryService = new CategoryService();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>();
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>();
  const initialValues = {
    search: "",
  };

  const setMenuDashboard = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (index === undefined || index === null) {
      toast.error("Menu index not found", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      setLoading(true);
      const result = await categoryService.setMenuConfig(
        selectedCategoryId,
        index
      );
      if (result.status === 200) {
        toast.success("Set menu successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.goBack();
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        const mess = error?.response?.data?.error?.message.split(" ");
        mess.splice(1, 1, selectedCategoryName);
        toast.error(mess.join(" "), {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        handleError(error);
      }
    } finally {
      setLoading(false);
    }
  };
  const getCategories = async (newParams?: CategoryParams) => {
    setLoading(true);
    try {
      const params: CategoryParams = {
        search_value: keyword || undefined,
        page: currentPage,
        perPage,
        paginationMetadataStyle: "body",
        status: 1,
        ...newParams,
      };
      const result = await categoryService.getCategories(params);
      if (result?.data) {
        const { data, metadata } = result.data as PaginationData<CategoryItem>;
        setCategories(data);
        setTotalItems(metadata["x-total-count"]);
      }
    } catch (error) {
      setCategories([]);
      setTotalItems(0);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategories({ page: 1, perPage, paginationMetadataStyle: "body" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: { search_value: string }) => {
    const { search_value } = values;
    setKeyword(search_value);
    const params: CategoryParams = {
      search_value: search_value || undefined,
      page: 1,
      perPage,
      paginationMetadataStyle: "body",
    };
    await getCategories(params);
  };

  const onChangeTable = async (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    await getCategories({
      perPage: pageSize || perPage,
      page: current || currentPage,
      paginationMetadataStyle: "body",
    });
    if (current && current !== currentPage) {
      setCurrentPage(current);
    }
    if (pageSize && pageSize !== perPage) {
      setPerPage(pageSize);
    }
  };

  const categoryColumns: ColumnsType<CategoryItem> = [
    {
      title: "No",
      render: (_, record, index) => (
        <span>{(currentPage - 1) * perPage + index + 1}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
      render: (text: string, record) => (
        <Link to={PATHS.categoryDetail().replace(":id", record.id.toString())}>
          {text}
        </Link>
      ),
    },
    {
      title: "Subcategory",
      dataIndex: "sub_category_count",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Product",
      dataIndex: "product_count",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Top categories",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            disabled={selectedCategoryId === record.id}
            onClick={() => {
              setSelectedCategoryId(record.id);
              setSelectedCategoryName(record.name);
            }}
          >
            Choose Category{" "}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <TridentityPageHeader
        title="Dashboard config"
        style={{ marginBottom: "30px" }}
      />
      <Form onFinish={onFinish} initialValues={initialValues}>
        <CategoryAttributeSearch onFinish={onFinish} totalItems={totalItems} />
        <div className="panel">
          <SearchTable
            title={() => (
              <div className="table-header">
                <div className="title-table">Category list</div>
              </div>
            )}
            columns={categoryColumns}
            dataSource={categories}
            onChange={onChangeTable}
            totalItems={totalItems}
            rowKey={"id"}
            loading={loading}
          />
          <div className="footer-actions">
            <Button onClick={() => history.goBack()}>Cancel</Button>
            <Button type="primary" onClick={() => setMenuDashboard()}>
              Save
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SelectCategory;
