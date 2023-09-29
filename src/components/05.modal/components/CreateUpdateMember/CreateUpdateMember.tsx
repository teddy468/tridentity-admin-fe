import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import "../CreateUpdateCategoryModal/styles.scss";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { MemberService } from "src/services/membere-service";
import { use } from "i18next";
import { useDispatch } from "react-redux";
import { setAdminRoleId } from "src/store/actions/user";

declare interface CreateUpdateMemberValues {
  name: string;
  email: string;
  admin_role_id: any;
}
declare interface Props {
  onOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  idMemberEdit?: AdminMember;
  listOptionsRoles: { value: number; label: string }[];
}
const CreateUpdateMember: React.FC<Props> = (props) => {
  const { onOpen, onClose, onSubmit, idMemberEdit, listOptionsRoles } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<CreateUpdateMemberValues>();
  const memberService = new MemberService();
  const dispatch = useDispatch();

  async function updateMember(
    values: CreateUpdateMemberValues,
    idMemberEdit: AdminMember
  ) {
    setLoading(true);
    const body = {
      first_name: values.name,
      email: values.email,
      admin_role_id: values.admin_role_id,
    };
    try {
      await memberService.editMemberOperators(idMemberEdit.id, body);
      dispatch(setAdminRoleId(values.admin_role_id));
      message.success("Update member success");
      onSubmit();
    } catch (error) {
      console.log(error);
      message.error("Edit member fail");
    } finally {
      setLoading(false);
    }
  }
  async function handleSubmit(values: CreateUpdateMemberValues) {
    try {
      if (idMemberEdit) {
        await updateMember(values, idMemberEdit);
      } else {
        await createNewMember(values);
      }
    } catch (error) {}
  }
  async function createNewMember(values: CreateUpdateMemberValues) {
    setLoading(true);
    const body = {
      name: values.name,
      email: values.email,
      admin_role_id: values.admin_role_id,
    };
    try {
      await memberService.addNewMember(body);
      message.success("Add member success");
      onSubmit();
    } catch (error) {
      console.log(error);
      message.error("Add member fail");
    } finally {
      setLoading(false);
    }
  }

  function onFinishFailed(errorInfo: ValidateErrorEntity) {
    console.log("Failed:", errorInfo);
  }

  function handleCloseModal() {
    onClose();
    form.resetFields();
  }

  useEffect(() => {
    if (idMemberEdit) {
      if (idMemberEdit.admin_role?.name) {
        form.setFieldsValue({
          name: idMemberEdit.name,
          email: idMemberEdit.email,
          admin_role_id: idMemberEdit.admin_role.name,
        });
        return;
      }

      if (idMemberEdit.roles.at(0)?.adminRole.name) {
        form.setFieldsValue({
          name: idMemberEdit.first_name,
          email: idMemberEdit.email,
          admin_role_id: idMemberEdit.roles.at(0)?.adminRole.name,
        });
        return;
      }
    }
  }, [idMemberEdit]);
  return (
    <Modal
      className="create-update-category-modal"
      open={onOpen}
      onCancel={handleCloseModal}
      title={`${idMemberEdit ? "Edit" : "Add"} Member`}
      footer={false}
    >
      <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
        <Form.Item
          name="name"
          label={"Full Name"}
          rules={[
            {
              required: true,
              max: 100,
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <Input
            placeholder={"Enter Member Name"}
            onBlur={(e) => {
              form.setFieldsValue({
                name: e.target.value.trim(),
              });
            }}
            maxLength={100}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label={"Email"}
          rules={[
            {
              required: true,
              max: 100,
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <Input
            type="email"
            placeholder={`Enter Member Email`}
            onBlur={(e) => {
              form.setFieldsValue({
                email: e.target.value.trim(),
              });
            }}
            maxLength={100}
          />
        </Form.Item>
        <Form.Item
          name="admin_role_id"
          label={`${idMemberEdit ? "Edit member role" : "Add member role"} `}
          rules={[
            {
              required: true,
              message: "Please select role",
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <Select options={listOptionsRoles} placeholder="Select Member Role" />
        </Form.Item>
        <div className="create-update-category-action">
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {idMemberEdit ? "Update" : "Add Member"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateMember;
