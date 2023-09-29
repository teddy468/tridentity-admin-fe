import { EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import CardContent from "src/routes/components/CardContent";
import EditUserMembershipPopup from "./edit-user-membership-popup/edit-user-membership-popup";
import EditMerchantMembershipPopup from "./edit-merchant-membership-popup/edit-merchant-membership-popup";
import EditLPConversionPopup from "./edit-lp-conversion-popup/edit-lp-conversion-popup";
import EditPlatformFeePopup from "./edit-platform-fee-popup/edit-platform-fee-popup";
import { SystemServices } from "src/services/system-service";
import { PARAMETER_KEY } from "src/constants/parameters";
import ConfirmPopup from "./confirm-popup/confirm-popup";
import { toast } from "react-toastify";
import EditOrderReceiveTimeoutPopup from "./edit-order-received-timeout-popup/edit-order-received-timeout-popup";
import EditRefundTimeoutPopup from "./edit-refund-timeout-popup/edit-refund-timeout-popup";
import EditExchangeRatePopup from "./edit-exchange-rate-popup/edit-exchange-rate-popup";
import { formatDisplaySystemMetaParameter } from "src/helpers/parameter";
import { Store } from "antd/lib/form/interface";
import { handleError } from "src/helpers/error";
import { Button, message } from "antd";
import EditAvatarUrl from "./edit-platform-tier-avatar/edit-platform-tier-avatar";
import "./styles.scss";
import EditShippingFeePopup from "./edit-exchange-shipping-fee/edit-exchange-shipping-fee-popup";
import EditFixedShippingFee from "./edit-fixed-shipping-fee/edit-fixed-shipping-fee";
import EditMerchantExchangeRatePopup from "./edit--merchant-exchange-rate-popup/edit-merchant-exchange-rate-popup";
import EditMinOrderPopup from "./edit-min-order-shipping-fee/edit-min-order-shipping-fee-popup";
import EditSettlementReportPopup from "./edit-settlement-report-time/edit-settlement-report-time";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

interface DataType extends Parameter {
  content: string;
}
type ConfigModal =
  | "user-membership"
  | "merchant-membership"
  | "lp-conversion"
  | "platform-fee"
  | "order-received-timeout"
  | "refund-timeout"
  | "exchange-rate"
  | "shipping-fee-enable"
  | "fixed-shipping-fee"
  | "min-order"
  | "merchant-exchange-rate"
  | "settlement-report-time"
  | null;

const Parameters: React.FC = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["parameters-permission"]
  );
  const systemService = new SystemServices();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<ConfigModal>(null);
  const [dataSrc, setDataSrc] = useState<DataType[]>([]);
  const [openConfirmPopup, setOpenConfirmPopup] = useState<boolean>(false);
  const [currentKey, setCurrentKey] = useState<PARAMETER_KEY | null>(null);
  const [lpPercent, setLpPercent] = useState<number>(0);
  const [platformFee, setPlatformFee] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [minPlatformFee, setMinPlatFormFee] = useState<number>(0);
  const [merchantExchangeRate, setMerchantExchangeRate] = useState<{
    lp_rate: number;
    sgd_rate: number;
  }>({
    lp_rate: 0,
    sgd_rate: 0,
  });
  const [isEnabledshippingFee, setIsEnabledshippingFee] =
    useState<boolean>(false);
  const [timeout, setTimeout] = useState<number>(0);
  const [refundTimeout, setRefundTimeout] = useState<number>(0);
  const [tier, setTier] = useState<string>("0");
  const [initialValues, setInitialValues] = useState<Store | undefined>();
  const [avatarEdit, setAvatarEdit] = useState<DataType | null>(null);
  const [exchangeRate, setExchangeRate] = useState<{
    lp_rate: number;
    sgd_rate: number;
  }>({
    lp_rate: 1,
    sgd_rate: 1,
  });
  const [upgradeUserMembershipInfo, setUpgradeUserMembershipInfo] = useState<{
    extra_lp: number;
  }>({
    extra_lp: 0,
  });
  const [platformFeeDiscount, setPlatformFeeDiscount] = useState<number>(0);
  const [platformSettlementReportTime, setPlatformSettlementReportTime] =
    useState<{ hour: number; minute: number; second: number }>({
      hour: 0,
      minute: 0,
      second: 0,
    });
  useEffect(() => {
    getSystemMetaParameters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleText = (record: any) => {
    return record?.description;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      render: (_, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Attributes",
      dataIndex: "description",
      key: "description",
      render: (text: string, record: any) => <span>{handleText(record)}</span>,
    },
    {
      title: "Content",
      dataIndex: "content",
      render: (text) => <div className="parameter-content">{text}</div>,
    },
    {
      title: "Action",
      render: (text, record) => (
        <Button
          disabled={!doHavePermissionToEdit}
          onClick={() => handleConfig(record.key, record)}
          className="antd-btn-nostyles btn-config-param"
        >
          <EditOutlined style={{ color: "#1890FF" }} />
        </Button>
      ),
    },
  ];

  const getSystemMetaParameters = async () => {
    try {
      setLoading(true);
      const res = await systemService.getMetaParameters();
      setDataSrc(
        res?.data.map((item: Parameter) => {
          const content =
            typeof item.value === "string"
              ? item.value
              : formatDisplaySystemMetaParameter(item.value);
          return { ...item, content };
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfig = (key: PARAMETER_KEY, record: DataType) => {
    setCurrentKey(key);
    switch (key) {
      case PARAMETER_KEY.PARMETER_CONFIG_LP_CONVERSION:
        return setOpen("lp-conversion");
      case PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_FEE:
        return setOpen("platform-fee");
      case PARAMETER_KEY.PARMETER_CONFIG_ORDER_RECEIVED_TIMEOUT:
        return setOpen("order-received-timeout");
      case PARAMETER_KEY.PARMETER_CONFIG_REFUND_TIMEOUT:
        return setOpen("refund-timeout");
      case PARAMETER_KEY.PARMETER_CONFIG_EXCHANGE_RATE:
        return setOpen("exchange-rate");
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_0:
        return handleOpenEditMembership("user-membership", "0", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_1:
        return handleOpenEditMembership("user-membership", "1", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_2:
        return handleOpenEditMembership("user-membership", "2", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_3:
        return handleOpenEditMembership("user-membership", "3", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_0:
        return handleOpenEditMembership("merchant-membership", "0", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_1:
        return handleOpenEditMembership("merchant-membership", "1", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_2:
        return handleOpenEditMembership("merchant-membership", "2", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_3:
        return handleOpenEditMembership("merchant-membership", "3", dataSrc);
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_AVATAR_0:
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_AVATAR_1:
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_AVATAR_2:
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_AVATAR_3:
        return setAvatarEdit(record);
      case PARAMETER_KEY.PARMETER_CONFIG_IS_FIXED_SHIPPING_FEE_ENABLED:
        return setOpen("shipping-fee-enable");
      case PARAMETER_KEY.PARMETER_CONFIG_FIXED_SHIPPING_FEE:
        return setOpen("fixed-shipping-fee");
      case PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_MIN_ORDER:
        return setOpen("min-order");
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_EXCHANGE_RATE:
        return setOpen("merchant-exchange-rate");
      case PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_SETTLEMENT_REPORT_TIME:
        return setOpen("settlement-report-time");
      default:
        setOpen(null);
    }
  };
  const editLpConversion = async (percent: number) => {
    try {
      const res = await systemService.setLpConversion(percent);
      if (res?.status === 200) {
        handleSuccess("Edit LP Conversion Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit LP Conversion Failed");
    }
  };
  const editPlatformFee = async (percent: number) => {
    try {
      const res = await systemService.setPlatformFee(percent);
      if (res?.status === 200) {
        handleSuccess("Edit Platform Fee Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Platform Fee Failed");
    }
  };
  const editShippingFee = async (fixed_shipping_fee: number) => {
    try {
      const res = await systemService.setShippingFee(fixed_shipping_fee);
      if (res?.status === 200) {
        handleSuccess("Edit Shipping Fee Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Shipping Fee Failed");
    }
  };

  const editFixedShippingFee = async (
    is_fixed_shipping_fee_enabled: boolean
  ) => {
    try {
      const res = await systemService.setFixedShippingFee(
        is_fixed_shipping_fee_enabled
      );
      if (res?.status === 200) {
        handleSuccess("Edit Enable Shipping Fee Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Enable Shipping Fee Failed");
    }
  };
  const editOrderReceivedTimeout = async (timeout: number) => {
    try {
      const res = await systemService.setOrderReceivedTimeout(timeout);
      if (res?.status === 200) {
        handleSuccess("Edit Order Received Timeout Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Order Received Timeout Failed");
    }
  };
  const editRefundTimeout = async (timeout: number) => {
    try {
      const res = await systemService.setRefundTimeout(timeout);
      if (res?.status === 200) {
        handleSuccess("Edit Refund Timeout Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Refund Timeout Failed");
    }
  };
  const editExchangeRate = async (lp_rate: number, sgd_rate: number) => {
    try {
      const res = await systemService.setExchangeRate(lp_rate, sgd_rate);
      if (res?.status === 200) {
        handleSuccess("Edit Exchange Rate Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Exchange Rate Failed");
    }
  };
  const editMerchantExchangeRate = async (
    lp_rate: number,
    sgd_rate: number
  ) => {
    try {
      const res = await systemService.setMerchantExchangeRate(
        lp_rate,
        sgd_rate
      );
      if (res?.status === 200) {
        handleSuccess("Edit Exchange Rate Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Exchange Rate Failed");
    }
  };
  const editPlatFormMinOrderFee = async (min_platform_fee: number) => {
    try {
      const res = await systemService.setMinOrderFee(min_platform_fee);
      if (res?.status === 200) {
        handleSuccess("Edit Min Order Fee Successfully");
      }
    } catch (error) {
      notifyError(error, "Edit Min Order Fee Failed");
    }
  };
  const editUserMembershipTier = async (
    tier: string,

    extra_lp: number
  ) => {
    if (!tier) {
      toast.error("Tier must be not null", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (typeof extra_lp !== "number") {
      toast.error("Invalid Extra LP", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      const res = await systemService.setUserMembership(
        tier,

        extra_lp
      );
      if (res?.status === 200) {
        handleSuccess("Edit User Membership Tier Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit User Membership Tier Failed");
    }
  };

  const editMerchantMembership = async (
    tier: string,
    platform_fee_discount: number
  ) => {
    if (!tier) {
      toast.error("Tier must be not null", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (typeof platform_fee_discount !== "number") {
      toast.error("Platform fee discount invalid", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      const res = await systemService.setMerchantMembership(
        tier,
        platform_fee_discount
      );
      if (res?.status === 200) {
        handleSuccess("Edit Merchant Membership Tier Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Merchant Membership Tier Failed");
    }
  };

  const editPlatformSettlementReportTime = async (time: {
    hour: number;
    minute: number;
    second: number;
  }) => {
    try {
      const res = await systemService.setPlatformSettlementReportTime(time);
      if (res?.status === 200) {
        handleSuccess("Edit Platform Settlement Report Time Successfully");
      }
    } catch (error: any) {
      notifyError(error, "Edit Platform Settlement Report Time Failed");
    }
  };

  const handleConfirm = () => {
    switch (currentKey) {
      case PARAMETER_KEY.PARMETER_CONFIG_LP_CONVERSION:
        return editLpConversion(lpPercent);
      case PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_FEE:
        return editPlatformFee(platformFee);
      case PARAMETER_KEY.PARMETER_CONFIG_ORDER_RECEIVED_TIMEOUT:
        return editOrderReceivedTimeout(timeout);
      case PARAMETER_KEY.PARMETER_CONFIG_REFUND_TIMEOUT:
        return editRefundTimeout(refundTimeout);
      case PARAMETER_KEY.PARMETER_CONFIG_EXCHANGE_RATE:
        return editExchangeRate(exchangeRate.lp_rate, exchangeRate.sgd_rate);
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_0:
        return editUserMembershipTier(
          tier,
          upgradeUserMembershipInfo?.extra_lp
        );
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_1:
        return editUserMembershipTier(
          tier,
          upgradeUserMembershipInfo?.extra_lp
        );
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_2:
        return editUserMembershipTier(
          tier,
          upgradeUserMembershipInfo?.extra_lp
        );
      case PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_3:
        return editUserMembershipTier(
          tier,
          upgradeUserMembershipInfo?.extra_lp
        );
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_0:
        return editMerchantMembership(tier, platformFeeDiscount);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_1:
        return editMerchantMembership(tier, platformFeeDiscount);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_2:
        return editMerchantMembership(tier, platformFeeDiscount);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_3:
        return editMerchantMembership(tier, platformFeeDiscount);
      case PARAMETER_KEY.PARMETER_CONFIG_FIXED_SHIPPING_FEE:
        return editShippingFee(shippingFee);
      case PARAMETER_KEY.PARMETER_CONFIG_IS_FIXED_SHIPPING_FEE_ENABLED:
        return editFixedShippingFee(isEnabledshippingFee);
      case PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_EXCHANGE_RATE:
        return editMerchantExchangeRate(
          merchantExchangeRate.lp_rate,
          merchantExchangeRate.sgd_rate
        );
      case PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_MIN_ORDER:
        return editPlatFormMinOrderFee(minPlatformFee);
      case PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_SETTLEMENT_REPORT_TIME:
        return editPlatformSettlementReportTime(platformSettlementReportTime);
      default:
        return;
    }
  };

  const handleSuccess = (mess: string) => {
    message.success(mess);
    handleClose();
  };
  const notifyError = (error: any, defaultError: string) => {
    handleError(error, defaultError);
    setOpenConfirmPopup(false);
  };
  const handleClose = () => {
    getSystemMetaParameters();
    setOpenConfirmPopup(false);
  };
  const handleOpenEditMembership = (
    modalType: ConfigModal,
    newTier: string,
    data: DataType[]
  ) => {
    setTier(newTier);
    let initialValue: Store | undefined;
    if (modalType === "merchant-membership") {
      if (newTier === "0") {
        initialValue = data.find(
          (item) =>
            item.key === PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_0
        )?.value as Object;
      }
      if (newTier === "1") {
        initialValue = data.find(
          (item) =>
            item.key === PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_1
        )?.value as Object;
      }
      if (newTier === "2") {
        initialValue = data.find(
          (item) =>
            item.key === PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_2
        )?.value as Object;
      }
      if (newTier === "3") {
        initialValue = data.find(
          (item) =>
            item.key === PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_MEMBERSHIP_3
        )?.value as Object;
      }
      setInitialValues(initialValue);
    }
    if (modalType === "user-membership") {
      if (newTier === "0") {
        initialValue = data.find(
          (item) => item.key === PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_0
        )?.value as Object;
      }
      if (newTier === "1") {
        initialValue = data.find(
          (item) => item.key === PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_1
        )?.value as Object;
      }
      if (newTier === "2") {
        initialValue = data.find(
          (item) => item.key === PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_2
        )?.value as Object;
      }
      if (newTier === "3") {
        initialValue = data.find(
          (item) => item.key === PARAMETER_KEY.PARMETER_CONFIG_USER_MEMBERSHIP_3
        )?.value as Object;
      }
      setInitialValues(initialValue);
    }
    setOpen(modalType);
  };
  return (
    <div>
      <TridentityPageHeader title="Parameters" />

      <CardContent>
        <SearchTable
          title={() => <div className="title-table">DataType list</div>}
          columns={columns}
          dataSource={dataSrc}
          totalItems={0}
          rowKey={"id"}
          loading={loading}
        />
      </CardContent>
      <EditUserMembershipPopup
        tier={tier}
        open={open === "user-membership"}
        onClose={() => setOpen(null)}
        onSetUserMembership={(extra_lp) => {
          setUpgradeUserMembershipInfo({ extra_lp });
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={initialValues}
      />
      <EditMerchantMembershipPopup
        tier={tier}
        open={open === "merchant-membership"}
        onClose={() => setOpen(null)}
        onSetMerchantMembership={(platform_fee_discount) => {
          setPlatformFeeDiscount(platform_fee_discount);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={initialValues}
      />
      <EditLPConversionPopup
        open={open === "lp-conversion"}
        onClose={() => setOpen(null)}
        onSetLPPercent={(percent) => {
          setLpPercent(percent);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_LP_CONVERSION
          )?.value as Object
        }
      />
      <EditMinOrderPopup
        open={open === "min-order"}
        onClose={() => setOpen(null)}
        onSetMinOrder={(minPlatformFee) => {
          setMinPlatFormFee(minPlatformFee);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_MIN_ORDER
          )?.value as Object
        }
      />
      <EditPlatformFeePopup
        open={open === "platform-fee"}
        onClose={() => setOpen(null)}
        onSetPlatformFee={(percent) => {
          setPlatformFee(percent);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_FEE
          )?.value as Object
        }
      />
      <EditAvatarUrl
        onClose={() => setAvatarEdit(null)}
        onSuccess={getSystemMetaParameters}
        data={avatarEdit}
      />
      <EditOrderReceiveTimeoutPopup
        open={open === "order-received-timeout"}
        onClose={() => setOpen(null)}
        onSetTimeOut={(timeout) => {
          setTimeout(timeout);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_ORDER_RECEIVED_TIMEOUT
          )?.value as Object
        }
      />
      <EditRefundTimeoutPopup
        open={open === "refund-timeout"}
        onClose={() => setOpen(null)}
        onSetRefundTimeOut={(timeout) => {
          setRefundTimeout(timeout);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_REFUND_TIMEOUT
          )?.value as Object
        }
      />
      <EditMerchantExchangeRatePopup
        open={open === "merchant-exchange-rate"}
        onClose={() => setOpen(null)}
        onSetMerchantExchangeRate={(lp_rate, sgd_rate) => {
          setMerchantExchangeRate({ lp_rate, sgd_rate });
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_MERCHANT_EXCHANGE_RATE
          )?.value as Object
        }
      />
      <EditExchangeRatePopup
        open={open === "exchange-rate"}
        onClose={() => setOpen(null)}
        onSetExchangeRate={(lp_rate, sgd_rate) => {
          setExchangeRate({
            lp_rate,
            sgd_rate,
          });
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_EXCHANGE_RATE
          )?.value as Object
        }
      />
      <EditFixedShippingFee
        open={open === "shipping-fee-enable"}
        onClose={() => setOpen(null)}
        onSetPlatformFee={(percent) => {
          console.log("Enable", percent);
          setIsEnabledshippingFee(percent);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key ===
              PARAMETER_KEY.PARMETER_CONFIG_IS_FIXED_SHIPPING_FEE_ENABLED
          )?.value as Object
        }
      />
      <EditShippingFeePopup
        open={open === "fixed-shipping-fee"}
        onClose={() => setOpen(null)}
        onSetPlatformFee={(percent) => {
          setShippingFee(percent);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key === PARAMETER_KEY.PARMETER_CONFIG_FIXED_SHIPPING_FEE
          )?.value as Object
        }
      />
      <EditSettlementReportPopup
        open={open === "settlement-report-time"}
        onClose={() => setOpen(null)}
        onSetSettlementReportTime={(time) => {
          setPlatformSettlementReportTime(time);
          setOpenConfirmPopup(true);
          setOpen(null);
        }}
        initialValues={
          dataSrc.find(
            (item: DataType) =>
              item.key ===
              PARAMETER_KEY.PARMETER_CONFIG_PLATFORM_SETTLEMENT_REPORT_TIME
          )?.value as Object
        }
      />
      <ConfirmPopup
        open={openConfirmPopup}
        onClose={() => {
          setOpenConfirmPopup(false);
        }}
        onOk={handleConfirm}
      />
    </div>
  );
};

export default Parameters;
