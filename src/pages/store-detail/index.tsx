import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
import "./styles.scss";
import StoreDetailTem from "./store-detail-template";
import { merchantStoreService } from "src/services/merchant-store-service";
import { CategoryLevel, GetCateLevel } from "src/helpers/convertCategories";
import { StoreStatusRequest } from "src/constants";

export interface storeDetail {
  basicInfo: { title: string; value: string }[];
  storeData: Store;
  storeAddress: { title: string; value: string }[];
}
const StoreDetail = () => {
  const [storeData, setStoreData] = useState<storeDetail>();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const storeDetailUpdateOrOnboard = useMemo(() => {
    if (location.pathname.includes("onboarding")) {
      return StoreStatusRequest.ONBOARDING;
    } else if (location.pathname.includes("update")) {
      return StoreStatusRequest.UPDATE;
    } else {
      return StoreStatusRequest.OFFICAL;
    }
  }, []);

  async function getStoreDetailOnboard(id: string) {
    try {
      const res = await merchantStoreService.fetchStoreOnboardDetail(id);

      const basicInfo = [
        {
          title: "Store name",
          value: res.data.name,
        },
        {
          title: "Open 24/7",
          value: res.data.isOpen24Hours ? "Yes" : "No",
        },

        {
          title: "Product Category",
          value: res.data.categories,
        },
        {
          title: "Description",
          value: res.data.description,
        },
        {
          title: "Service Support",
          value: res.data.service_supports,
        },

        {
          title: "Minimum order",
          value: "$" + res.data.min_order,
        },
      ];
      const storeAddress = [
        {
          title: "Phone number",
          value: res.data.merchantStoreOnboardAddresses[0].phone,
        },
        {
          title: "City",
          value: res.data.merchantStoreOnboardAddresses[0].city_or_province,
        },
        {
          title: "Address",
          value: res.data.merchantStoreOnboardAddresses[0].address,
        },

        {
          title: "Postal code",
          value: res.data.merchantStoreOnboardAddresses[0].postal_code,
        },
        {
          title: "Country",
          value: res.data.merchantStoreOnboardAddresses[0].country,
        },
      ];
      setStoreData({
        basicInfo,
        storeData: res.data,
        storeAddress,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getStoreDetailOffical(id: string) {
    try {
      const res = await merchantStoreService.fetchStoreDetail(id);
      const level1 = res.data.categoriesLevel1;
      const level2 = res.data.categoriesLevel2;
      const level3 = res.data.categoriesLevel3;
      const categoryTreeLevel: Category[][] = CategoryLevel(
        level1,
        level2,
        level3
      );

      const basicInfo = [
        {
          title: "Store name",
          value: res.data.name,
        },
        {
          title: "Open 24/7",
          value: res.data.isOpen24Hours ? "Yes" : "No",
        },

        {
          title: "Product Category",
          value: categoryTreeLevel,
        },
        {
          title: "Description",
          value: res.data.description,
        },
        {
          title: "Service Support",
          value: res.data.service_supports,
        },

        {
          title: "Minimum order",
          value: "$" + res.data.min_order,
        },
      ];
      const storeAddress = [
        {
          title: "Phone number",
          value: res.data.addresses[0].phone,
        },
        {
          title: "City",
          value: res.data.addresses[0].city_or_province,
        },
        {
          title: "Address",
          value: res.data.addresses[0].address,
        },

        {
          title: "Postal code",
          value: res.data.addresses[0].postal_code,
        },
        {
          title: "Country",
          value: res.data.addresses[0].country,
        },
      ];
      setStoreData({
        basicInfo,
        storeData: res.data,
        storeAddress,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getStoreDetailUpdate(id: string) {
    try {
      const res = await merchantStoreService.fetchStoreUpdateDetail(id);

      const basicInfo = [
        {
          title: "Store name",
          value: res.data.name,
        },
        {
          title: "Open 24/7",
          value: res.data.isOpen24Hours ? "Yes" : "No",
        },

        {
          title: "Product Category",
          value: res.data.categories,
        },
        {
          title: "Description",
          value: res.data.description,
        },
        {
          title: "Service Support",
          value: res.data.service_supports,
        },

        {
          title: "Minimum order",
          value: "$" + res.data.min_order,
        },
        {
          title: "Auto complete order timeout",
          value: res.data.hours_until_auto_complete + " hours",
        },
      ];
      const storeAddress = [
        {
          title: "Phone number",
          value: res.data.addresses[0].phone,
        },
        {
          title: "City",
          value: res.data.addresses[0].city_or_province,
        },
        {
          title: "Address",
          value: res.data.addresses[0].address,
        },

        {
          title: "Postal code",
          value: res.data.addresses[0].postal_code,
        },
        {
          title: "Country",
          value: res.data.addresses[0].country,
        },
      ];
      setStoreData({
        basicInfo,
        storeData: res.data,
        storeAddress,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getStoreDetail(id: string) {
    try {
      if (storeDetailUpdateOrOnboard === StoreStatusRequest.ONBOARDING) {
        await getStoreDetailOnboard(id);
      } else if (storeDetailUpdateOrOnboard === StoreStatusRequest.UPDATE) {
        await getStoreDetailUpdate(id);
      } else {
        await getStoreDetailOffical(id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (id) {
      getStoreDetail(id);
    }
  }, [id]);

  return (
    <>
      <StoreDetailTem
        storeData={storeData}
        storeDetailUpdateOrOnboard={storeDetailUpdateOrOnboard}
      />
    </>
  );
};

export default StoreDetail;
