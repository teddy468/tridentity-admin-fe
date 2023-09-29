import "./styles.scss";
import { Button, Form, Input, Modal, message } from "antd";
import { ERRORS, formMessageCreateCategory } from "src/constants/messages";
import { useCallback, useEffect, useRef, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { ImageInput, ImageInputRef } from "src/components/16.image-input";
import { CategoryService } from "src/services/category-service";
import { ServiceBase } from "src/services/core/service-base";
import { AxiosError } from "axios";
import { IMAGE_SIZE_ALLOW } from "src/constants";
import { formatRemoveExcessEmptyLine } from "src/helpers";

export interface Props {
  onEdit: Partial<CategoryItem> | null;
  onClose: () => void;
  onSubmit: () => void;
}

declare interface CreateUpdateCategoryValues {
  name: string;
  description: string;
  parent_category_id: string | number;
  cover: string | File;
  image: string | File;
}

const CreateUpdateCategoryModal = (props: Props) => {
  const { onEdit, onClose, onSubmit } = props;
  const imageInput = useRef<ImageInputRef | null>(null);
  const coverInput = useRef<ImageInputRef | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<CreateUpdateCategoryValues>();
  const categoryService = new CategoryService();
  const baseService = new ServiceBase();

  const handleReset = useCallback(() => {
    imageInput.current?.reset();
    coverInput.current?.reset();
    form.resetFields();
    form.setFieldsValue({
      name: onEdit?.name || "",
      description: onEdit?.description || "",
      parent_category_id: onEdit?.parent_category_id || "",
      cover: onEdit?.cover || "",
      image: onEdit?.image || "",
    });
  }, [form, onEdit]);

  useEffect(handleReset, [handleReset]);

  const handleSubmit = async (values: CreateUpdateCategoryValues) => {
    setLoading(true);
    try {
      const uploadPromise = [];

      if (values.image instanceof File)
        uploadPromise.push(baseService.uploadImage(values.image as any));
      else uploadPromise.push(null);

      if (values.cover instanceof File)
        uploadPromise.push(baseService.uploadImage(values.cover as any));

      const uploadResults = await Promise.all(uploadPromise);
      const [image, cover] = uploadResults.map((item) => item?.file_url);
      const body: CreateUpdateCategoryBody = {
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
        parent_category_id: Number(values.parent_category_id) || null,
        image: image || (typeof values.image === "string" ? values.image : ""),
        cover: cover || (typeof values.cover === "string" ? values.cover : ""),
        settings: { is_highlight: false, is_top: false },
        status: 1,
      };
      await (onEdit?.id
        ? categoryService.updateCategory(onEdit.id, body)
        : categoryService.createCategory(body));
      message.success(
        `${onEdit?.id ? "Update" : "Create"} ${
          values?.parent_category_id && "sub"
        }category successfully`
      );
      onSubmit();
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const messageText =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : `${onEdit?.id ? "Edit" : "Create"} category failed`;
      message.error(messageText);
    }
    setLoading(false);
  };

  const onFinishFailed = (
    errorInfo: ValidateErrorEntity<CreateUpdateCategoryValues>
  ) => {
    const namePath = errorInfo.errorFields[0].name;
    form.getFieldInstance(namePath)?.focus();
  };

  return (
    <Modal
      className="create-update-category-modal"
      open={!!onEdit}
      onCancel={onClose}
      title={`${onEdit?.id ? "Edit" : "Create New"} ${
        onEdit?.parent_category_id ? "Sub " : ""
      }Category`}
      footer={false}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        validateMessages={formMessageCreateCategory}
      >
        <Form.Item name="parent_category_id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          name="name"
          label={`${
            onEdit?.parent_category_id ? "Sub category name" : "Category name"
          } `}
          rules={[
            {
              required: true,
              max: 100,
            },
          ]}
          validateTrigger="onBlur"
          labelCol={{ span: 24 }}
        >
          <Input
            placeholder={`${
              onEdit?.parent_category_id ? "Sub category name" : "Category name"
            } `}
            onBlur={(e) => {
              form.setFieldsValue({
                name: e.target.value.trim(),
              });
            }}
            maxLength={100}
            showCount
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={`${
            onEdit?.parent_category_id
              ? "Sub category description"
              : "Category description"
          }`}
          rules={[{ max: 100, message: ERRORS.REQUIRED }]}
          validateTrigger="onBlur"
          labelCol={{ span: 24 }}
        >
          <TextArea
            placeholder={`${
              onEdit?.parent_category_id
                ? "Sub category description"
                : "Category description"
            }`}
            rows={2}
            maxLength={100}
            showCount
            onBlur={(e) => {
              const newSentence = formatRemoveExcessEmptyLine(e.target.value);
              form.setFieldsValue({
                description: newSentence,
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label={`${
            onEdit?.parent_category_id ? "Sub " : ""
          }Category Image (SVG, PNG, JPG (max. 2MB))`}
          htmlFor="image"
          name="image"
          rules={[
            {
              required: !onEdit?.id,
              message: ERRORS.REQUIRED,
            },
            {
              validator: (_, value) => {
                if (
                  value instanceof File &&
                  value.size > IMAGE_SIZE_ALLOW.twoMB
                ) {
                  form.setFields([
                    {
                      name: "image",
                      errors: [ERRORS.NOT_EXCEED_2MB],
                    },
                  ]);
                  return Promise.reject(ERRORS.NOT_EXCEED_2MB);
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <ImageInput
            name="image"
            url={onEdit?.image}
            createRef={(ref) => (imageInput.current = ref)}
            fileTypes={["image/svg+xml", "image/png", "image/jpeg"]}
            form={form}
          />
        </Form.Item>
        <Form.Item
          label={`${
            onEdit?.parent_category_id ? "Sub " : ""
          }Category Cover (SVG, PNG, JPG (max. 2MB))`}
          htmlFor="cover"
          name="cover"
          rules={[
            { required: !onEdit?.id, message: ERRORS.REQUIRED },
            {
              validator: (_, value) => {
                if (
                  value instanceof File &&
                  value.size > IMAGE_SIZE_ALLOW.twoMB
                ) {
                  form.setFields([
                    {
                      name: "image",
                      errors: [ERRORS.NOT_EXCEED_2MB],
                    },
                  ]);
                  return Promise.reject(ERRORS.NOT_EXCEED_2MB);
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <ImageInput
            name="cover"
            url={onEdit?.cover}
            createRef={(ref) => (coverInput.current = ref)}
            fileTypes={["image/svg+xml", "image/png", "image/jpeg"]}
            form={form}
          />
        </Form.Item>
        <div className="create-update-category-action">
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {onEdit?.id ? "Edit " : "Create "}{" "}
            {onEdit?.parent_category_id ? "Sub" : " "} Category
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateCategoryModal;
