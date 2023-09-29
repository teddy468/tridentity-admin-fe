import { Modal, ModalProps } from "antd";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import ItemImage from "./ItemImage";
import ItemVideo from "./ItemVideo";
import { isEqual } from "lodash";

interface ModalPreviewUpdateProps extends ModalProps {
  // props
  chosenProduct: ProductItemApproval | undefined;
}

interface dataCompare {
  className: string;

  basicInfo: basicInfo;
  detailInfo: {
    name: string;
    warranty: string;
  };
  sellInfo: {
    price: number;
    stock: number;
  };
}
interface basicInfo {
  name: string;
  category: string;
  tag: string;
  hashTag: string[];
  images: string[];
  video: string[];
}
const ModalPreviewUpdate: React.FC<ModalPreviewUpdateProps> = (props) => {
  const { chosenProduct } = props;
  const [data, setData] = useState<dataCompare[]>([]);

  function createData(chosenProduct: ProductItemApproval) {
    let stockAfter = 0;
    chosenProduct.payload.attributes.forEach((item) => {
      item.variants.forEach((variant) => {
        stockAfter += variant.total_quantity;
      });
    });
    let stockBefore = 0;
    chosenProduct.product!.items.forEach((item) => {
      stockBefore += item.current_quantity;
    });

    const afterData: dataCompare = {
      className: "modal-preview-body__update",
      basicInfo: {
        name: chosenProduct.payload.name,
        category: chosenProduct.payload.category!.name,
        tag: chosenProduct.payload.main_tags.join(", "),
        hashTag: chosenProduct.payload.sub_tags,
        images: chosenProduct.payload.images,
        video: chosenProduct.payload.videos,
      },
      detailInfo: {
        name: chosenProduct.payload.brand!,
        warranty: chosenProduct.payload.warranty,
      },
      sellInfo: {
        price: Number(chosenProduct.price!),
        stock: stockAfter,
      },
    };
    const beforeData: dataCompare = {
      className: "modal-preview-body__previous",
      basicInfo: {
        name: chosenProduct.product!.name,
        category: chosenProduct.product!.category!.name,
        tag: chosenProduct.product!.main_tags.join(", "),
        hashTag: chosenProduct.product!.sub_tags,
        images: chosenProduct.product!.images,
        video: chosenProduct.product!.videos,
      },
      detailInfo: {
        name: chosenProduct.product!.brand!,
        warranty: chosenProduct.product!.warranty,
      },
      sellInfo: {
        price: Number(chosenProduct.product!.price!),
        stock: stockBefore,
      },
    };

    return [beforeData, afterData];
  }
  useEffect(() => {
    if (chosenProduct) setData(createData(chosenProduct));
  }, [chosenProduct]);

  const HeaderModal = () => {
    return (
      <div className="modal-preview-header">
        <p>Previous</p>
        <p>Update</p>
      </div>
    );
  };
  const Item = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => {
    return (
      <div className="modal-preview-body__basic-item">
        <p className="asterisk">{title}</p>
        <input type="text" value={value} readOnly />
      </div>
    );
  };
  const ItemHashtag = ({
    title,
    value,
  }: {
    title: string;
    value: string[];
  }) => {
    return (
      <div className="modal-preview-body__basic-item">
        <p className="asterisk">{title}</p>
        <div className="modal-preview-body__basic-hashtag">
          {value.map((item, index) => (
            <div className="modal-preview-body__basic-hashtag-item" key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BodyModal = ({
    data,
    dataForCompare,
  }: {
    data: dataCompare;
    dataForCompare: dataCompare;
  }) => {
    const isAllBasicInfoEqual =
      isEqual(data.basicInfo.images, dataForCompare.basicInfo.images) &&
      isEqual(data.basicInfo.video, dataForCompare.basicInfo.video) &&
      data.basicInfo.name === dataForCompare.basicInfo.name &&
      data.basicInfo.category === dataForCompare.basicInfo.category &&
      data.basicInfo.tag === dataForCompare.basicInfo.tag &&
      isEqual(data.basicInfo.hashTag, dataForCompare.basicInfo.hashTag);
    const isALLDetailInfoEqual =
      data.detailInfo.name === dataForCompare.detailInfo.name &&
      data.detailInfo.warranty === dataForCompare.detailInfo.warranty;
    const isAllSellInfoEqual =
      data.sellInfo.price === dataForCompare.sellInfo.price &&
      data.sellInfo.stock === dataForCompare.sellInfo.stock;
    return (
      <div className={data["className"]}>
        {!isAllBasicInfoEqual && (
          <div>
            <p className="modal-preview-body__title">Basic Information</p>
            <div className="modal-preview-body__basic-info">
              {!isEqual(
                data.basicInfo.images,
                dataForCompare.basicInfo.images
              ) && (
                <ItemImage
                  srcs={data.basicInfo.images}
                  title="Product Image"
                  lastImg={6}
                />
              )}

              {!isEqual(
                data.basicInfo.video,
                dataForCompare.basicInfo.video
              ) && (
                <ItemVideo srcs={data.basicInfo.video} title="Product video" />
              )}

              {data.basicInfo.name !== dataForCompare.basicInfo.name && (
                <Item title="Product Name" value={data.basicInfo.name} />
              )}

              {data.basicInfo.category !==
                dataForCompare.basicInfo.category && (
                <Item
                  title="Product Category"
                  value={data.basicInfo.category}
                />
              )}

              {data.basicInfo.tag !== dataForCompare.basicInfo.tag && (
                <Item title="Product Tag" value={data.basicInfo.tag} />
              )}

              {!isEqual(
                data.basicInfo.hashTag,
                dataForCompare.basicInfo.hashTag
              ) && (
                <ItemHashtag
                  title="Product HashTag"
                  value={data.basicInfo.hashTag}
                />
              )}
            </div>
          </div>
        )}

        {!isALLDetailInfoEqual && (
          <div>
            <p className="modal-preview-body__title">Detail Information</p>
            <div className="modal-preview-body__basic-info">
              {data.detailInfo?.name && (
                <>
                  {data.detailInfo?.name !==
                    dataForCompare.detailInfo?.name && (
                    <Item title="Brand Name" value={data.detailInfo.name} />
                  )}
                </>
              )}
              {data.detailInfo?.warranty && (
                <>
                  {data.detailInfo?.warranty !==
                    dataForCompare.detailInfo?.warranty && (
                    <Item
                      title="Product Warranty"
                      value={data.detailInfo.warranty}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {!isAllSellInfoEqual && (
          <div>
            <p className="modal-preview-body__title">Selling Information</p>
            <div className="modal-preview-body__basic-info">
              {data.sellInfo?.price && (
                <>
                  {data.sellInfo?.price !== dataForCompare.sellInfo?.price && (
                    <Item
                      title="Product Price"
                      value={data.sellInfo.price.toString()}
                    />
                  )}
                </>
              )}
              {data.sellInfo?.stock && (
                <>
                  {data.sellInfo?.stock !== dataForCompare.sellInfo?.stock && (
                    <Item title="Product Stock" value={data.sellInfo.stock} />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {isAllBasicInfoEqual && isALLDetailInfoEqual && isAllSellInfoEqual && (
          <div className="modal-preview-body__no-change">
            <p className="modal-preview-body__no-change-title">
              No change in product information
            </p>
          </div>
        )}
      </div>
    );
  };
  return (
    <Modal
      {...props}
      title={<HeaderModal />}
      width={"fit-content"}
      className="modal-preview-container"
      closable
      footer={null}
    >
      <div className="modal-preview-body">
        {data.map((item, idx) => {
          return (
            <BodyModal
              data={item}
              dataForCompare={idx === 0 ? data[1] : data[0]}
              key={idx}
            />
          );
        })}
      </div>
    </Modal>
  );
};

export default ModalPreviewUpdate;
