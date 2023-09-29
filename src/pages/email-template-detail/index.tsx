import { useEffect, useState } from "react";
import { useParams } from "react-router";
import NotFound from "src/routes/components/NotFound";
import { EmailServices } from "src/services/email-service";
import { LoadingPage } from "src/routes/components/LoadingPage";
import EmailTemplateForm from "./EmailTemplateForm";
import "./styles.scss";

const EmailTemplateDetail: React.FC = () => {
  const [data, setData] = useState<EmailTemplateItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const emailService = new EmailServices();

  const getEmailTemplates = async () => {
    try {
      setLoading(true);
      const res = await emailService.getEmailTemplateDetail(id);
      setLoading(false);
      setData(res?.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmailTemplates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingPage />;

  if (!data) return <NotFound />;

  return <EmailTemplateForm data={data} />;
};

export default EmailTemplateDetail;
