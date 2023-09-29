import { Form, Input, Modal, TimePicker, TimePickerProps } from "antd";
import "./styles.scss";
import { Store } from "antd/lib/form/interface";
import { useEffect } from "react";
import moment from "moment";

interface EditSettlementReportTimeProps {
  open: boolean;
  onClose: () => void;
  onSetSettlementReportTime: (time: {
    hour: number;
    minute: number;
    second: number;
  }) => void;
  initialValues?: Store | undefined;
}
const EditSettlementReportPopup: React.FC<EditSettlementReportTimeProps> = ({
  open,
  onClose,
  onSetSettlementReportTime,
  initialValues,
}: EditSettlementReportTimeProps) => {
  const [form] = Form.useForm();
  const onFinish = (values: { settlement_report_time: Date }) => {
    onSetSettlementReportTime({
      hour: moment(values.settlement_report_time).get("hour"),
      minute: moment(values.settlement_report_time).get("minute"),
      second: moment(values.settlement_report_time).get("second"),
    });
    handleCancel();
  };
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (initialValues) {
      const hour =
        initialValues.hour < 10 ? `0${initialValues.hour}` : initialValues.hour;
      const minute =
        initialValues.minute < 10
          ? `0${initialValues.minute}`
          : initialValues.minute;
      const second =
        initialValues.second < 10
          ? `0${initialValues.second}`
          : initialValues.second;
      const time = moment(`${hour} : ${minute} : ${second}`, "HH:mm:ss");
      form.setFieldsValue({ settlement_report_time: time });
    }
  }, [initialValues, form]);

  return (
    <Modal
      title="Edit Settlement Report Time"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Save"
    >
      <Form
        onFinish={onFinish}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={initialValues}
      >
        <Form.Item
          name="settlement_report_time"
          label="Settlement Report Time"
          required
          rules={[
            {
              required: true,
              message: "Please choose settlement report time",
            },
          ]}
        >
          <TimePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSettlementReportPopup;
