import { Form } from "antd";
import "./styles.scss";
import InputSearch from "src/components/07.inputs/InputSearch";

export interface ProductSearchProps {
  onFinish: (value: any) => void;
  searchResultCount: number;
}

const ProductSearch = (props: ProductSearchProps) => {
  const handleChangeSearch = (e: any) => {
    props.onFinish(e.target.value);
  };

  return (
    <Form.Item label="" name="keyword">
      <InputSearch
        searchResultCount={props.searchResultCount}
        placeholder="Search Product, Store"
        debounceTime={800}
        handleChangeSearch={handleChangeSearch}
      />
    </Form.Item>
  );
};

export default ProductSearch;
