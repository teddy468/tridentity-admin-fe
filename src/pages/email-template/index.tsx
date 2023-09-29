import { EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import SearchTable from "src/components/11.tables/SearchTable";
import CardContent from "src/routes/components/CardContent";
import { EmailServices } from "src/services/email-service";
import { Link, useHistory } from "react-router-dom";
import { PATHS } from "src/constants/paths";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";
import { Button } from "antd";

const EmailTemplate: React.FC = () => {
  const history = useHistory();
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["email-template-permission"]
  );
  const emailService = new EmailServices();
  const [dataSrc, setDataSrc] = useState<EmailTemplateItem[]>([]);
  const [loading, setLoading] = useState(false);

  function handleNavigateToDetail(id: string) {
    history.push(PATHS.emailTemplateDetail().replace(":id", id));
  }

  useEffect(() => {
    const getEmailTemplates = async () => {
      try {
        setLoading(true);
        const res = await emailService.getEmailTemplates();
        if (res?.data) res.data.sort((a, b) => (a.id > b.id ? 1 : -1));
        setDataSrc(res?.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getEmailTemplates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<EmailTemplateItem> = [
    {
      title: "No",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Template Name",
      dataIndex: "name",
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      render: (subject: string) => <span>{subject}</span>,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          onClick={() => handleNavigateToDetail(record.id)}
          className="antd-btn-nostyles"
          style={{ width: "fit-content" }}
          disabled={!doHavePermissionToEdit}
        >
          <EditOutlined style={{ color: "#1890FF" }} />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <TridentityPageHeader title="Email Template" />
      <CardContent>
        <SearchTable
          title={() => <div className="title-table">Email template list</div>}
          columns={columns}
          dataSource={dataSrc}
          totalItems={0}
          rowKey={"id"}
          loading={loading}
        />
      </CardContent>
    </div>
  );
};

export default EmailTemplate;
