import { message, Modal } from "antd";
import "./styles.scss";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";

interface ConfirmPopupProps {
  open: boolean;
  onClose: () => void;
  onOk: (description: string) => void;
  title?: string;
  placeholder?: string;
}
const ConfirmReject: React.FC<ConfirmPopupProps> = ({
  open,
  onClose,
  onOk,
  title = "Are you sure to decline this product?",
  placeholder,
}: ConfirmPopupProps) => {
  const [text, setText] = useState("");

  const handleTextAreaChange = (event: any) => {
    setText(event.target.value);
  };

  const handleIOk = () => {
    if (!text) {
      message.error("Input yours decline result !");
      return;
    }
    const isEmptySpace = text.startsWith(" ") || text.endsWith(" ");
    if (isEmptySpace) {
      message.error("Decline result can not start or end with space !");
      return;
    }
    const isEmptyLines =
      text.split("\n").filter((item: any) => item === "").length > 1;
    if (isEmptyLines) {
      message.error("Decline result can not have empty lines !");
      return;
    }
    onOk(text);
  };

  return (
    <Modal
      onCancel={onClose}
      onOk={handleIOk}
      open={open}
      okText={"Yes"}
      cancelText={"No"}
    >
      <ExclamationCircleOutlined style={{ color: "#FAAD14" }} /> {title}
      <TextArea
        size={"large"}
        onChange={handleTextAreaChange}
        placeholder={placeholder || "Decline Reason"}
        style={{ marginTop: "20px" }}
      />
    </Modal>
  );
};

export default ConfirmReject;
