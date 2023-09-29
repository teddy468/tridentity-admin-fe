import React from "react";
import "./styles.scss";
import useReviewImg from "src/hooks/useReviewImg";
import { Modal, ModalProps } from "antd";

interface ItemImageProps extends ModalProps {
  srcs: string[];
  title: string;
  lastImg: number;
}
const ItemImage: React.FC<ItemImageProps> = (props) => {
  const { srcs, title, lastImg } = props;
  const [
    current,
    openModalPreview,
    handleSelectImg,
    handleOnClose,
    setCurrent,
  ] = useReviewImg();
  return (
    <div className="modal-preview-body__basic-item">
      <p className="asterisk">{title}</p>
      <div className="modal-preview-body__basic-imgs">
        {srcs.map((src, idx) => {
          if (idx + 1 <= lastImg)
            return (
              <div
                key={idx}
                className="modal-preview-body__basic-imgs-box"
                onClick={() => handleSelectImg(idx)}
              >
                <img src={src} alt="" />
                {srcs.length - lastImg > 0 && idx + 1 === lastImg && (
                  <div className="last-image">+{srcs.length - lastImg}</div>
                )}
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
        <div>
          <div className="modal-preview-img__imgPreview">
            <img src={srcs[current]} alt="" />
          </div>
          <div className="modal-preview-img__box">
            <div className="modal-preview-body__basic-imgs">
              {srcs.map((src, idx) => {
                return (
                  <div
                    key={idx}
                    className="modal-preview-body__basic-imgs-box"
                    onClick={() => setCurrent(idx)}
                  >
                    <img src={src} alt="" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItemImage;
