import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Space, message } from "antd";
import { SelectValue } from "antd/lib/select";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateUpdateMember from "src/components/05.modal/components/CreateUpdateMember/CreateUpdateMember";
import SearchTable from "src/components/11.tables/SearchTable";
import { MemberService } from "src/services/membere-service";
import { PageQueryParams } from "src/services/params-type";
import { ReduxStore } from "src/types/globalStore";

interface Props {
  searchValue: string;
  listOptionsRoles: { value: number; label: string }[];
  tab: string;
  setTotalItemsTable: (value: number) => void;
}
const MemberList: React.FC<Props> = ({
  searchValue,
  tab,
  listOptionsRoles,
  setTotalItemsTable,
}) => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["tri-member-permission"]
  );
  console.log(doHavePermissionToEdit);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminMember[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  } as PageQueryParams);
  const [openModal, setOpenModal] = useState(false);
  const [memberEdit, setMemberEdit] = useState<AdminMember>();

  const memberService = new MemberService();

  async function handleGetListMember() {
    setLoading(true);
    try {
      const result = await memberService.getListMember(params);
      const { data, metadata } = result.data as PaginationData<AdminMember>;
      setData(data);
      setTotalItems(metadata["x-total-count"]);
      if (tab === "member") {
        setTotalItemsTable(metadata["x-total-count"]);
      }
    } catch (error) {
      setData([]);
      setTotalItemsTable(0);
      setTotalItems(0);
    }
    setLoading(false);
  }

  function handleOpenModal(member?: AdminMember) {
    setOpenModal(true);
    if (member) {
      // call api get member by id
      setMemberEdit(member);
    }
  }

  async function deleteMember(memberEdit: AdminMember) {
    message.loading("Deleting member", 1000);
    try {
      await memberService.deleteMember(memberEdit?.id as number);
      message.success("Delete member success");
    } catch (error) {
      message.error("Delete member fail");
      console.log(error);
    } finally {
      message.destroy();
    }
  }

  function handleDeleteMember(memberEdit: AdminMember) {
    Modal.confirm({
      title: "Are you sure delete this member",
      content: "This member will no longer on this list",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteMember(memberEdit);
        await handleGetListMember();
      },
    });
  }

  async function handleToggleStatusMemberOperator(
    value: SelectValue,
    memberEdit: AdminMember
  ) {
    message.loading("Updating member", 1000);
    try {
      await memberService.memberOperatorsActivation(memberEdit?.id as number);
      message.success("Update member success");
      setData((prev) => {
        const index = prev.findIndex((item) => item.id === memberEdit.id);
        const newData = [...prev];
        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            status: value === "active" ? 1 : 0,
          };
        }
        return newData;
      });
    } catch (error) {
      message.error("Update member fail");
      console.log(error);
    } finally {
      message.destroy();
    }
  }

  function handleChangeSelect(value: SelectValue, memberEdit: AdminMember) {
    handleToggleStatusMemberOperator(value, memberEdit);
  }
  function onChangeTable(pagination: TablePaginationConfig) {
    const { current, pageSize } = pagination;
    setParams({
      ...params,
      page: current!,
      perPage: pageSize!,
    });
  }
  function handleClose() {
    setOpenModal(false);
  }

  async function handleSubmit() {
    try {
      await handleGetListMember();
    } catch (error) {
      console.log(error);
    }
    setOpenModal(false);
  }

  useEffect(() => {
    handleGetListMember();
  }, [params]);

  useEffect(() => {
    if (tab === "member") {
      setParams({
        ...params,
        page: 1,
        search: searchValue || "",
      });
    }
  }, [searchValue, tab]);

  const columns: ColumnsType<AdminMember> = [
    {
      title: "No",
      width: 60,
      render: (_, record, index) => (
        <span>{(params.page - 1) * params.perPage + index + 1}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Create Date",
      dataIndex: "create_time",
      key: "create_time",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Previous Role",
      dataIndex: "previous_role",
      key: "previous_role",
      render: (text, record) => {
        return record.roles[1]?.adminRole.name;
      },
    },
    {
      title: "Current Role",
      dataIndex: "current_role",
      key: "current_role",
      render: (text, record) => {
        return record.roles[0]?.adminRole.name;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <span>
          <Select
            disabled={!doHavePermissionToEdit}
            value={text === 1 ? "active" : "deactive"}
            style={{ width: 120 }}
            onChange={(value: SelectValue) => handleChangeSelect(value, record)}
            options={[
              { value: "active", label: <span>Active</span> },
              { value: "deactive", label: <span>Deactive</span> },
            ]}
          />
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Button
            disabled={!doHavePermissionToEdit}
            type="link"
            className="antd-btn-nostyles"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Button
            disabled={!doHavePermissionToEdit}
            type="link"
            className="antd-btn-nostyles"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMember(record)}
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
            <div className="title-table">Member list</div>
            <Button
              disabled={!doHavePermissionToEdit}
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => handleOpenModal()}
            >
              Create New Member
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
      <CreateUpdateMember
        onOpen={openModal}
        onClose={handleClose}
        idMemberEdit={memberEdit}
        onSubmit={handleSubmit}
        listOptionsRoles={listOptionsRoles}
      />
    </>
  );
};

export default MemberList;
