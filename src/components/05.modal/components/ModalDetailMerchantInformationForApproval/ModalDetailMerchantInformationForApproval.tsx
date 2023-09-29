import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Pagination, Radio, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect } from "react";
import SearchTable from "src/components/11.tables/SearchTable";
import { UserServices } from "src/services/user-service";
import "./styles.scss";

interface Props {
  isAtSignup: boolean;
  onOpen: boolean;
  onClose: () => void;
  selectedMerchantApproval: MerchantOnboardRequest;
  handleActionMerchant?: (
    textAction: string,
    merchantId: number,
    isMultiple?: boolean,
    rejectedFields?: string[]
  ) => void;
}
const ModalDetailMerchantInformationForApproval: React.FC<Props> = ({
  onOpen,
  onClose,
  selectedMerchantApproval,
  handleActionMerchant,
  isAtSignup,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [formAccountInformation] = Form.useForm<ValueFormApprove>();
  const [merchantDetailInformation, setMerchantDetailInformation] =
    React.useState<any>();
  const userSerivces = new UserServices();

  async function getDataDetailForApproveMerchant(
    selectedMerchantApproval: MerchantOnboardRequest
  ) {
    const accountDocuments = selectedMerchantApproval.documents.map((item) => ({
      values: item,
      name: "DOCUMENTS",
    }));

    const accountInformation = [
      {
        title: "Full Name",
        detail: selectedMerchantApproval.company_name,
        name: "NAME",
      },
      {
        title: "Phone",
        detail: selectedMerchantApproval.phone,
        name: "PHONE",
      },
      {
        title: "Email",
        detail: selectedMerchantApproval.email,
        name: "EMAIL",
      },
    ];
    const merchantInformation = [
      {
        title: "Registered Office Address",
        detail: selectedMerchantApproval.registeredOfficeAddress,
        name: "REGISTERED_OFFICE_ADDRESS",
      },
      {
        title: "SFA Number",
        detail: selectedMerchantApproval.sfaNumber,
        name: "SFA_NUMBER",
      },
      {
        title: "GST Registration Number",
        detail: selectedMerchantApproval.gstRegistrationNumber,
        name: "GST_REGISTRATION_NUMBER",
      },
      {
        title: "Representative Name",
        detail: selectedMerchantApproval.representativeName,
        name: "REPRESENTATIVE_NAME",
      },
      {
        title: "office No",
        detail: selectedMerchantApproval.contactOfficeNo,
        name: "CONTACT_OFFICE_NO",
      },
      {
        title: "Territory",
        detail: selectedMerchantApproval.territory,
        name: "TERRITORY",
      },
      {
        title: "Business Nature",
        detail: selectedMerchantApproval.businessNature,
        name: "BUSINESS_NATURE",
      },
      {
        title: "Email address",
        detail: selectedMerchantApproval.contactEmailAddress,
        name: "CONTACT_EMAIL_ADDRESS",
      },
    ];
    const merchantPaymentInformation = [
      {
        title: "Finance Repesentative Name",
        detail: selectedMerchantApproval.financeRepresentativeName,
        name: "FINANCE_REPRESENTATIVE_NAME",
      },
      {
        title: "Office No",
        detail: selectedMerchantApproval.bankOfficeNo,
        name: "BANK_OFFICE_NO",
      },
      {
        title: "Mobile No",
        detail: selectedMerchantApproval.bankMobileNo,
        name: "BANK_MOBILE_NO",
      },
      {
        title: "Email Address",
        detail: selectedMerchantApproval.bankEmailAddress,
        name: "BANK_EMAIL_ADDRESS",
      },
      {
        title: "Bank Name",
        detail: selectedMerchantApproval.bankName,
        name: "BANK_NAME",
      },
      {
        title: "Account Number",
        detail: selectedMerchantApproval.accountNo,
        name: "ACCOUNT_NO",
      },
      {
        title: "Account Name",
        detail: selectedMerchantApproval.accountName,
        name: "ACCOUNT_NAME",
      },
    ];

    setMerchantDetailInformation({
      accountDocuments,
      accountInformation,
      merchantInformation,
      merchantPaymentInformation,
    });
  }

  async function handleRejectMerchantUpdateInforRequest(body: string[]) {
    setLoading(true);
    try {
      await userSerivces.rejectedMerchantOnboardRequest(
        selectedMerchantApproval!.id,
        { rejectedFields: body }
      );
      message.success("Reject success");
    } catch (error) {
      console.log(error);
      message.error("Reject fail");
    } finally {
      setLoading(false);
      onClose();
    }
  }

  async function handleApproveMerchantUpdateInfoRequest() {
    try {
      await userSerivces.approveMerchantOnboardRequest(
        selectedMerchantApproval.id
      );
      message.success("Approve success");
    } catch (error) {
      console.log(error);
      message.error("Approve fail");
    } finally {
      onClose();
    }
  }

  async function onFinish(values: ValueFormApprove) {
    if (
      Object.keys(values).every(
        (item) => values[item as keyof typeof values] === 1
      )
    ) {
      if (isAtSignup) {
        // function execute accept
        handleActionMerchant &&
          handleActionMerchant("accept", selectedMerchantApproval.id, false);
      } else {
        await handleApproveMerchantUpdateInfoRequest();
      }
    } else {
      const bodyReject = Object.keys(values).filter((item) => {
        return values[item as keyof typeof values] !== 1;
      });
      if (isAtSignup) {
        handleActionMerchant &&
          handleActionMerchant(
            "decline",
            selectedMerchantApproval.id,
            false,
            bodyReject
          );
      } else {
        await handleRejectMerchantUpdateInforRequest(bodyReject);
      }
    }
  }
  const columnsAcountInformation: ColumnsType<any> = [
    {
      title: "No",
      width: 60,
      key: "index",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Account Information",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Details",
      dataIndex: "detail",
      key: "detail",
    },
    {
      width: 200,
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, idx) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={record.name}
          rules={[
            {
              required: true,
              message: "Cant be blank",
            },
          ]}
        >
          <Radio.Group className={"radio-box"}>
            <Radio.Button
              value={record.name}
              style={{ border: "none" }}
              className="reject-btn"
            >
              <div>
                <CloseCircleOutlined />
              </div>
            </Radio.Button>
            <Radio.Button
              value={1}
              style={{ border: "none" }}
              className="accept-btn"
            >
              <div>
                <CheckCircleOutlined />
              </div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      ),
    },
  ];

  const columnsMerchantInformation: ColumnsType<any> = [
    {
      title: "No",
      width: 60,
      key: "index",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Merchant Information",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Details",
      dataIndex: "detail",
      key: "detail",
    },
    {
      width: 200,
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, idx) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={record.name}
          rules={[
            {
              required: true,
              message: "Cant be blank",
            },
          ]}
        >
          <Radio.Group className={"radio-box"}>
            <Radio.Button
              value={record.name}
              style={{ border: "none" }}
              className="reject-btn"
            >
              <div>
                <CloseCircleOutlined />
              </div>
            </Radio.Button>
            <Radio.Button
              value={1}
              style={{ border: "none" }}
              className="accept-btn"
            >
              <div>
                <CheckCircleOutlined />
              </div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      ),
    },
  ];

  const columnsMerchantPaymentInformation: ColumnsType<any> = [
    {
      title: "No",
      key: "index",
      width: 60,
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Merchant Payment Information",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Details",
      dataIndex: "detail",
      key: "detail",
    },
    {
      width: 200,
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, idx) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={record.name}
          rules={[
            {
              required: true,
              message: "Cant be blank",
            },
          ]}
        >
          <Radio.Group className={"radio-box"}>
            <Radio.Button
              value={record.name}
              style={{ border: "none" }}
              className="reject-btn"
            >
              <div>
                <CloseCircleOutlined />
              </div>
            </Radio.Button>
            <Radio.Button
              value={1}
              style={{ border: "none" }}
              className="accept-btn"
            >
              <div>
                <CheckCircleOutlined />
              </div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      ),
    },
  ];

  const columnsAccountDocuments: ColumnsType<any> = [
    {
      title: "No",
      width: 60,
      key: "index",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Business documents",
      dataIndex: "values",
      key: "values",
    },
    {
      width: 200,
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, idx) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={record.name}
          rules={[
            {
              required: true,
              message: "Cant be blank",
            },
          ]}
        >
          <Radio.Group className={"radio-box"}>
            <Radio.Button
              value={record.name}
              style={{ border: "none" }}
              className="reject-btn"
            >
              <div>
                <CloseCircleOutlined />
              </div>
            </Radio.Button>
            <Radio.Button
              value={1}
              style={{ border: "none" }}
              className="accept-btn"
            >
              <div>
                <CheckCircleOutlined />
              </div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    if (selectedMerchantApproval) {
      getDataDetailForApproveMerchant(selectedMerchantApproval);
    }
  }, [selectedMerchantApproval]);
  return (
    <Modal
      className="create-update-category-modal"
      open={onOpen}
      onCancel={onClose}
      title={`Merchant Approval`}
      footer={
        <div className="btn-group">
          {/* ask mrs an about rejected case */}
          {/* <Button
            className="btn-reject"
            onClick={() => {
              handleActionMerchant(
                "decline",
                selectedMerchantApproval.id,
                false
              );
            }}
            loading={loading}
          >
            Decline
          </Button> */}
          <Button onClick={onClose}>Cancel</Button>
          <div>
            <Button
              type="primary"
              className="btn-accept"
              loading={loading}
              onClick={() => {
                formAccountInformation.submit();
              }}
            >
              submit
            </Button>
          </div>
        </div>
      }
      width={1000}
    >
      <Form
        form={formAccountInformation}
        name="form account information"
        onFinish={onFinish}
      >
        {" "}
        <SearchTable
          key={"account-information"}
          columns={columnsAcountInformation}
          dataSource={merchantDetailInformation?.accountInformation}
        />
        <SearchTable
          key={"merchant-information"}
          columns={columnsMerchantInformation}
          dataSource={merchantDetailInformation?.merchantInformation}
        />
        <SearchTable
          key={"merchant-payment-information"}
          columns={columnsMerchantPaymentInformation}
          dataSource={merchantDetailInformation?.merchantPaymentInformation}
        />
        <SearchTable
          key={"account-documents"}
          columns={columnsAccountDocuments}
          dataSource={merchantDetailInformation?.accountDocuments}
        />
      </Form>
    </Modal>
  );
};

export default ModalDetailMerchantInformationForApproval;
