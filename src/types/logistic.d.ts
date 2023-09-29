import { Moment } from "moment";

export interface CreateUpdateLogisticFeeValues {
  from: number;
  to: number;
  base: number;
  baseDistance: number;
  extra: number;
}

export interface CreateUpdateLogisticFeeForm
  extends CreateUpdateLogisticFeeValues {
  from: Moment;
  to: Moment;
}
export interface LogisticItem extends CreateUpdateLogisticFeeValues {
  id: number;
  created_at: string;
  updated_at: string;
}
