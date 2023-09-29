import "./styles.scss";
import { Button, Modal, message } from "antd";
import { useState } from "react";
import { CategoryService } from "src/services/category-service";
import { AxiosError } from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export interface Props {
  onDelete: Partial<CategoryItem> | null;
  onClose: () => void;
  onSubmit: () => void;
}

const DeleteCategoryModal = (props: Props) => {
  const { onDelete, onClose, onSubmit } = props;
  const [loading, setLoading] = useState(false);
  const categoryService = new CategoryService();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (onDelete?.id) await categoryService.deleteCategory(onDelete.id);
      message.success("Delete category successfully");
      onSubmit();
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const messageText =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Delete category failed";
      message.error(messageText);
    }
    setLoading(false);
  };

  return (
    <Modal
      className="delete-category-modal"
      open={!!onDelete}
      onCancel={onClose}
      title={
        <>
          <ExclamationCircleOutlined
            color="#FAAD14"
            size={22}
            className="modal-title-icon"
          />
          Are you sure delete this category?
        </>
      }
      footer={false}
    >
      <div className="delete-category-description">
        Consumer will no longer see this category on Tridentity platform
      </div>
      <div className="delete-category-action">
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

export default DeleteCategoryModal;
