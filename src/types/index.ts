export type BOOLEAN_REACT_DOM = 1 | 0;

const KeyToVal = {
  key1: 'user_reject',
  key2: 'un_support_chain',
  key3: 'no_eth_provider',
} as const;

type Keys = keyof typeof KeyToVal;
type Values = (typeof KeyToVal)[Keys];

export type WEB3_ERROR = {
  type: Values;
  message: string;
  /*
  object error
  */
  description: any;
};
export interface PaginationQuery {
  page?: number;
  perPage?: number;
  paginationMetadataStyle?: 'header' | 'body';
}

export interface UploadResponse {
  create_time: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  id: number;
  key: string;
  update_time: string;
}

