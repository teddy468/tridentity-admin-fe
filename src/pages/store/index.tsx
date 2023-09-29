import { Col, Row, Tabs, TabsProps } from "antd";
import { useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import InputSearch from "src/components/07.inputs/InputSearch";
import CardContent from "src/routes/components/CardContent";
import "../consumer/styles.scss";
import useControlTabs from "src/hooks/useControlTabs";
import StoreListRequest from "./StoreRequestList";
import StoreList from "./StoreList";
import StoreRejectedList from "./StoreRejectList";
import StoreUpdateList from "./StoreUpdateList";
import StoreRejectUpdateList from "./StoreRejectUpdateList";

export enum StoreTabEnum {
  STORE_LIST,
  STORE_REQUESTS_LIST,
  STORE_REJECTED_LIST,
  STORE_UPDATE_LIST,
  STORE_UPDATE_REJECT_LIST,
}

const Store = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const { activeTab, onChange } = useControlTabs(
    StoreTabEnum.STORE_LIST.toString()
  );

  const handleChangeSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const itemsTab: TabsProps["items"] = [
    {
      key: StoreTabEnum.STORE_LIST.toString(),
      label: "Store list",
      children: (
        <StoreList
          search={search}
          setTotalItems={setTotalItems}
          activeTab={activeTab}
        />
      ),
    },
    {
      key: StoreTabEnum.STORE_REQUESTS_LIST.toString(),
      label: "Store request list",
      children: (
        <StoreListRequest
          search={search}
          setTotalItems={setTotalItems}
          activeTab={activeTab}
        />
      ),
    },

    {
      key: StoreTabEnum.STORE_REJECTED_LIST.toString(),
      label: "Store reject list",
      children: (
        <StoreRejectedList
          search={search}
          setTotalItems={setTotalItems}
          activeTab={activeTab}
        />
      ),
    },
    {
      key: StoreTabEnum.STORE_UPDATE_LIST.toString(),
      label: "Store request update list",
      children: (
        <StoreUpdateList
          search={search}
          setTotalItems={setTotalItems}
          activeTab={activeTab}
        />
      ),
    },
    {
      key: StoreTabEnum.STORE_UPDATE_REJECT_LIST.toString(),
      label: "Store request update reject list",
      children: (
        <StoreRejectUpdateList
          search={search}
          setTotalItems={setTotalItems}
          activeTab={activeTab}
        />
      ),
    },
  ];

  return (
    <>
      <TridentityPageHeader title="Merchant stores" />
      <CardContent className="transaction-search">
        <div className="transaction-search-form">
          <Row gutter={30}>
            <Col span={10}>
              <InputSearch
                searchResultCount={totalItems || 0}
                placeholder="Search Consumer"
                handleChangeSearch={handleChangeSearch}
                debounceTime={800}
              />
            </Col>
            <Col span={10}></Col>
            <Col
              span={4}
              style={{ justifyContent: "flex-end", display: "flex" }}
            ></Col>
          </Row>
        </div>
      </CardContent>
      <CardContent>
        <Tabs
          defaultActiveKey={StoreTabEnum.STORE_LIST.toString()}
          activeKey={activeTab}
          items={itemsTab}
          onChange={onChange}
        />
      </CardContent>
    </>
  );
};

export default Store;
