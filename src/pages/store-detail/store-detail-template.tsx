import { Button, Col, Row } from "antd";
import React, { Fragment, useMemo } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import CardContent from "src/routes/components/CardContent";
import "./styles.scss";
import { storeDetail } from ".";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Loading } from "src/components/17.loading/Loading";
import { StoreStatusRequest } from "src/constants";
import { useHistory } from "react-router";
import { PATHS } from "src/constants/paths";

interface Props {
  storeData?: storeDetail;
  storeDetailUpdateOrOnboard: StoreStatusRequest;
}

const StoreDetailTem: React.FC<Props> = ({
  storeData,
  storeDetailUpdateOrOnboard,
}) => {
  const [isShowMore, setIsShowMore] = React.useState(false);
  const history = useHistory();
  const handleToggleShowMore = () => {
    setIsShowMore(!isShowMore);
  };

  const storeSchedule = useMemo(() => {
    if (!storeData)
      return { date: [], openingTime: [], closingTime: [], status: [] };
    return {
      date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      openingTime: [
        storeData?.storeData.openingHoursMon || "-",
        storeData?.storeData.openingHoursTue || "-",
        storeData?.storeData.openingHoursWed || "-",
        storeData?.storeData.openingHoursThu || "-",
        storeData?.storeData.openingHoursFri || "-",
        storeData?.storeData.openingHoursSat || "-",
        storeData?.storeData.openingHoursSun || "-",
      ],
      closingTime: [
        storeData?.storeData.closingHoursMon || "-",
        storeData?.storeData.closingHoursTue || "-",
        storeData?.storeData.closingHoursWed || "-",
        storeData?.storeData.closingHoursThu || "-",
        storeData?.storeData.closingHoursFri || "-",
        storeData?.storeData.closingHoursSat || "-",
        storeData?.storeData.closingHoursSun || "-",
      ],
      status: [
        storeData?.storeData.openingHoursMon ? "Open" : "Off-day",
        storeData?.storeData.openingHoursTue ? "Open" : "Off-day",
        storeData?.storeData.openingHoursWed ? "Open" : "Off-day",
        storeData?.storeData.openingHoursThu ? "Open" : "Off-day",
        storeData?.storeData.openingHoursFri ? "Open" : "Off-day",
        storeData?.storeData.openingHoursSat ? "Open" : "Off-day",
        storeData?.storeData.openingHoursSun ? "Open" : "Off-day",
      ],
    };
  }, [storeData]);

  const handleNavigateEditStoreDetail = (id: number) => {
    if (storeDetailUpdateOrOnboard === StoreStatusRequest.ONBOARDING) {
      history.push(
        PATHS.adminEditOnboardStoreDetail().replace(":id", id.toString())
      );
    } else {
      history.push(
        PATHS.adminEditUpdateStoreDetail().replace(":id", id.toString())
      );
    }
  };

  return (
    <div>
      <TridentityPageHeader title="Store detail" backIcon={true} />

      {storeData ? (
        <>
          <CardContent
            customTitle="Basic information"
            className={`hide `}
            style={{
              minHeight: isShowMore
                ? storeData?.storeData.isOpen24Hours
                  ? "550px"
                  : "850px"
                : "0px",
            }}
          >
            <div className="btn-edit">
              <Button
                type="primary"
                onClick={() =>
                  handleNavigateEditStoreDetail(storeData.storeData.id)
                }
              >
                Edit Store
              </Button>
            </div>
            <Row>
              <Col span={12}>
                {storeData?.basicInfo
                  ?.slice(0, 4)
                  .map((item: any, idx: number) => {
                    if (item.title === "Product Category") {
                      return (
                        <Row className="a-item" key={idx}>
                          <div className="field-name">{item.title}:</div>
                          {/* <div className="field-content">
                            {item?.value?.map((cate: Category[], idx: any) => {
                              console.log(cate);
                              return (
                                <div key={idx}>
                                  {cate?.map(
                                    (item1: Category, idx1: number) => {
                                      return (
                                        <span key={idx1} className="cate-item">
                                          {item1?.name}{" "}
                                          {idx1 === cate.length - 1 ||
                                          !item1?.name
                                            ? ""
                                            : "> "}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              );
                            })}
                          </div> */}
                        </Row>
                      );
                    }
                    return (
                      <Row className="a-item" key={idx}>
                        <div className="field-name">{item.title}:</div>
                        <div className="field-content">{item.value}</div>
                      </Row>
                    );
                  })}
              </Col>
              <Col span={12}>
                {storeData?.basicInfo
                  ?.slice(4)
                  .map((item: any, idx: number) => {
                    if (item.title === "Service Support") {
                      return (
                        <Row className="a-item" key={idx}>
                          <div className="field-name">{item.title}:</div>
                          <div className="field-content">
                            {item.value.map((serice: any, idx: number) => (
                              <span className="service-item" key={idx}>
                                {serice}
                              </span>
                            ))}
                          </div>
                        </Row>
                      );
                    }
                    return (
                      <Row className="a-item" key={idx}>
                        <div className="field-name">{item.title}:</div>
                        <div className="field-content">{item.value}</div>
                      </Row>
                    );
                  })}
              </Col>
            </Row>

            {!storeData?.storeData.isOpen24Hours && (
              <>
                <p className="store-title card-title">Store Schedules</p>

                <div className="store-schedule-box">
                  <div className="item-schedule date"></div>
                  {storeSchedule.date.map((item: string, idx: number) => (
                    <div key={item} className="item-schedule date">
                      {item}
                    </div>
                  ))}
                  <div className="item-schedule schedule-title">
                    Opening time
                  </div>
                  {storeSchedule.openingTime.map(
                    (item: string, idx: number) => (
                      <div key={idx} className="item-schedule">
                        {item}
                      </div>
                    )
                  )}
                  <div className="item-schedule schedule-title">
                    Closing time
                  </div>
                  {storeSchedule.closingTime.map(
                    (item: string, idx: number) => (
                      <div key={idx} className="item-schedule">
                        {item}
                      </div>
                    )
                  )}
                  <div className="item-schedule schedule-title">Status</div>
                  {storeSchedule.status.map((item: string, idx: number) => (
                    <div key={item} className="item-schedule schedule-title">
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}

            <span className="store-title card-title">Store Address</span>

            <Row>
              <Col span={12}>
                {storeData?.storeAddress
                  ?.slice(0, 3)
                  .map((item: any, idx: number) => {
                    return (
                      <Row className="a-item" key={idx}>
                        <div className="field-name">{item.title}:</div>
                        <div className="field-content">{item.value}</div>
                      </Row>
                    );
                  })}
              </Col>
              <Col span={12}>
                {storeData?.storeAddress
                  ?.slice(3)
                  .map((item: any, idx: number) => (
                    <Row className="a-item" key={idx}>
                      <div className="field-name">{item.title}:</div>
                      <div className="field-content">{item.value}</div>
                    </Row>
                  ))}
              </Col>
            </Row>

            <div className="btn-display" onClick={handleToggleShowMore}>
              {isShowMore ? (
                <>
                  See Less <UpOutlined />
                </>
              ) : (
                <>
                  See More <DownOutlined />
                </>
              )}
            </div>
          </CardContent>
          <CardContent customTitle="Store Images">
            <div className="store-imgs">
              <div className="field-name">Store logo</div>
              {storeData?.storeData?.logo && (
                <>
                  <img src={storeData.storeData.logo} alt="logo" />
                </>
              )}
            </div>

            <div className="store-imgs">
              <div className="field-name">Store banner</div>
              <div className="img-box">
                {storeData?.storeData?.banners &&
                  storeData.storeData.banners.map((item: any, idx: number) => {
                    return (
                      <Fragment key={idx}>
                        <img src={item} alt="banner" />
                      </Fragment>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        <div className="hide">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default StoreDetailTem;
