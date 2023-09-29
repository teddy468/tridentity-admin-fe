import { Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import CategoryAttributeSearch from "./CategoryAttributeSearch";
import "./styles.scss";
import CategoryList from "./CategoryList";
import AttributeList from "./AttributeList";
import { useSelector } from "react-redux";
import { ReduxStore } from "src/types/globalStore";

enum TABS {
  category = "category",
  attribute = "attribute",
}

const CategoryAndAttributePage = () => {
  const doHavePermissionToEdit = useSelector(
    (state: ReduxStore) => state.user["category-and-attribute-permission"]
  );
  const [totalItemsTable, setTotalItemsTable] = useState(0);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchAttribute, setSearchAttribute] = useState("");
  const [tab, setTab] = useState<TABS>(TABS.category);

  const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCategory(e.target.value);
    setSearchAttribute(e.target.value);
  };

  const items: TabsProps["items"] = [
    {
      key: TABS.category,
      label: `Category`,
      children: (
        <CategoryList
          search={searchCategory}
          setTotalItemsTable={setTotalItemsTable}
          tab={tab}
          doHavePermissionToEdit={doHavePermissionToEdit}
        />
      ),
    },
    {
      key: TABS.attribute,
      label: `Attribute`,
      children: (
        <AttributeList
          search={searchAttribute}
          setTotalItemsTable={setTotalItemsTable}
          tab={tab}
          doHavePermissionToEdit={doHavePermissionToEdit}
        />
      ),
    },
  ];

  const onChange = (key: string) => {
    setTab(key as TABS);
  };

  return (
    <>
      <TridentityPageHeader title="Category & Attribute" />
      <div className="category-attribute-search  active">
        <CategoryAttributeSearch
          onSearch={onSearch}
          totalItemsTable={totalItemsTable}
        />
      </div>
      <Tabs
        defaultActiveKey={TABS.category}
        items={items}
        onChange={onChange}
      />
    </>
  );
};

export default CategoryAndAttributePage;
