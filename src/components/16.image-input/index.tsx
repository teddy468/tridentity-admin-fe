import { Form, FormInstance, Upload } from "antd";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./image-input.module.scss";
import { ERRORS } from "src/constants/messages";
import { IMAGE_SIZE_ALLOW } from "src/constants";

export interface ImageInputRef {
  reset: () => void;
}

interface ImageInputProps {
  name: string;
  url?: string;
  className?: string;
  style?: CSSProperties;
  createRef?: (ref: ImageInputRef) => void;
  fileTypes: string[];
  form: any;
}

export const ImageInput = (props: ImageInputProps) => {
  const { name, url, className, style, createRef, fileTypes, form } = props;
  const [trigger, setTrigger] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(url || null);

  useEffect(() => {
    createRef?.({
      reset: () => {
        setPreview(url || null);
        if (input.current) input.current.value = "";
      },
    });
  }, [url, setPreview, createRef]);

  useEffect(() => {
    setPreview(url || null);
  }, [url]);

  const onChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string | null);
    reader.readAsDataURL(file);
    if (file && file.size > IMAGE_SIZE_ALLOW.twoMB) {
      form.setFields([
        {
          name: "image",
          errors: [ERRORS.NOT_EXCEED_2MB],
        },
      ]);
    }
  };

  return (
    <Form.Item
      className={styles.box}
      htmlFor={name}
      colon={false}
      dependencies={[name]}
      label={
        <div
          className={`${styles.label} ${className ?? ""}`}
          style={style}
          title="Update"
        >
          {preview ? (
            <div className={styles.preview}>
              <img
                className={`${styles.image} ${className ?? ""}`}
                alt={url || name}
                src={preview}
              />
              <div className={styles.over}>
                <UploadOutlined size={2} />
                Update
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <PlusOutlined size={2} />
              Upload
            </div>
          )}
        </div>
      }
    >
      {({ setFieldValue }) => (
        <input
          ref={input}
          hidden
          name={name}
          id={name}
          type="file"
          accept={fileTypes.join(",")}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            if (file) onChange(file);
            setFieldValue(name, file);
            setTrigger(!trigger);
          }}
        />
      )}
    </Form.Item>
  );
};
