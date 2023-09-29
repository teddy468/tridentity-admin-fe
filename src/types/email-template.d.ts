declare interface EmailTemplateItem {
  id: string;
  name: string;
  pre_header: string;
  sender_name: string;
  subject: string;
  body: string;
}

declare interface EmailTemplateBody extends Omit<EmailTemplateItem, "id"> {}
