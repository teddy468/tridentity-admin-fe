import { Button, Form, Input, Tabs, TabsProps, message } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AxiosError } from "axios";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { EmailServices } from "src/services/email-service";
import CardContent from "src/routes/components/CardContent";
import { PATHS } from "src/constants/paths";
import EmailTemplatePreview from "./EmailTemplatePreview";
import EmailTemplateEdit from "./EmailTemplateEdit";
import "./styles.scss";
import { getContentByHTML, getHTMLByContent } from "./helper";

enum TABS {
  preview = "preview",
  edit = "edit",
}
interface Props {
  data: EmailTemplateItem;
}

const EmailTemplateForm: React.FC<Props> = (props) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [form] = Form.useForm<EmailTemplateBody>();

  const emailService = new EmailServices();

  useEffect(() => {
    form.setFieldsValue({ ...data, body: getContentByHTML(data.body) });
  }, [data, form]);

  const handleSubmit = async (values: EmailTemplateBody) => {
    setLoading(true);
    try {
      const res = await emailService.updateEmailTempate(id, {
        ...data,
        ...values,
        body: getHTMLByContent(values.body, values.pre_header),
      });
      if (res.data) message.success("Update email template success");
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const errorMessage =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Update attribute failed";
      message.error(errorMessage);
    }
    setLoading(false);
  };

  const onFinishFailed = (
    errorInfo: ValidateErrorEntity<EmailTemplateBody>
  ) => {
    const namePath = errorInfo.errorFields[0].name;
    form.getFieldInstance(namePath)?.focus();
  };

  const items: TabsProps["items"] = [
    {
      key: TABS.preview,
      label: `Preview`,
      children: <EmailTemplatePreview />,
    },
    {
      key: TABS.edit,
      label: `Edit`,
      children: <EmailTemplateEdit data={data} />,
    },
  ];

  return (
    <Form
      className="email-template-detail"
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
    >
      <CardContent>
        <div className="email-template-header">
          <div className="email-template-title">Email template list</div>
          <div className="email-template-action">
            <Button
              type="default"
              onClick={() => history.push(PATHS.emailTemplate())}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" disabled={loading}>
              {loading ? "Saving" : "Save"}
            </Button>
          </div>
        </div>
        <Tabs
          defaultActiveKey={TABS.edit}
          items={items}
          className="email-template-tabs"
        />
        <Form.Item name="body" noStyle>
          <Input type="hidden" />
        </Form.Item>
      </CardContent>
    </Form>
  );
};

export default EmailTemplateForm;
