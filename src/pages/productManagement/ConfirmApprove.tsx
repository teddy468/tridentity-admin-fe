import { Modal } from "antd";
import "./styles.scss";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface ConfirmPopupProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}
const ConfirmApprove: React.FC<ConfirmPopupProps> = ({
  open,
  onClose,
  onOk,
}: ConfirmPopupProps) => {
  return (
    <Modal onCancel={onClose} onOk={onOk} open={open} okText={"Yes"} cancelText={"No"}>
      <ExclamationCircleOutlined style={{ color: "#FAAD14" }} /> Are you sure to approve this product?
    </Modal>
  );
};

export default ConfirmApprove;
