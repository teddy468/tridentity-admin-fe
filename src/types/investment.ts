export type InvestmentDetailRes = {
  vault_id: number;
  start_time: string;
  end_time: string;
  amount: string;
  name: string;
  pnl: string;
  pnl_id: number;
  epoch_id: number;
};

export type GeneralInvestmentInfoRes = {
  epochRevenue: number;
  vaultAmount: number;
  totalInvest: number;
  totalPnL: number;
};

export type VaultNameConfigRes = {
  _id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
};

export type ConfigPnlRes = {
  _id: string;
  investAmount: string;
  pnl: string;
  vaultId: number;
  epochId: number;
};
