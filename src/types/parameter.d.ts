declare type PARAMETER_KEY = import("src/constants/parameters").PARAMETER_KEY;

declare interface Parameter {
  key: PARAMETER_KEY;
  tier?: number;
  value:
    | string
    | {
        [key: string]: number;
      };
  description: string;
  status: number;
  create_time: string;
  update_time: string;
}


