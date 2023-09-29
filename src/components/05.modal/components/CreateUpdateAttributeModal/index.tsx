import "./styles.scss";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  message,
  Radio,
} from "antd";
import { ERRORS } from "src/constants/messages";
import { useCallback, useEffect, useState } from "react";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { AttributeService } from "src/services/attribute-service";
import { AxiosError } from "axios";

export interface Props {
  onEdit: Partial<AttributeItem> | null;
  onClose: () => void;
  onSubmit: () => void;
}

declare interface CreateUpdateAttributeValues {
  name: string;
  description: string;
  is_required: boolean;
  is_multiple_choice: boolean;
}

const CreateUpdateAttributeModal = (props: Props) => {
  const { onEdit, onClose, onSubmit } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<CreateUpdateAttributeValues>();
  const attributeService = new AttributeService();

  const handleReset = useCallback(() => {
    form.resetFields();
    form.setFieldsValue({
      name: onEdit?.name || "",
      is_required: onEdit?.is_required ?? false,
      is_multiple_choice: onEdit?.is_multiple_choice ?? true,
    });
  }, [form, onEdit]);

  useEffect(handleReset, [handleReset]);

  const handleSubmit = async (values: CreateUpdateAttributeValues) => {
    setLoading(true);
    try {
      const body: CreateUpdateAttributeBody = {
        ...values,
      };
      await (onEdit?.id
        ? attributeService.updateAttribute(onEdit.id, body)
        : attributeService.createAttribute(body));
      message.success(
        `${onEdit?.id ? "Update" : "Create"} attribute successfuly`
      );
      onSubmit();
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const messageText =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : `${onEdit?.id ? "Edit" : "Create"} attribute failed`;
      message.error(messageText);
    }
    setLoading(false);
  };

  const onFinishFailed = (
    errorInfo: ValidateErrorEntity<CreateUpdateAttributeValues>
  ) => {
    const namePath = errorInfo.errorFields[0].name;
    form.getFieldInstance(namePath)?.focus();
  };

  return (
    <Modal
      className="create-update-attribute-modal"
      open={!!onEdit}
      onCancel={onClose}
      title={`${onEdit?.id ? "Edit" : "Create new"} Attribute`}
      footer={false}
    >
      <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
        <Form.Item
          name="name"
          label="Attribute name"
          rules={[{ required: true, message: ERRORS.REQUIRED }]}
          labelCol={{ span: 24 }}
        >
          <Input placeholder="Attribute name" />
        </Form.Item>
        <Row>
          <Col md={12} sm={24}>
            <Form.Item dependencies={["is_multiple_choice", "is_required"]}>
              {({ setFieldsValue, getFieldValue }) => (
                <Form.Item name="is_required">
                  <Radio
                    checked={getFieldValue("is_required")}
                    onChange={(e) =>
                      setFieldsValue({
                        is_multiple_choice: false,
                        is_required: e.target.checked,
                      })
                    }
                  >
                    Required
                  </Radio>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item dependencies={["is_required", "is_multiple_choice"]}>
              {({ setFieldsValue, getFieldValue }) => (
                <Form.Item name="is_multiple_choice">
                  <Radio
                    checked={getFieldValue("is_multiple_choice")}
                    onChange={(e) =>
                      setFieldsValue({
                        is_required: false,
                        is_multiple_choice: e.target.checked,
                      })
                    }
                  >
                    Multiple selection
                  </Radio>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>
        <div className="create-update-attribute-action">
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {onEdit?.id ? "Confirm" : "Create Attribute"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateAttributeModal;
