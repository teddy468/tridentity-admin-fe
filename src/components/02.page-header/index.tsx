import { PageHeader, PageHeaderProps } from "antd";
import "./styles.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";

export interface TridentityPageHeaderProps extends PageHeaderProps {}

const arrow = () => {
  return (
    <div className="outer">
      <ArrowLeftOutlined style={{ fontSize: "22px" }} />
    </div>
  );
};
const TridentityPageHeader = (props: TridentityPageHeaderProps) => {
  const { className, children, backIcon } = props;

  return (
    <PageHeader
      {...props}
      onBack={() => window.history.back()}
      className={`default-page-header ${className ? className : ""}`}
      backIcon={backIcon ? arrow() : false}
    >
      {children}
    </PageHeader>
  );
};

export default TridentityPageHeader;
