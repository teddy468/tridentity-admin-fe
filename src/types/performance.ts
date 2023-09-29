export type VaultPerformance = {
  vaultId: number;
  currentInvestment: string;
  name: string;
};

export type VaultPerformanceDetail = {
  epochId: number;
  pnl: any;
  startTime: number;
  endTime: number;
};
