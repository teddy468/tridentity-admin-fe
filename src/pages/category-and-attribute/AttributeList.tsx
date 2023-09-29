import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Space, Radio } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { useEffect, useState } from "react";
import CreateUpdateAttributeModal from "src/components/05.modal/components/CreateUpdateAttributeModal";
import DeleteAttributeModal from "src/components/05.modal/components/DeleteAttributeModal";
import SearchTable from "src/components/11.tables/SearchTable";
import { AttributeService } from "src/services/attribute-service";
import { AttributeParams } from "src/services/params-type";
import "./styles.scss";

interface Props {
  setTotalItemsTable: (total: number) => void;
  search: string;
  tab: string;
  doHavePermissionToEdit: boolean;
}
const AttributeList: React.FC<Props> = ({
  search,
  setTotalItemsTable,
  tab,
  doHavePermissionToEdit,
}) => {
  const [data, setData] = useState<AttributeItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onSearch, setOnEdit] = useState<Partial<CategoryItem> | null>(null);
  const [onDelete, setOnDelete] = useState<Partial<CategoryItem> | null>(null);

  const attributeService = new AttributeService();

  const getAttributes = async (newParams?: Partial<AttributeParams>) => {
    setLoading(true);
    try {
      const params: AttributeParams = {
        page: currentPage,
        perPage,
        paginationMetadataStyle: "body",
        ...newParams,
      };
      const result = await attributeService.getAttributes(params);

      if (result?.data) {
        const { data, metadata } = result.data as PaginationData<AttributeItem>;
        setData(data);
        setTotalItems(metadata["x-total-count"]);
        if (params.page && currentPage !== params.page)
          setCurrentPage(params.page);
      }
    } catch (error) {
      setData([]);
      setTotalItems(0);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAttributes({
      page: 1,
      search_value: search || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  useEffect(() => {
    if (tab === "attribute") {
      setTotalItemsTable(totalItems);
    }
  }, [tab, totalItems, setTotalItemsTable]);
  const handleUpdateAttribute = async (item: AttributeItem) => {
    setLoading(true);
    try {
      console.log(item);
      await attributeService.updateAttribute(item.id, item);
      message.success("Update attribute successfuly");
      await getAttributes();
    } catch {}
  };

  const onChangeTable = async (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    await getAttributes({
      perPage: pageSize || perPage,
      page: current || currentPage,
      search_value: search || undefined,
    });
    if (current && current !== currentPage) {
      setCurrentPage(current);
    }
    if (pageSize && pageSize !== perPage) {
      setPerPage(pageSize);
    }
  };

  const columns: ColumnsType<AttributeItem> = [
    {
      title: "No",
      render: (_, record, index) => (
        <span>{(currentPage - 1) * perPage + index + 1}</span>
      ),
    },
    {
      title: "Attribute name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Required",
      dataIndex: "is_required",
      render: (checked, item) => (
        <Radio
          name="attribute"
          checked={checked}
          onChange={() =>
            handleUpdateAttribute({
              ...item,
              is_multiple_choice: false,
              is_required: !checked,
            })
          }
        />
      ),
    },
    {
      title: "Multiple selection",
      dataIndex: "is_multiple_choice",
      render: (checked, item) => (
        <Radio
          name="attribute"
          checked={checked}
          onChange={() =>
            handleUpdateAttribute({
              ...item,
              is_required: false,
              is_multiple_choice: !checked,
            })
          }
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
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
            <div className="title-table">Attribute list</div>
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
        dataSource={data}
        onChange={onChangeTable}
        rowKey={"id"}
        loading={loading}
        totalItems={totalItems}
        pageSize={perPage}
        current={currentPage}
      />
      <CreateUpdateAttributeModal
        onEdit={onSearch}
        onClose={() => setOnEdit(null)}
        onSubmit={() => {
          setOnEdit(null);
          getAttributes();
        }}
      />
      <DeleteAttributeModal
        onDelete={onDelete}
        onClose={() => setOnDelete(null)}
        onSubmit={() => {
          setOnDelete(null);
          console.log({ totalItems, currentPage, perPage });
          const page =
            totalItems <= (currentPage - 1) * perPage + 1
              ? currentPage - 1
              : currentPage;
          getAttributes({ page });
          setCurrentPage(page);
        }}
      />
    </>
  );
};

export default AttributeList;
