import { SearchOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd';
import CardContent from 'src/routes/components/CardContent';
import './styles.scss';
import InputSearch from 'src/components/07.inputs/InputSearch';

const { Search } = Input;

export interface ProductSearchProps {
  onFinish: (value: any) => void;
  totalItems: number;
}

const ProductSearch = (props: ProductSearchProps) => {
  return (
    <CardContent className='transaction-search'>
      <div className='transaction-search-form'>
        <Row gutter={30}>
          <Col span={24}>
            <Form.Item label='' name='keyword'>
              <InputSearch
                searchResultCount={props.totalItems}
                placeholder='Search Product'
                debounceTime={800}
                handleChangeSearch={(e) =>
                  props.onFinish({ keyword: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={10}></Col>
        </Row>
      </div>
    </CardContent>
  );
};

export default ProductSearch;
