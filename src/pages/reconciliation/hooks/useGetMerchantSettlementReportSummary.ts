import { useState } from "react";
import { SettlementService } from "src/services/settlement-service";
import { MerchantSettlementReportDetail } from "src/types/settlemets";

const useGetMerchantSettlementReportSummary = () => {
  const [merchantDataSrc, setMerchantDataSrc] = useState<
    MerchantSettlementReportDetail[]
  >([]);
  const getMerchantSettlementReportsSummary = async (merchantId: string) => {
    try {
      const res = await SettlementService.getMerchantSettlementReportsSummary(
        merchantId
      );
      setMerchantDataSrc([res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    merchantDataSrc,
    setMerchantDataSrc,
    getMerchantSettlementReportsSummary,
  };
};

export default useGetMerchantSettlementReportSummary;
