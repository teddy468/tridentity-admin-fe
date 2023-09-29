import React, { useCallback } from "react";
import { Input, InputProps } from "antd";
import { debounce } from "lodash";
import "./styles.scss";
const { Search } = Input;
interface IInputSearch extends InputProps {
  handleChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  debounceTime: number;
  searchResultCount: number;
}

const InputSearch: React.FC<IInputSearch> = (props) => {
  const { placeholder, handleChangeSearch, debounceTime, searchResultCount } =
    props;

  const handleDebounceChange = useCallback(
    debounce(handleChangeSearch, debounceTime),
    [handleChangeSearch]
  );

  const handleChangeInternal = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleDebounceChange(e);
    },
    [handleDebounceChange]
  );
  return (
    <>
      <Search
        allowClear
        placeholder={placeholder}
        onChange={handleChangeInternal}
        enterButton
      />
      <span className="input__result">
        Show{" "}
        <strong className="input__result--count">{searchResultCount}</strong>{" "}
        results
      </span>
    </>
  );
};

export default InputSearch;
