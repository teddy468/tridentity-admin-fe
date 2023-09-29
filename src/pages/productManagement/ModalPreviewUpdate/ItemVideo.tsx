import { ModalProps, Modal } from "antd";
import React from "react";
import banIcon from "../../../assets/icons/banned.svg";
import playIcon from "../../../assets/icons/union.svg";
import useReviewImg from "src/hooks/useReviewImg";
import "./styles.scss";

interface ItemVideoProps extends ModalProps {
  srcs: string[];
  title: string;
}

const ItemVideo: React.FC<ItemVideoProps> = (props) => {
  const [
    current,
    openModalPreview,
    handleSelectImg,
    handleOnClose,
    setCurrent,
  ] = useReviewImg();
  const { srcs, title } = props;
  if (srcs.length === 0) {
    return (
      <div className="modal-preview-body__basic-item">
        <p className="asterisk">{title}</p>
        <div className="modal-preview-body__basic-noItem">
          <div className="modal-preview-body__basic-noItem-box">
            <img src={banIcon} alt="ban icon" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-preview-body__basic-item">
      <p className="asterisk">{title}</p>
      <div className="modal-preview-body__basic-videos">
        {srcs.map((src, idx) => {
          return (
            <div
              className="modal-preview-body__basic-videos-box"
              key={idx}
              onClick={() => handleSelectImg(idx)}
            >
              <video playsInline muted>
                <source src={src} type="video/mp4" />
              </video>
              <div className="last-image">
                <img src={playIcon} alt="play icon" />
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        {...props}
        width={"fit-content"}
        open={openModalPreview}
        onCancel={handleOnClose}
        title="Product Images"
        className="modal-preview-img"
        footer={null}
      >
        <div className="modal-preview-img__imgPreview">
          <video controls={true} autoPlay={true}>
            <source src={srcs[current]} type="video/mp4" />
          </video>
        </div>
      </Modal>
    </div>
  );
};

export default ItemVideo;
