import { Form } from "antd";
import EmailTemplateParams from "./EmailTemplateParams";
import "./styles.scss";
import "src/components/12.editor/editor.scss";

const EmailTemplatePreview: React.FC = () => {
  return (
    <div>
      <EmailTemplateParams />
      <Form.Item dependencies={["body"]}>
        {({ getFieldValue }) => {
          const body: string = getFieldValue("body");
          return (
            <div className="email-template-preview-container">
              <div
                className="email-template-preview"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default EmailTemplatePreview;
