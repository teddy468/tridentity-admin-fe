import "./styles.scss";
import { useEffect, useRef, useState } from "react";
import { merchantStoreService } from "src/services/merchant-store-service";
import { message } from "antd";
import ItemFeatureRestaurant from "./ItemFeatureRestaurant";
// import required modules
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowPrev from "src/assets/icons/slick-left-arrow.svg";
import ArrowNext from "src/assets/icons/slick-right-arrow.svg";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

const FeaturedRestaurant = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["dashboard-config-permission"]
  );
  const drag = useRef(false);
  const [merchantStores, setMerchantStores] = useState<
    MerchantStoreDashboardConfig[]
  >([]);

  useEffect(() => {
    getFeaturedRestaurant();
  }, []);

  const getFeaturedRestaurant = async () => {
    try {
      const result = await merchantStoreService.getFeaturedRestaurantDashboard(
        "featured"
      );
      if (result.status === 200) {
        if (result.data.length === 0) {
          setMerchantStores([{ merchantStore: null, position: 0 }]);
        } else {
          setMerchantStores([
            ...result.data,
            { merchantStore: null, position: result.data.at(-1).position + 1 },
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFeaturedRestaurant = async (index: number) => {
    try {
      const result =
        await merchantStoreService.deleteFeaturedRestaurantDashboard(index);
      if (result.status === 200) {
        message.success("Delete featured restaurant successfully");
        getFeaturedRestaurant();
      }
    } catch (error) {
      message.error("Delete featured restaurant failed");
      console.log(error);
    }
  };

  return (
    <div>
      <div className="config-header">
        <h1 className="title">Featured Restaurant</h1>
      </div>
      <div className="wrapper-slide">
        {merchantStores.length > 0 && (
          <Slider
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={5}
            slidesToScroll={5}
            draggable={true}
            beforeChange={() => (drag.current = true)}
            afterChange={() => (drag.current = false)}
            rows={2}
            variableWidth={true}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4,
                  initialSlide: 4,
                },
              },
              {
                breakpoint: 540,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  initialSlide: 2,
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
            {merchantStores.map((data, idx) => (
              <div>
                <ItemFeatureRestaurant
                  doHavePermissionToEdit={doHavePermissionToEdit}
                  idx={idx}
                  data={data.merchantStore!}
                  position={data.position}
                  deleteFeaturedRestaurant={deleteFeaturedRestaurant}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default FeaturedRestaurant;
