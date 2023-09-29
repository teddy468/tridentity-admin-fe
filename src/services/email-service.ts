import { AxiosResponse } from "axios";
import { ServiceBase } from "./core/service-base";

export class EmailServices extends ServiceBase {
  getEmailTemplates = async (): Promise<AxiosResponse<EmailTemplateItem[]>> => {
    return this.get("email-template");
  };

  getEmailTemplateDetail = async (
    id: string
  ): Promise<AxiosResponse<EmailTemplateItem>> => {
    return this.get(`email-template/${id}`);
  };

  createEmailTemplate = async (
    body: EmailTemplateBody
  ): Promise<AxiosResponse<EmailTemplateItem>> => {
    return this.post("email-template", body);
  };

  updateEmailTempate = async (
    id: string,
    body: EmailTemplateBody
  ): Promise<AxiosResponse<EmailTemplateItem>> => {
    return this.put(`email-template/${id}`, body);
  };
}
