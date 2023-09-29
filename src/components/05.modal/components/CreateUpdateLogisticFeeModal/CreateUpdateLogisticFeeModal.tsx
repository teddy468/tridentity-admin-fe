import { Button, Form, Input, Modal, TimePicker, message } from "antd";
import React, { useEffect, useState } from "react";
import "../CreateUpdateCategoryModal/styles.scss";
import { useForm } from "antd/lib/form/Form";
import { LogisticService } from "src/services/logistic-calculation-service";
import moment from "moment";
import {
  CreateUpdateLogisticFeeForm,
  CreateUpdateLogisticFeeValues,
  LogisticItem,
} from "src/types/logistic";
import {
  decimalOnlyInput,
  filterECharacterInputDecimal,
} from "src/helpers/input";

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
  logisticItem?: LogisticItem;
  reFetchData: () => void;
}

const CreateUpdateLogisticFeeModal: React.FC<Props> = ({
  openModal,
  handleCloseModal,
  logisticItem,
  reFetchData,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm<CreateUpdateLogisticFeeForm>();

  async function handleCreateNewLogisticFee(
    values: CreateUpdateLogisticFeeValues
  ) {
    try {
      await LogisticService.addNewLogistic(values);
      message.success("Create new logistic fee success");
    } catch (error: any) {
      message.error(error.response.data.error.message);
      console.log(error.response.data.error.message);
    }
  }

  async function handleUpdateLogisticFee(
    values: CreateUpdateLogisticFeeValues,
    logisticId: number
  ) {
    try {
      await LogisticService.editLogistic(logisticId, values);
      message.success("Update logistic fee success");
    } catch (error: any) {
      message.error(error.response.data.error.message);
      console.log(error.response.data.error.message);
    }
  }

  async function onFinish(values: CreateUpdateLogisticFeeForm) {
    const body = {
      from: moment(values.from).hours() * 60 + moment(values.from).minutes(),
      to: moment(values.to).hours() * 60 + moment(values.to).minutes(),
      base: Number(values.base),
      extra: Number(values.extra),
      baseDistance: Number(values.baseDistance),
    };
    setLoading(true);
    try {
      if (logisticItem?.id) {
        await handleUpdateLogisticFee(body, logisticItem?.id);
      } else {
        await handleCreateNewLogisticFee(body);
      }
      reFetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      closeModal();
    }
  }

  function closeModal() {
    form.resetFields();
    handleCloseModal();
  }

  useEffect(() => {
    if (!logisticItem?.id) return form.resetFields();
    form.setFieldsValue({
      from: moment().startOf("day").add(logisticItem.from, "minutes"),
      to: moment().startOf("day").add(logisticItem.to, "minutes"),
      base: logisticItem.base,
      extra: logisticItem.extra,
      baseDistance: logisticItem.baseDistance,
    });
  }, [logisticItem, openModal]);

  return (
    <Modal
      className="create-update-category-modal"
      open={openModal}
      onCancel={closeModal}
      title={`${logisticItem?.id ? "Edit" : "Create New"} Logistic Fee`}
      footer={false}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="from"
          label="From "
          rules={[
            {
              required: true,
              message: "Please input from hours",
            },
          ]}
        >
          <TimePicker format={"HH:mm "} allowClear use12Hours={false} />
        </Form.Item>
        <Form.Item
          name="to"
          label="To "
          rules={[
            {
              required: true,
              message: "Please input to hours",
            },
          ]}
        >
          <TimePicker format={"HH:mm"} allowClear use12Hours={false} />
        </Form.Item>

        <Form.Item
          name="baseDistance"
          label="Base distance"
          rules={[
            {
              required: true,
              message: "Please input base distance ",
            },
          ]}
        >
          <Input
            type="number"
            prefix={"KM"}
            onChange={(e) =>
              filterECharacterInputDecimal("baseDistance", form, e)
            }
            onKeyDown={decimalOnlyInput}
          />
        </Form.Item>

        <Form.Item
          name="base"
          label="Base fee "
          rules={[
            {
              required: true,
              message: "Please input base fee ",
            },
          ]}
        >
          <Input
            type="number"
            prefix={"$"}
            onChange={(e) => filterECharacterInputDecimal("base", form, e)}
            onKeyDown={decimalOnlyInput}
          />
        </Form.Item>

        <Form.Item
          name="extra"
          label="Extra fee per kilometer"
          rules={[
            {
              required: true,
              message: "Please input extra fee ",
            },
          ]}
        >
          <Input
            type="number"
            prefix={"$"}
            onChange={(e) => filterECharacterInputDecimal("extra", form, e)}
            onKeyDown={decimalOnlyInput}
          />
        </Form.Item>

        <div className="create-update-category-action">
          <Button type="default" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {logisticItem?.id ? "Edit " : "Create "} Logistic Fee
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateLogisticFeeModal;
