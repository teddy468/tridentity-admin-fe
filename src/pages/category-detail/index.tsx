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
import { useParams } from "react-router-dom";
import TridentityPageHeader from "src/components/02.page-header";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

const CategoryDetail = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["category-and-attribute-permission"]
  );
  const { id } = useParams<{ id: string }>();
  const [categoryDetail, setCategoryDetail] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<(any | null)[][]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryOnEdit, setCategoryOnEdit] =
    useState<Partial<CategoryItem> | null>(null);
  const [categoryOnDelete, setCategoryOnDelete] =
    useState<Partial<CategoryItem> | null>(null);
  const categoryService = new CategoryService();

  const getCategoryDetail = async () => {
    setLoading(true);
    try {
      const { data } = await categoryService.getCategoryDetail(Number(id));
      setCategoryDetail(data);
      if (data.children.length > 0) {
        // const childCate
        const dataTable = data.children.map((item: any) => {
          return [item, ...item.children];
        });
        setSubCategories(dataTable);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategoryDetail();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<(Category | null)[]> = [
    {
      title: "Subcategory level 1",
      dataIndex: "name_level_1",
      key: "name",
      render: (text, record) => {
        return (
          <div className="cell">
            {record[0]?.name}
            {record[0] && (
              <Space>
                <Button
                  disabled={!doHavePermissionToEdit}
                  icon={<PlusCircleOutlined />}
                  type="link"
                  onClick={() =>
                    setCategoryOnEdit({ parent_category_id: record[0]?.id })
                  }
                />
                <Button
                  disabled={!doHavePermissionToEdit}
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => setCategoryOnEdit(record[0])}
                />
                <Button
                  disabled={!doHavePermissionToEdit}
                  icon={<DeleteOutlined />}
                  danger
                  type="link"
                  onClick={() => setCategoryOnDelete(record[0])}
                />
              </Space>
            )}
          </div>
        );
      },
    },
    {
      title: "Subcategory level 2",
      dataIndex: "name_level_2",
      render: (text, record) => (
        <div className="cell">
          {record[1]?.name}
          {record[1] && (
            <Space>
              <Button
                disabled={!doHavePermissionToEdit}
                icon={<EditOutlined />}
                type="link"
                onClick={() => setCategoryOnEdit(record[1])}
              />
              <Button
                disabled={!doHavePermissionToEdit}
                icon={<DeleteOutlined />}
                danger
                type="link"
                onClick={() => setCategoryOnDelete(record[1])}
              />
            </Space>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <TridentityPageHeader title={"Sub Category"} backIcon={true} />
      <SearchTable
        title={() => (
          <div className="table-header">
            <div className="title-table">{categoryDetail?.name || ""}</div>
            <Button
              disabled={!doHavePermissionToEdit}
              icon={<PlusOutlined />}
              type="primary"
              onClick={() =>
                setCategoryOnEdit({ parent_category_id: Number(id) })
              }
            >
              Add subcategory
            </Button>
          </div>
        )}
        columns={columns}
        dataSource={subCategories}
        totalItems={subCategories.length}
        rowKey={"id"}
        loading={loading}
        bordered
      />
      <CreateUpdateCategoryModal
        onEdit={categoryOnEdit}
        onClose={() => setCategoryOnEdit(null)}
        onSubmit={() => {
          setCategoryOnEdit(null);
          getCategoryDetail();
        }}
      />
      <DeleteCategoryModal
        onDelete={categoryOnDelete}
        onClose={() => setCategoryOnDelete(null)}
        onSubmit={() => {
          setCategoryOnDelete(null);
          getCategoryDetail();
        }}
      />
    </>
  );
};

export default CategoryDetail;
