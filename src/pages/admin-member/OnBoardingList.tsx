import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, message } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { get, set } from "lodash";
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
const OnBoardingList: React.FC<Props> = ({
  searchValue,
  tab,
  listOptionsRoles,
  setTotalItemsTable,
}) => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["tri-member-permission"]
  );
  const [loading, setLoading] = useState(false);
  const [data, setDate] = useState<AdminMember[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
    status: "pending",
  } as PageQueryParams);
  const [openModal, setOpenModal] = useState(false);
  const [memberEdit, setMemberEdit] = useState<AdminMember>();
  const memberService = new MemberService();

  async function handleGetListMember() {
    setLoading(true);
    try {
      const result = await memberService.getListMemberOnboard(params);
      const { data, metadata } = result.data as PaginationData<AdminMember>;
      setDate(data);
      setTotalItems(metadata["x-total-count"]);
      if (tab === "onBoard") {
        setTotalItemsTable(metadata["x-total-count"]);
      }
    } catch (error) {
      setDate([]);
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
    message.loading("Deleting member", 0);
    try {
      await memberService.deleteMemberOnboard(memberEdit?.id as number);
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
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Role",
      dataIndex: "current_role",
      key: "current_role",
      render: (text, record) => <span>{record.admin_role.name}</span>,
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

  useEffect(() => {
    handleGetListMember();
  }, [params]);

  useEffect(() => {
    if (tab === "onBoard") {
      setParams({
        ...params,
        page: 1,
        search: searchValue || "",
      });
    }
  }, [searchValue, tab]);
  return (
    <>
      <SearchTable
        title={() => (
          <div className="table-header">
            <div className="title-table">Member list</div>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => handleOpenModal()}
              disabled={!doHavePermissionToEdit}
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
        listOptionsRoles={listOptionsRoles}
        onOpen={openModal}
        onClose={handleClose}
        idMemberEdit={memberEdit}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default OnBoardingList;
