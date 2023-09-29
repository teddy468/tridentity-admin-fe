import "./styles.scss";
import { productManagementService } from "src/services/product-management";
import { Fragment, useEffect, useRef, useState } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ArrowPrev from "src/assets/icons/slick-left-arrow.svg";
import ArrowNext from "src/assets/icons/slick-right-arrow.svg";

import ItemTopSellingDished from "./item-top-selling-dished";
import { toast } from "react-toastify";
import { handleError } from "src/helpers/error";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ReduxStore } from "src/types/globalStore";
import { useSelector } from "react-redux";

const TopSellingDishes = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["dashboard-config-permission"]
  );
  const drag = useRef(false);
  const [products, setProducts] = useState<ProductItemConfig[]>([]);

  useEffect(() => {
    getProductDashboardSetting();
  }, []);
  const getProductDashboardSetting = async () => {
    try {
      const result = await productManagementService.getProductDashboardConfig(
        "top_selling"
      );
      if (result.status === 200) {
        if (result.data.length === 0) {
          setProducts([{ product: null, position: 1 }]);
        } else if (result.data.length < 10) {
          setProducts([
            ...result.data,
            { product: null, position: result.data.at(-1).position + 1 },
          ]);
        } else {
          setProducts(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function handleDeleteFeatureDish(index: number) {
    const newProducts = products
      .filter((item) => item.product !== null)
      .map((item) => ({
        product_id: item.product!.id,
        position: item.position,
        product_name: item.product!.name,
      }))
      .filter((item) => item.position !== index);

    try {
      const result = await productManagementService.setProductDashboardConfig(
        "top_selling",
        newProducts.sort((a, b) => a.position - b.position)
      );
      if (result.status === 200) {
        setProducts((prev) => {
          if (
            prev.length === 10 &&
            !prev.find((item) => item.product === null)
          ) {
            let newListDish = prev.filter((item) => item.position !== index);
            newListDish.push({
              product: null,
              position: prev.at(-1)!.position + 1,
            });
            return newListDish;
          } else {
            return prev.filter((item) => item.position !== index);
          }
        });
        toast.success("Remove featured dish successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      handleError(error);
    }
  }

  function handleOpenModalConfirm(index: number) {
    Modal.confirm({
      title: "Do you want remove featured dish ?",
      icon: <ExclamationCircleOutlined />,
      content: ``,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        handleDeleteFeatureDish(index);
      },
    });
  }
  return (
    <div>
      <div className="config-header">
        <h1 className="title">Top Selling Dishes</h1>
      </div>

      <div className="top-selling-dishes">
        {products.length > 0 && (
          <Slider
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            draggable={true}
            beforeChange={() => (drag.current = true)}
            afterChange={() => (drag.current = false)}
            variableWidth={true}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  initialSlide: 1,
                },
              },
              {
                breakpoint: 540,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  initialSlide: 1,
                },
              },
            ]}
            prevArrow={
              <div className="slide-icon__prev">
                <img src={ArrowPrev} alt="icon" />
              </div>
            }
            nextArrow={
              <div className="slide-icon__next">
                <img src={ArrowNext} alt="icon" />
              </div>
            }
          >
            {products.map((data) => (
              <Fragment key={data.position}>
                <ItemTopSellingDished
                  doHavePermissionToEdit={doHavePermissionToEdit}
                  index={data.position}
                  item={data}
                  handleDelete={(index) => handleOpenModalConfirm(index)}
                />
              </Fragment>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default TopSellingDishes;
