import { Table, TableProps } from "antd";
import "./styles.scss";

export interface SearchTableProps extends TableProps<any> {
  totalItems?: number;
  pageSize?: number;
  current?: number;
}

const SearchTable = (props: SearchTableProps) => {
  const {
    className,
    totalItems,
    current,
    pageSize,
    scroll = { y: "28vw" },
  } = props;
  return (
    <Table
      {...props}
      scroll={scroll}
      className={`search-table-default ${className ? className : null}`}
      pagination={
        totalItems
          ? {
              current,
              pageSize,
              total: totalItems,
              showTotal: (total: number, range: number[]) =>
                `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
            }
          : false
      }
    />
  );
};

export default SearchTable;
