import { Checkbox, Col, FormInstance } from "antd";
import React, { useEffect } from "react";
import TimeInput from "src/components/21.timeInput/TimeInput";

interface DayScheduleProps {
  form: FormInstance;
  Form: any;
  item: { openName: string; closeName: string; title: string };
  isFormFilled: boolean;
}

const DaysSchedule: React.FC<DayScheduleProps> = ({
  form,
  item,
  Form,
  isFormFilled,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  useEffect(() => {
    if (!isFormFilled) return;
    !form.getFieldValue(item.openName) && setIsOpen(false);
  }, [isFormFilled]);

  useEffect(() => {
    if (!isOpen) {
      // reset error for open time
      form.setFields([
        {
          name: item.openName,
          errors: [],
          value: null,
        },
      ]);
      // reset error for close time
      form.setFields([
        {
          name: item.closeName,
          errors: [],
          value: null,
        },
      ]);
    }
  }, [isOpen]);

  return (
    <>
      <Col xs={24} sm={2}>
        <p>{item.title}</p>
      </Col>

      {isOpen && (
        <>
          <Col xs={24} sm={8}>
            <TimeInput
              label={""}
              name={item.openName}
              format={"HH:mm"}
              rules={[
                {
                  required: true,
                  message: "Please input open time",
                },
              ]}
            />
          </Col>
          <Col xs={24} sm={8}>
            <TimeInput
              name={item.closeName}
              label=""
              format={"HH:mm"}
              rules={[
                {
                  required: true,
                  message: "Please input close time",
                },
              ]}
            />
          </Col>
        </>
      )}
      <Col xs={24} sm={4}>
        <div style={{ display: "flex", gap: "5px" }}>
          <p>OFF</p>
          <Checkbox
            checked={!isOpen}
            onChange={(e) => {
              setIsOpen(!e.target.checked);
            }}
          />
        </div>
      </Col>
    </>
  );
};

export default DaysSchedule;
