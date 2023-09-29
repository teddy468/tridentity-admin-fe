import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { useHistory } from "react-router";
import { PATHS } from "src/constants/paths";
import "./styles.scss";
import { MAIN_TAG } from "src/constants";
import Close from "../../../assets/icons/close-icon.svg";
import { Button } from "antd";

interface Props {
  item: ProductItemConfig;
  index: number;
  handleDelete: (idx: number) => void;
  doHavePermissionToEdit: boolean;
}
const ItemTopSellingDished: React.FC<Props> = (props) => {
  const { item, index, handleDelete, doHavePermissionToEdit } = props;
  const history = useHistory();

  function handleClick() {
    history.push(
      PATHS.configTopSellingDishes().replace(":index", index.toString())
    );
  }
  if (!item.product) {
    return (
      <Button
        className="antd-btn-nostyles"
        onClick={handleClick}
        disabled={!doHavePermissionToEdit}
      >
        <div className="add-more-item">
          <PlusOutlined style={{ fontSize: "40px" }} />
        </div>
      </Button>
    );
  }
  return (
    <Button
      disabled={!doHavePermissionToEdit}
      className="antd-btn-nostyles"
      onClick={(e) => {
        e.preventDefault();
        handleDelete(index);
      }}
    >
      <div key={index} className={`dish ${item.product ? "has-product" : ""}`}>
        <div className="dish-remove">
          <img src={Close} alt="delete" className="dish-remove__icon" />
        </div>
        <div className="top-selling-card" onClick={handleClick}>
          <img src={item.product?.images?.[0]} alt="" />
          {item.product?.main_tags?.[0] && (
            <div className="tag">{MAIN_TAG[item.product?.main_tags?.[0]]}</div>
          )}
          <div className="info">
            <div className="name">{item.product?.name}</div>
            <div className="description">{item.product?.store?.name}</div>
            <div className="price">${item.product?.price}</div>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default ItemTopSellingDished;
