import { Button, Form, message } from "antd";
import { useLoadScript } from "@react-google-maps/api";
import TridentityPageHeader from "src/components/02.page-header";
import CardContent from "src/routes/components/CardContent";
import FormMap from "src/components/18.form/FormMap";
import { basicInfo, basicInfoStoreOnBoard } from "src/constants/storeUpdate";
import UpdateCateStoreDetail from "./update-cate-store-detail";
import OpeningHours from "./OpeningHours";
import UpdateStoreAddress from "./update-store-address";
import { useHistory, useLocation, useParams } from "react-router";
import { merchantStoreService } from "src/services/merchant-store-service";
import { useEffect, useMemo, useState } from "react";
import { API_KEY, StoreStatusRequest } from "src/constants";
import {
  getValueStoreForForm,
  getAddressFromStoreValues,
  getValueStoreForFormOnboard,
  getBodyForForm,
} from "src/helpers/storeMapping";
import { ServiceBase } from "src/services/core/service-base";
import { PATHS } from "src/constants/paths";

const UpdateStoreDetailByAdmin = () => {
  const location = useLocation();
  const history = useHistory();
  const [isFormFilled, setIsFormFilled] = useState(false);
  const { id } = useParams<{ id: string }>();
  const baseService = new ServiceBase();

  const [form] = Form.useForm<UpdateStoreRequest>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  const isOpen24Hours = Form.useWatch(["isOpen24Hours"], form);

  const storeDetailUpdateOrOnboard = useMemo(() => {
    if (location.pathname.includes("onboarding")) {
      return StoreStatusRequest.ONBOARDING;
    } else if (location.pathname.includes("update")) {
      return StoreStatusRequest.UPDATE;
    } else {
      return StoreStatusRequest.OFFICAL;
    }
  }, []);

  async function getStoreUpdateDetail(id: string) {
    try {
      const res = await merchantStoreService.fetchStoreUpdateDetail(id);
      const formValue = getValueStoreForForm(res.data);
      form.setFieldsValue(formValue);
      setIsFormFilled(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function getStoreOnboardDetail(id: string) {
    try {
      const res = await merchantStoreService.fetchStoreOnboardDetail(id);
      const formValue = getValueStoreForFormOnboard(res.data);
      form.setFieldsValue(formValue);
      setIsFormFilled(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStoreRequestUpdate(body: updateStoreRequestUpdate) {
    try {
      await merchantStoreService.updateStoreUpdateRequestDetail(id, body);
      message.success("Update store detail successfully");
      history.push(PATHS.store());
    } catch (error) {
      message.error("Update store detail failed");
      console.log(error);
    }
  }

  async function updateStoreOnboard(body: updateStoreOnboard) {
    try {
      await merchantStoreService.updateStoreOnboardRequestDetail(id, body);
      message.success("Update store detail successfully");
      history.push(PATHS.store());
    } catch (error) {
      message.error("Update store detail failed");
      console.log(error);
    }
  }

  async function onFinish(values: UpdateStoreRequest) {
    try {
      const { logo, banners } = values;

      const bannerUrl = banners?.filter(
        (banner) => typeof banner === "string"
      ) as string[];

      const newBanners = banners?.filter(
        (banner) => typeof banner !== "string"
      );

      const logoUrl =
        typeof logo[0] === "string"
          ? logo[0]
          : await baseService
              .uploadImage(logo)
              .then((res: any) => res.file_url);

      if (newBanners.length > 0) {
        await Promise.all(
          newBanners.map((banner) => baseService.uploadImage(banner))
        ).then((res) => {
          res.forEach((item) => bannerUrl.push(item.file_url));
        });
      }
      const merchantId = form.getFieldValue("merchantId");
      const id = form.getFieldValue("addressId");

      const addressBody = getAddressFromStoreValues(values, merchantId, id);

      const body = getBodyForForm(values, logoUrl, bannerUrl, addressBody);

      if (storeDetailUpdateOrOnboard === StoreStatusRequest.UPDATE) {
        await updateStoreRequestUpdate(body);
      } else {
        await updateStoreOnboard({
          ...body,
          POSIds: values.POSIds!.split(","),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!id) return;
    if (storeDetailUpdateOrOnboard === StoreStatusRequest.UPDATE) {
      getStoreUpdateDetail(id);
    } else {
      getStoreOnboardDetail(id);
    }
  }, [id, storeDetailUpdateOrOnboard]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div>
        <TridentityPageHeader title="Update store detail" backIcon={true} />

        <Form
          name="create-store"
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          onError={(e) => console.log(e)}
          autoComplete="off"
          scrollToFirstError={true}
          form={form}
        >
          <CardContent title="Basic Information">
            <div style={{ position: "absolute", right: "25px", top: "15px" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>

            <FormMap
              arrayField={
                storeDetailUpdateOrOnboard === StoreStatusRequest.UPDATE
                  ? basicInfo
                  : basicInfoStoreOnBoard
              }
              form={form}
              isFormFilled={isFormFilled}
            />

            <UpdateCateStoreDetail form={form} isFormFilled={isFormFilled} />

            {!isOpen24Hours && (
              <>
                <OpeningHours
                  form={form}
                  Form={Form}
                  isFormFilled={isFormFilled}
                />
              </>
            )}
          </CardContent>
          {isFormFilled && (
            <CardContent title="Store adress">
              <UpdateStoreAddress form={form} />
            </CardContent>
          )}
        </Form>
      </div>
    </>
  );
};

export default UpdateStoreDetailByAdmin;
