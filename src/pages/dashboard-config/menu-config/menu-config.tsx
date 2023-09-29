import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { PATHS } from "src/constants/paths";
import { CategoryService } from "src/services/category-service";
import "./styles.scss";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

const MenuConfig = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["dashboard-config-permission"]
  );
  const history = useHistory();
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  useEffect(() => {
    getCategoriesDashboardSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getCategoriesDashboardSetting = async () => {
    try {
      const result = await categoryService.getCategoriesDashboardSettings();
      if (result?.status === 200) setCategories(result?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const renderCategory = (
    categoryConfig: CategoryConfig,
    index: number,
    isVertical?: boolean
  ) => {
    const category = categoryConfig?.category;
    return (
      <Button
        disabled={!doHavePermissionToEdit}
        className="categoy-button"
        onClick={() =>
          history.push(PATHS.configMenu().replace(":index", index.toString()))
        }
      >
        <div
          className={`${isVertical ? "menu-item-vertical" : "menu-item"} ${
            category ? "has-category" : ""
          }`}
        >
          {category ? (
            <div className="category-item">
              <img src={category.image} alt="" />
              <div className="footer">
                <div className="name-wrapper">
                  <div className="name">{category.name} </div>
                </div>
                <div className="description">{category.description}</div>
              </div>
              <div className="item-index">{index + 1}</div>
            </div>
          ) : (
            <PlusOutlined style={{ fontSize: "40px", cursor: "pointer" }} />
          )}
        </div>
      </Button>
    );
  };

  return (
    <div>
      <div className="config-header">
        <h1 className="title">What’s on the menu?</h1>{" "}
      </div>
      <div className="menu">
        <div className="row first-row">
          <div className="row">
            <div className="row first-row-section-1">
              {renderCategory(categories?.[0], 0)}
              {renderCategory(categories?.[1], 1)}
            </div>
            <div className="row first-row-section-2">
              {renderCategory(categories?.[3], 3)}
              {renderCategory(categories?.[4], 4)}
            </div>
          </div>
          {renderCategory(categories?.[2], 2, true)}
        </div>
        <div className="second-row row">
          {renderCategory(categories?.[5], 5)}
          {renderCategory(categories?.[6], 6)}
          {renderCategory(categories?.[7], 7)}
        </div>
      </div>
    </div>
  );
};

export default MenuConfig;
