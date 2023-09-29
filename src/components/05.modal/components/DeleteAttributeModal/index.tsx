import "./styles.scss";
import { Button, Modal, message } from "antd";
import { useState } from "react";
import { AttributeService } from "src/services/attribute-service";
import { AxiosError } from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export interface Props {
  onDelete: Partial<AttributeItem> | null;
  onClose: () => void;
  onSubmit: () => void;
}

const DeleteAttributeModal = (props: Props) => {
  const { onDelete, onClose, onSubmit } = props;
  const [loading, setLoading] = useState(false);
  const attributeService = new AttributeService();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (onDelete?.id) await attributeService.deleteAttribute(onDelete.id);
      message.success("Delete attribute successfully");
      onSubmit();
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const messageText =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Delete attribute failed";
      message.error(messageText);
    }
    setLoading(false);
  };

  return (
    <Modal
      className="delete-attribute-modal"
      open={!!onDelete}
      onCancel={onClose}
      title={
        <>
          <ExclamationCircleOutlined
            color="#FAAD14"
            size={22}
            className="modal-title-icon"
          />
          Are you sure delete this attribute?
        </>
      }
      footer={false}
    >
      <div className="delete-attribute-description">
        Consumer will no longer see this attribute on Tridentity platform
      </div>
      <div className="delete-attribute-action">
        <Button type="default" onClick={onClose}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteAttributeModal;
