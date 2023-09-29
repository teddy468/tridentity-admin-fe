import React, { useEffect, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import CategoryAttributeSearch from "../category-and-attribute/CategoryAttributeSearch";
import SearchTable from "src/components/11.tables/SearchTable";
import { Button, Modal, Space, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { PageQueryParams } from "src/services/params-type";
import { MemberService } from "src/services/membere-service";
import CreateUpdateRoles from "src/components/05.modal/components/CreateUpdateRoles/CreateUpdateRoles";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

const PermissionManagement = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["tri-member-permission"]
  );
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRole, setSelectedRole] = useState<AdminRole>();
  const [data, setData] = useState<AdminRole[]>([]);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  } as PageQueryParams);
  const [openModalAddRole, setOpenModalAddRole] = useState(false);
  const memberService = new MemberService();

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setParams({
      ...params,
      page: 1,
      search_value: e.target.value || "",
    });
  }

  function handleOpenModal(role?: AdminRole) {
    setOpenModalAddRole(true);
    if (role) {
      // call api get member by id
      setSelectedRole(role);
    }
  }
  async function deleteRole(role: AdminRole) {
    message.loading("Deleting role", 0);
    try {
      await memberService.roleActivation(role.id);
      message.success("Delete role successfully");
    } catch (error) {
      console.log(error);
      message.error("Delete role failed");
    } finally {
      message.destroy();
    }
  }

  function handleDeleteRole(role: AdminRole) {
    Modal.confirm({
      title: "Are you sure delete this role",
      content: "This role will no longer on this list",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteRole(role);
        await handleGetListRoles();
      },
    });
  }

  function onChangeTable(pagination: TablePaginationConfig) {
    const { current, pageSize } = pagination;
    setParams({
      ...params,
      page: current!,
      perPage: pageSize!,
    });
  }

  async function handleGetListRoles() {
    setLoading(true);
    try {
      const result = await memberService.getListRoles(params);
      const { data, metadata } = result.data as PaginationData<AdminRole>;
      setData(data);
      setTotalItems(metadata["x-total-count"]);
    } catch (error) {
      console.log(error);
      setData([]);
      setTotalItems(0);
    }
    setLoading(false);
  }
  async function onSubmit() {
    try {
      await handleGetListRoles();
    } catch (error) {
      console.log(error);
    }
    setOpenModalAddRole(false);
  }
  useEffect(() => {
    handleGetListRoles();
  }, [params]);

  const columns: ColumnsType<AdminRole> = [
    {
      title: "No",
      width: 60,
      render: (_, record, index) => (
        <span>{(params.page - 1) * params.perPage + index + 1}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Button
            disabled={!doHavePermissionToEdit}
            className="antd-btn-nostyles"
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleOpenModal(record)}
          />
          <Button
            disabled={!doHavePermissionToEdit}
            className="antd-btn-nostyles"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => handleDeleteRole(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <TridentityPageHeader title="Trifood Members" />
      <div className="category-attribute-search  active">
        <CategoryAttributeSearch
          onSearch={onSearch}
          totalItemsTable={totalItems}
        />
      </div>
      <SearchTable
        title={() => (
          <div className="table-header">
            <div className="title-table">Member list</div>
            <Button
              disabled={!doHavePermissionToEdit}
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => handleOpenModal()}
            >
              Create Role
            </Button>
          </div>
        )}
        columns={columns}
        dataSource={data}
        onChange={onChangeTable}
        rowKey={"id"}
        loading={loading}
        totalItems={totalItems}
        pageSize={params.perPage}
        current={params.page}
      />

      <CreateUpdateRoles
        rolerEdit={selectedRole}
        onOpen={openModalAddRole}
        onClose={() => setOpenModalAddRole(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default PermissionManagement;
