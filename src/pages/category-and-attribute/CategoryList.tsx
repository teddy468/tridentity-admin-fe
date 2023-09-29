import { Button, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import SearchTable from "src/components/11.tables/SearchTable";
import "./styles.scss";
import { CategoryService } from "src/services/category-service";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CreateUpdateCategoryModal from "src/components/05.modal/components/CreateUpdateCategoryModal";
import DeleteCategoryModal from "src/components/05.modal/components/DeleteCategoryModal";
import { Link } from "react-router-dom";
import { PATHS } from "src/constants/paths";
import useDataTable from "src/hooks/useDataTable";

interface Props {
  search: string;
  setTotalItemsTable: (total: number) => void;
  tab: string;
  doHavePermissionToEdit: boolean;
}

const CategoryList = ({
  search,
  setTotalItemsTable,
  tab,
  doHavePermissionToEdit,
}: Props) => {
  const [onEdit, setOnEdit] = useState<Partial<CategoryItem> | null>(null);
  const [onDelete, setOnDelete] = useState<Partial<CategoryItem> | null>(null);
  const categoryService = new CategoryService();
  const { dataSrc, loading, params, metadata, fetchData, onChangeTable } =
    useDataTable(categoryService.getCategories);

  useEffect(() => {
    if (tab === "category") fetchData({ ...params, search: search });
  }, [search, params, tab]);
  useEffect(() => {
    if (tab === "category") {
      setTotalItemsTable(metadata?.["x-total-count"] || 0);
    }
  }, [setTotalItemsTable, tab, metadata]);

  const columns: ColumnsType<CategoryItem> = [
    {
      title: "No",
      render: (_, record, index) => (
        <span>
          {(metadata["x-page"] - 1) * metadata["x-per-page"] + index + 1}
        </span>
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
      dataIndex: "childrenCount",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Product",
      dataIndex: "productCount",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Button
            disabled={!doHavePermissionToEdit}
            icon={<PlusCircleOutlined />}
            type="link"
            onClick={() => setOnEdit({ parent_category_id: record.id })}
          />
          <Button
            disabled={!doHavePermissionToEdit}
            icon={<EditOutlined />}
            type="link"
            onClick={() => setOnEdit(record)}
          />
          <Button
            disabled={!doHavePermissionToEdit}
            icon={<DeleteOutlined />}
            danger
            type="link"
            onClick={() => setOnDelete(record)}
          />
        </Space>
      ),
    },
  ];
  return (
    <>
      <SearchTable
        title={() => (
          <div className="table-header">
            <div className="title-table">Category list</div>
            <Button
              disabled={!doHavePermissionToEdit}
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setOnEdit({})}
            >
              Create New
            </Button>
          </div>
        )}
        columns={columns}
        dataSource={dataSrc}
        onChange={onChangeTable}
        rowKey={"id"}
        loading={loading}
        totalItems={metadata?.["x-total-count"]}
        pageSize={metadata?.["x-per-page"]}
        current={metadata?.["x-page"]}
      />
      <CreateUpdateCategoryModal
        onEdit={onEdit}
        onClose={() => setOnEdit(null)}
        onSubmit={() => {
          setOnEdit(null);
          fetchData(params);
        }}
      />
      <DeleteCategoryModal
        onDelete={onDelete}
        onClose={() => setOnDelete(null)}
        onSubmit={() => {
          setOnDelete(null);
          const page =
            metadata["x-total-count"] <=
            (metadata["x-page"] - 1) * metadata["x-per-page"] + 1
              ? metadata["x-page"] - 1
              : metadata["x-page"];
          fetchData({ ...params, page });
        }}
      />
    </>
  );
};

export default CategoryList;
