import { Form } from "antd";
import EmailTemplateParams from "./EmailTemplateParams";
import { TextEditor } from "src/components/12.editor";
import "./styles.scss";

interface Props {
  data: EmailTemplateItem;
}
const EmailTemplateEdit: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <EmailTemplateParams />
      <Form.Item noStyle dependencies={["body"]}>
        {({ getFieldValue, setFieldsValue }) => {
          return (
            <TextEditor
              value={getFieldValue("body")}
              editorKey={getFieldValue("body") && data}
              onChange={(value) => setFieldsValue({ body: value })}
            />
          );
        }}
      </Form.Item>
    </div>
  );
};

export default EmailTemplateEdit;
