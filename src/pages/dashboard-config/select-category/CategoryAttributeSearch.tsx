import { SearchOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row } from "antd";
import InputSearch from "src/components/07.inputs/InputSearch";
import CardContent from "src/routes/components/CardContent";

const { Search } = Input;

export interface MerchantSearchProps {
  onFinish: (values: { search_value: string }) => void;
  totalItems: number;
}

const MerchantSearch = (props: MerchantSearchProps) => {
  return (
    <CardContent className="transaction-search">
      <div className="transaction-search-form">
        <Row gutter={30}>
          <Col span={24}>
            <Form.Item label="" name="search_value">
              <InputSearch
                searchResultCount={props.totalItems}
                placeholder="Search Category"
                debounceTime={800}
                handleChangeSearch={(e) =>
                  props.onFinish({ search_value: e.target.value })
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </CardContent>
  );
};

export default MerchantSearch;
