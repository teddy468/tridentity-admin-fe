import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import InputSearch from "src/components/07.inputs/InputSearch";
import CardContent from "src/routes/components/CardContent";

export interface Props {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showConfig?: boolean;
  onClickConfig?: () => void;
  totalItemsTable: number;
  placeholder?: string;
}

const CategoryAttributeSearch = (props: Props) => {
  const {
    onSearch,
    onClickConfig,
    showConfig,
    totalItemsTable,
    placeholder = "Search Category/Attribute",
  } = props;
  const [form] = useForm();
  return (
    <CardContent className="category-attribute-search-card">
      <div className="category-attribute-search-form">
        <Form form={form}>
          <Row gutter={30}>
            <Col span={10}>
              <Form.Item label="" name="search" noStyle>
                <InputSearch
                  searchResultCount={totalItemsTable}
                  placeholder={placeholder}
                  handleChangeSearch={onSearch}
                  debounceTime={800}
                />
              </Form.Item>
            </Col>
            {showConfig ? (
              <Col
                span={4}
                offset={10}
                style={{ justifyContent: "flex-end", display: "flex" }}
              >
                <Form.Item noStyle>
                  <Button
                    type="primary"
                    onClick={onClickConfig}
                    disabled={!onClickConfig}
                  >
                    Config
                  </Button>
                </Form.Item>
              </Col>
            ) : (
              ""
            )}
          </Row>
        </Form>
      </div>
    </CardContent>
  );
};

export default CategoryAttributeSearch;
