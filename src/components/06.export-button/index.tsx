import { FileOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from "moment";
import { CSVLink } from "react-csv";
import "./styles.scss";

interface ExportButtonProps {
  exportFileName?: string;
  exportData: any;
  headers?: any;
}
const ExportButton = (props: ExportButtonProps) => {
  const { exportFileName, exportData, headers } = props;
  const now = moment().format("DD_MMMM_YYYY");
  const fileName = `${now}_${exportFileName}.csv`;
  return (
    <Button className="export-btn">
      <CSVLink data={exportData} filename={fileName} headers={headers} className="csv-button">
        <FileOutlined />
        <div>Export</div>
      </CSVLink>
    </Button>
  );
};

export default ExportButton;
