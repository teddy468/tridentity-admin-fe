import { Badge, List, Pagination } from "antd";
import dayjs from "dayjs";
import { cloneDeep, keys } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import TridentityPageHeader from "src/components/02.page-header";
import { PATHS } from "src/constants/paths";
import { STATUS_CODE } from "src/constants/status-code";
import CardContent from "src/routes/components/CardContent";
import { NotificationServices } from "src/services/notification-service";
import { PageParams } from "src/services/params-type";
import { fetchListUnread } from "src/store/reducers/notification";
import "./styles.scss";
import { addTableIndex } from "src/helpers";

export enum AdminNotificationEventName {
  CategoryCreated = `CATEGORY_CREATED`,
  CategoryUpdated = `CATEGORY_UPDATED`,
  CategoryDeleted = `CATEGORY_DELETED`,
  ProductHidden = `PRODUCT_HIDDEN`,
  ProductUnhidden = `PRODUCT_UNHIDDEN`,
  ConsumerDeactivated = `CONSUMER_DEACTIVATED`,
  ConsumerActivated = `CONSUMER_ACTIVATED`,
  MerchantDeactivated = `MERCHANT_DEACTIVATED`,
  MerchantActivated = `MERCHANT_ACTIVATED`,
  MerchantOnboardingAccepted = `MERCHANT_ONBOARDING_ACCEPTED`,
  MerchantOnboardingDeclined = `MERCHANT_ONBOARDING_DECLINED`,
  DashboardConfigUpdated = `DASHBOARD_CONFIG_UPDATED`,
  ParametersConfigUpdated = `PARAMETERS_CONFIG_UPDATED`,
}

const NotificationPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [params, setParams] = useState<PageParams>({
    page: 0,
    perPage: 10,
    paginationMetadataStyle: "body",
  });
  const [page, setPage] = useState(1);

  const [metadata, setMetadata] = useState<PaginationMetadata>({
    "x-next-page": 0,
    "x-page": 0,
    "x-pages-count": 0,
    "x-per-page": 0,
    "x-total-count": 0,
  });
  const [dataSrc, setDataSrc] = useState<Notification[]>([]);

  const notificationService = new NotificationServices();

  const loadNotifications = async () => {
    try {
      const res = await notificationService.listNotification(params);
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        const { data, metadata } = res.data as PaginationData<Notification>;
        const dataTable = addTableIndex(
          data,
          metadata["x-per-page"],
          metadata["x-page"]
        );
        setDataSrc(dataTable);
        setMetadata(metadata);
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    let interval = setInterval(async () => {
      loadNotifications();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleChangePagination = (page: number, pageSize: number) => {
    setParams({
      ...params,
      page,
      perPage: pageSize,
    });
    setPage(page);
  };

  const handleTitle = (item: Notification) => {
    const { content } = item;
    const { message } = content;
    let messageCLone = cloneDeep(message);
    const listKey = keys(content).filter((item) => item !== "message");
    let res;
    if (listKey.length > 0) {
      res = listKey.reduce((message: string, value: string) => {
        return (message as string)?.replace(
          `:${value}`,
          `<span style="color:#38745E ;  font-weight: ${
            !dayjs(item.read_at).isValid() ? "600" : "400"
          }">${content[value]}</span>`
        );
      }, messageCLone);
    } else {
      res = message;
    }

    return {
      __html: `<div style="font-size: 14px;color: ${
        dayjs(item.read_at).isValid()
          ? "rgba(171, 171, 177, 1)"
          : "rgba(0, 0, 0, 0.85)"
      }   ; font-weight: ${
        !dayjs(item.read_at).isValid() ? "600" : "400"
      }; cursor: pointer">${res}</div>`,
    };
  };

  const redirectRoute = (item: any) => {
    const path = item?.meta?.eventName;
    if (
      path === AdminNotificationEventName.CategoryCreated ||
      path === AdminNotificationEventName.CategoryUpdated ||
      path === AdminNotificationEventName.CategoryDeleted
    ) {
      history.push(PATHS.categoryAndAttribute());
    } else if (
      path === AdminNotificationEventName.ConsumerActivated ||
      path === AdminNotificationEventName.ConsumerDeactivated
    ) {
      history.push(PATHS.consumer());
    } else if (path === AdminNotificationEventName.DashboardConfigUpdated) {
      history.push(PATHS.dashboardConfig());
    } else if (path === AdminNotificationEventName.ParametersConfigUpdated) {
      history.push(PATHS.parameters());
    } else if (
      path === AdminNotificationEventName.ProductHidden ||
      path === AdminNotificationEventName.ProductUnhidden
    ) {
      history.push(PATHS.productManagement());
    } else {
      history.push(PATHS.default());
    }
  };

  const handlRead = async (item: any) => {
    try {
      if (dayjs(item.read_at).isValid()) {
      } else {
        await notificationService.readNotification(item.id);
        dispatch(fetchListUnread());
        console.log("Read success");
      }
      redirectRoute(item);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <TridentityPageHeader title="Notification" />
      <CardContent>
        <div
          id="scrollableDiv"
          style={{
            height: `calc(100vh - 310px)`,
            overflow: "auto",
            padding: "0 16px",
          }}
        >
          <List
            dataSource={dataSrc}
            renderItem={(item) => (
              <List.Item
                key={item?.id}
                onClick={() => handlRead(item)}
                style={!dayjs(item.read_at).isValid() ? {} : { opacity: 0.6 }}
              >
                <List.Item.Meta
                  avatar={item.indexTable}
                  title={<div dangerouslySetInnerHTML={handleTitle(item)} />}
                  description={
                    <div className="date">
                      {dayjs(item?.notify_at).format("DD/MM/YYYY HH:mm")}
                    </div>
                  }
                />
                <div>
                  {!dayjs(item.read_at).isValid() && (
                    <Badge key={"blue"} color={"blue"} />
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
        <Pagination
          defaultCurrent={1}
          current={page}
          onChange={handleChangePagination}
          total={metadata["x-total-count"]}
          showSizeChanger={false}
        />
      </CardContent>
    </>
  );
};

export default NotificationPage;
