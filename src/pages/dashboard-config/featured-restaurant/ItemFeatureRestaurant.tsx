import React, { useEffect } from "react";
import HeartRed from "../../../assets/icons/heartRed.svg";
import Close from "../../../assets/icons/close-icon.svg";
import Star from "../../../assets/icons/star.svg";
import { PATHS } from "src/constants/paths";
import "./styles.scss";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { Button, Modal } from "antd";
import { formatTextPlural } from "src/helpers";

interface Props {
  data: MerchantStore;
  position: number;
  deleteFeaturedRestaurant: (idx: number) => void;
  idx: number;
  doHavePermissionToEdit: boolean;
}

const ItemFeatureRestaurant: React.FC<Props> = (props) => {
  const {
    data,
    deleteFeaturedRestaurant,
    position,
    idx,
    doHavePermissionToEdit,
  } = props;
  const history = useHistory();
  function handleClick() {
    history.push(
      PATHS.configFeaturedRestaurants().replace(":index", position.toString())
    );
  }
  function handleOpenModalConfirm() {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to delete this restaurant?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        deleteFeaturedRestaurant(position);
      },
    });
  }

  if (!data) {
    return (
      <Button
        className="antd-btn-nostyles"
        disabled={!doHavePermissionToEdit}
        onClick={handleClick}
      >
        <div className="add-more-item">
          <PlusOutlined style={{ fontSize: "40px" }} />
        </div>
      </Button>
    );
  }

  return (
    <Button
      className="antd-btn-nostyles"
      onClick={handleClick}
      disabled={!doHavePermissionToEdit}
    >
      <div className="item-restaurant">
        <div className="item-restaurant__featured">
          <div className="item-restaurant__logo">
            <img
              src={data.logo}
              alt="store-logo"
              className="item-restaurant__logoImg"
            />
          </div>

          <div className="item-restaurant__tag">
            {data.tags.length > 0 ? data.tags.join(",") : "None"}
          </div>
          <div className="item-restaurant__liked">
            <img src={HeartRed} alt="heart" />
          </div>
          <div
            className="item-restaurant__remove"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModalConfirm();
            }}
          >
            <img src={Close} alt="delete" />
          </div>
          <div className="item-restaurant__index">{idx + 1}</div>
        </div>
        <p className="item-restaurant__title">{data.name}</p>
        <div className="item-restaurant__rating">
          <span className="item-restaurant__rating-starNumber">
            {+(data.rating || 0).toFixed(2)}
          </span>
          <img src={Star} alt="star" />
          <span className="item-restaurant__rating-reviewNumber">
            ({new Intl.NumberFormat().format(data.reviews || 0)}{" "}
            {formatTextPlural("review", data.reviews || 0)})
          </span>
        </div>
      </div>
    </Button>
  );
};

export default ItemFeatureRestaurant;
