import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import "../CreateUpdateCategoryModal/styles.scss";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { AdminPermission } from "src/types/globalStore";
import SearchTable from "src/components/11.tables/SearchTable";
import { ColumnsType } from "antd/lib/table";
import { render } from "@testing-library/react";
import { ADMIN_PERMISSION } from "src/constants";
import { MemberService } from "src/services/membere-service";

declare interface CreateUpdateRoleValues {
  name: string;
  description: string;
  "user-management": ADMIN_PERMISSION;
  notification: ADMIN_PERMISSION;
  "category-and-attribute": ADMIN_PERMISSION;
  "product-management": ADMIN_PERMISSION;
  "dashboard-config": ADMIN_PERMISSION;
  "settlement-report": ADMIN_PERMISSION;
  parameters: ADMIN_PERMISSION;
  "email-template": ADMIN_PERMISSION;
  report: ADMIN_PERMISSION;
  "lp-management": ADMIN_PERMISSION;
  "tri-member": ADMIN_PERMISSION;
  "logistic-fee": ADMIN_PERMISSION;
}
declare interface Props {
  onOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  rolerEdit?: AdminRole;
}
const CreateUpdateRoles: React.FC<Props> = (props) => {
  const { onOpen, onClose, onSubmit, rolerEdit } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<CreateUpdateRoleValues>();
  const memberService = new MemberService();

  async function handleUpdateRole(values: CreateUpdateRoleValues) {
    const bodyRole = {
      name: values.name,
      description: values.description,
    };

    const authorities = {
      "user-management": values["user-management"],
      notification: values["notification"],
      "category-and-attribute": values["category-and-attribute"],
      "product-management": values["product-management"],
      "dashboard-config": values["dashboard-config"],
      "settlement-report": values["settlement-report"],
      parameters: values["parameters"],
      "email-template": values["email-template"],
      report: values["report"],
      "lp-management": values["lp-management"],
      "tri-member": values["tri-member"],
      "logistic-fee": values["logistic-fee"],
    };
    setLoading(true);
    try {
      const { data } = await memberService.editRole(rolerEdit!.id, bodyRole);

      await memberService.upsertRolePermission(data.id, { authorities });

      onSubmit();
      message.success("Update role success");
    } catch (error) {
      console.log(error);
      message.error("Update role fail");
    }
    setLoading(false);
    form.resetFields();
  }

  async function handleCreatRole(values: CreateUpdateRoleValues) {
    const bodyRole = {
      name: values.name,
      description: values.description,
    };
    const authorities = {
      "user-management": values["user-management"],
      notification: values["notification"],
      "category-and-attribute": values["category-and-attribute"],
      "product-management": values["product-management"],
      "dashboard-config": values["dashboard-config"],
      "settlement-report": values["settlement-report"],
      parameters: values["parameters"],
      "email-template": values["email-template"],
      report: values["report"],
      "lp-management": values["lp-management"],
      "tri-member": values["tri-member"],
      "logistic-fee": values["logistic-fee"],
    };
    setLoading(true);
    try {
      const { data } = await memberService.addNewRole(bodyRole);

      await memberService.upsertRolePermission(data.id, { authorities });

      onSubmit();
      message.success("Create role success");
    } catch (error) {
      console.log(error);
      message.error("Create role fail");
    }
    setLoading(false);
    form.resetFields();
  }

  async function handleSubmit(values: CreateUpdateRoleValues) {
    if (rolerEdit) {
      handleUpdateRole(values);
    } else {
      handleCreatRole(values);
    }
  }

  function handleCloseModal() {
    onClose();
    form.resetFields();
  }

  function onFinishFailed(errorInfo: ValidateErrorEntity) {
    console.log("Failed:", errorInfo);
  }

  async function handleGetRolePermissionDetail() {
    try {
      const { data } = await memberService.getRoleDetail(rolerEdit!.id);
      form.setFieldsValue({
        ...data.authorities,
        name: rolerEdit!.name,
        description: rolerEdit!.description,
      });
    } catch (error) {
      message.error("Get role detail fail");
      console.log(error);
    }
  }

  useEffect(() => {
    if (rolerEdit) {
      handleGetRolePermissionDetail();
    }
  }, [rolerEdit]);
  const data = [
    {
      id: 1,
      permission: "user-management",
      title: "User management",
    },
    { id: 2, permission: "notification", title: "Notification" },
    {
      id: 3,
      permission: "category-and-attribute",
      title: "Category & Attribute",
    },
    {
      id: 4,
      permission: "product-management",
      title: "Product management",
    },
    {
      id: 5,
      permission: "dashboard-config",
      title: "Dashboard config",
    },
    {
      id: 6,
      permission: "settlement-report",
      title: "Reconiliation",
    },
    { id: 7, permission: "parameters", title: "Parameters" },
    {
      id: 8,
      permission: "email-template",
      title: "Email template",
    },
    { id: 9, permission: "report", title: "Report" },
    { id: 10, permission: "lp-management", title: "LP Management" },
    { id: 11, permission: "tri-member", title: "Trifood Member" },
    { id: 12, permission: "logistic-fee", title: "Logistic Fee" },
  ];
  const columns: ColumnsType<{ id: number; permission: string }> = [
    {
      title: "No",
      width: 60,
      render: (value, record, index) => index + 1,
    },
    {
      title: "Permission",
      key: "title",
      dataIndex: "title",
      render: (value, record, index) => <>{value}</>,
    },
    {
      title: "Action",
      key: "action",

      render: (value, record, index) => {
        return (
          <>
            <Form.Item
              name={record.permission}
              rules={[
                {
                  required: true,
                  message: "Please select permission",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Select
                style={{ width: 120 }}
                placeholder="Select Member Role"
                options={[
                  { value: ADMIN_PERMISSION.View, label: <span>View</span> },
                  { value: ADMIN_PERMISSION.Edit, label: <span>Edit</span> },
                  {
                    value: ADMIN_PERMISSION.NoPermission,
                    label: <span>Disable</span>,
                  },
                ]}
              />
            </Form.Item>
          </>
        );
      },
    },
  ];
  return (
    <Modal
      className="create-update-category-modal"
      open={onOpen}
      onCancel={handleCloseModal}
      title={`${rolerEdit ? "Edit" : "Create"} Role`}
      footer={false}
    >
      <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
        <Form.Item
          name="name"
          label={"Role Name"}
          rules={[
            {
              required: true,
              max: 100,
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <Input
            placeholder={"Enter Role Name"}
            onBlur={(e) => {
              form.setFieldsValue({
                name: e.target.value.trim(),
              });
            }}
            maxLength={100}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={"Role description"}
          rules={[
            {
              required: false,
              max: 100,
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <Input
            placeholder={`Enter role description`}
            onBlur={(e) => {
              form.setFieldsValue({
                description: e.target.value.trim(),
              });
            }}
            maxLength={100}
          />
        </Form.Item>

        <div>
          <SearchTable
            columns={columns}
            dataSource={data}
            pageSize={data.length}
          />
        </div>

        <div className="create-update-category-action">
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {rolerEdit ? "Update" : "Create Role"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateRoles;
