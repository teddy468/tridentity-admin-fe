import { Modal } from "antd";
import "./styles.scss";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface ConfirmPopupProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}
const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  open,
  onClose,
  onOk,
}: ConfirmPopupProps) => {
  return (
    <Modal onCancel={onClose} onOk={onOk} open={open} okText="Confirm">
      <ExclamationCircleOutlined style={{ color: "#FAAD14" }} /> Are you sure
      you want to save this changes?
    </Modal>
  );
};

export default ConfirmPopup;
