import { Card, CardProps } from 'antd';
import './styles.scss';

interface CardContentProps extends CardProps {
  customTitle?: string;
  isShowExportBtn?: boolean;
  exportButtonElement?: React.ReactElement;
}

const CardContent: React.FC<CardContentProps> = (props) => {
  const { children, customTitle, className, isShowExportBtn, exportButtonElement, ...rest } = props;

  return (
    <Card {...rest} className={`custom-card-content ${className ? className : ''}`}>
      <div className="custom-card-content_header">
        {customTitle ? <div className="card-title">{customTitle}</div> : null}
        {isShowExportBtn ? exportButtonElement : null}
      </div>
      {children}
    </Card>
  );
};

export default CardContent;
