import { Col, Form, Input, Row } from "antd";
import React from "react";
import PlacesAutoComplete from "src/components/22.map/PlacesAutoComplete";
import CustomInput from "../productManagement/CustomInput/CustomInput";
import { filterECharacterInputNumber } from "src/helpers/integerOnly";
import { FormInstance } from "antd/es/form/Form";
import { removeExtraSpace } from "src/helpers";
import { PHONE_NUMBER_PATTERN } from "src/constants/patern";

interface Props {
  form: FormInstance;
}

const UpdateStoreAddress: React.FC<Props> = ({ form }) => {
  return (
    <div>
      <CustomInput
        prefix="+65 |"
        name="phone"
        label="Phone number"
        onChange={(event) => filterECharacterInputNumber("phone", form, event)}
        rules={[
          { required: true, message: "This field is required" },
          { pattern: PHONE_NUMBER_PATTERN, message: "Phone number invalid" },
        ]}
        placeholder="Input your phone number"
        onBlur={(e) => removeExtraSpace(e, form, "phone")}
      />
      <Form.Item name="coordinate" noStyle>
        <Input hidden />
      </Form.Item>
      <Form.Item noStyle dependencies={["coordinate"]}>
        {({ getFieldValue, setFieldValue, setFieldsValue, validateFields }) => (
          <PlacesAutoComplete
            selected={getFieldValue("coordinate")}
            setSelected={(value) => {
              setFieldsValue({ coordinate: value });
              setFieldValue("coordinate", value);
            }}
            defaultAddress={getFieldValue("address")}
            validateAddress={() => validateFields(["address"])}
            setLocation={(data) => {
              setFieldValue("address", data?.description || "");
            }}
          />
        )}
      </Form.Item>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <CustomInput
            name="location_type"
            label="Landmark"
            rules={[{ required: true, message: "This field is required" }]}
            placeholder="Landmark"
            maxLength={100}
            onBlur={(e) => removeExtraSpace(e, form, "location_type")}
          />
        </Col>
        <Col xs={24} sm={12}>
          <CustomInput
            name="postal_code"
            label="Postal code"
            rules={[{ required: true, message: "This field is required" }]}
            placeholder="Postal code"
            maxLength={6}
            onChange={(event) =>
              filterECharacterInputNumber("postal_code", form, event)
            }
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <CustomInput
            name="city_or_province"
            label="City"
            rules={[{ required: true, message: "This field is required" }]}
            placeholder="City"
            onBlur={(e) => removeExtraSpace(e, form, "city_or_province")}
            maxLength={20}
          />
        </Col>
        <Col xs={24} sm={12}>
          <CustomInput
            name="country"
            label="Country"
            rules={[{ required: true, message: "This field is required" }]}
            placeholder="Country"
            maxLength={20}
            onBlur={(e) => removeExtraSpace(e, form, "country")}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UpdateStoreAddress;
