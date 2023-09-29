import { FileOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import _ from "lodash";
import { last } from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import TridentityPageHeader from "src/components/02.page-header";
import { STATUS_CODE } from "src/constants/status-code";
import { formatPhoneNumber } from "src/helpers/formatNumber";
import CardContent from "src/routes/components/CardContent";
import { UserServices } from "src/services/user-service";
import "./styles.scss";
import ModalDetailMerchantInformationForApproval from "src/components/05.modal/components/ModalDetailMerchantInformationForApproval/ModalDetailMerchantInformationForApproval";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

const UpdateInformationDetailPage = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["user-management-permission"]
  );
  const { id } = useParams<{ id: string }>();
  const [openModalReviewInformation, setOpenModalReviewInformation] =
    useState(false);
  const [data, setData] = useState<any>();
  const [dataModalReview, setDataModalReview] =
    useState<MerchantOnboardRequest>();

  const userService = new UserServices();

  useEffect(() => {
    if (id && Number(id) > 0) {
      getDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDetail = async () => {
    try {
      const res = await userService.fetchOnboardingUpdateRequestDetail(id);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDataModalReview(res.data);

        const arrayAccountInformation = [
          {
            title: "Full name",
            value: res.data?.company_name,
            isReject: false,
          },
          {
            title: "Email",
            value: res.data?.email,
            isReject: false,
          },
          {
            title: "Phone number",
            value: formatPhoneNumber(res.data?.phone),
            isReject: false,
          },
        ];
        const arrayMerchantInformation = [
          {
            title: "Registered Office Address",
            value: res.data?.registeredOfficeAddress,
            isReject: false,
          },
          {
            title: "SFA Number",
            value: res.data?.sfaNumber,
            isReject: false,
          },
          {
            title: "GST Registration Number",
            value: res.data?.gstRegistrationNumber,
            isReject: false,
          },
          {
            title: "Representative Name",
            value: res.data?.representativeName,
            isReject: false,
          },
          {
            title: "Office No",
            value: res.data?.officeNo,
            isReject: false,
          },
          {
            title: "Territory",
            value: res.data?.territory,
            isReject: false,
          },
          {
            title: "Business Nature",
            value: res.data?.businessNature,
            isReject: false,
          },
          {
            title: "Email address",
            value: res.data?.emailAddress,
            isReject: false,
          },
          {
            title: "Mobile No",
            value: res.data?.mobileNo,
            isReject: false,
          },
        ];
        const arrayPaymentInformation = [
          {
            title: "Finance Representative Name",
            value: res.data?.financeRepresentativeName,
            isReject: false,
          },
          {
            title: "Office No",
            value: res.data?.officeNo,
            isReject: false,
          },
          {
            title: "Mobile No",
            value: res.data?.mobileNo,
            isReject: false,
          },
          {
            title: "Email Address",
            value: res.data?.emailAddress,
            isReject: false,
          },
          {
            title: "Bank Name",
            value: res.data?.bankName,
            isReject: false,
          },
          {
            title: "Account Number",
            value: res.data?.accountNo,
            isReject: false,
          },
          {
            title: "Acount Name",
            value: res.data?.accountName,
            isReject: false,
          },
        ];
        setData({
          arrayAccountInformation: arrayAccountInformation,
          arrayMerchantInformation: arrayMerchantInformation,
          arrayPaymentInformation: arrayPaymentInformation,
          documents: res.data.documents,
        });
      }
    } catch (error) {}
  };

  return (
    <>
      <TridentityPageHeader title="Update information request detail">
        <div className="list-ation">
          <Button
            disabled={!doHavePermissionToEdit}
            type="primary"
            style={{ marginLeft: 6 }}
            onClick={() => setOpenModalReviewInformation(true)}
          >
            Merchant Approval
          </Button>
        </div>
      </TridentityPageHeader>
      <CardContent customTitle="Basic information">
        <Row>
          <Col span={12}>
            {data?.arrayAccountInformation
              ?.slice(0, 2)
              .map((item: any, idx: number) => (
                <Row className="a-item" key={idx}>
                  <div className="field-name">{item.title}:</div>
                  <div className="field-content">{item.value}</div>
                </Row>
              ))}
          </Col>
          <Col span={12}>
            {data?.arrayAccountInformation
              ?.slice(2)
              .map((item: any, idx: number) => (
                <Row className="a-item" key={idx}>
                  <div className="field-name">{item.title}:</div>
                  <div className="field-content">{item.value}</div>
                </Row>
              ))}
          </Col>
        </Row>

        <div className="account-information-box">
          <div className="card-title">Merchant Information</div>
          <Row>
            <Col span={12}>
              {data?.arrayMerchantInformation
                ?.slice(0, 5)
                .map((item: any, index: number) => {
                  return (
                    <Row className="a-item" key={index}>
                      <div className="field-name">{item.title}:</div>
                      <div className="field-content">{item.value}</div>
                    </Row>
                  );
                })}
            </Col>
            <Col span={12}>
              {data?.arrayMerchantInformation
                ?.slice(5)
                .map((item: any, index: number) => {
                  return (
                    <Row className="a-item" key={index}>
                      <div className="field-name">{item.title}:</div>
                      <div className="field-content">{item.value}</div>
                    </Row>
                  );
                })}
            </Col>
          </Row>
        </div>

        <div className="account-information-box">
          <div className="card-title">Payment Details</div>

          <Row>
            <Col span={12}>
              {data?.arrayPaymentInformation
                ?.slice(0, 4)
                .map((item: any, index: number) => {
                  return (
                    <Row className="a-item" key={index}>
                      <div className="field-name">{item.title}:</div>
                      <div className="field-content">{item.value}</div>
                    </Row>
                  );
                })}
            </Col>
            <Col span={12}>
              {data?.arrayPaymentInformation
                ?.slice(4)
                .map((item: any, index: number) => {
                  return (
                    <Row className="a-item" key={index}>
                      <div className="field-name">{item.title}:</div>
                      <div className="field-content">{item.value}</div>
                    </Row>
                  );
                })}
            </Col>
          </Row>

          <div className="account-information-box">
            <Row>
              <Col span={12}>
                <Row className="a-item b-item">
                  <div className="field-name">Business document</div>
                  {data?.documents?.length > 0 &&
                    data.documents.map((item: string, index: number) => {
                      return (
                        <a
                          className="a-item c-item"
                          key={index}
                          href={item}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FileOutlined className="color-blue" />
                          <div className="field-content color-blue">
                            {last(item.split("/"))}
                          </div>
                        </a>
                      );
                    })}
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </CardContent>
      <ModalDetailMerchantInformationForApproval
        isAtSignup={false}
        selectedMerchantApproval={dataModalReview!}
        onClose={() => setOpenModalReviewInformation(false)}
        onOpen={openModalReviewInformation}
      />
    </>
  );
};

export default UpdateInformationDetailPage;
