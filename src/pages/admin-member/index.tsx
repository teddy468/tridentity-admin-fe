import { Tabs, TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import TridentityPageHeader from "src/components/02.page-header";
import CategoryAttributeSearch from "../category-and-attribute/CategoryAttributeSearch";
import MemberList from "./MemberList";
import OnBoardingList from "./OnBoardingList";
import { MemberService } from "src/services/membere-service";
import { PageQueryParams } from "src/services/params-type";

enum TABS {
  member = "member",
  onBoard = "onBoard",
}

const AdminMember = () => {
  const [totalItemsTable, setTotalItemsTable] = useState(0);
  const [searchMember, setSearchMember] = useState("");
  const [searchOnboard, setSearchOnboard] = useState("");
  const [tab, setTab] = useState<TABS>(TABS.member);
  const [paramsRoles, setParamsRoles] = useState({
    page: 1,
    perPage: 100,
    paginationMetadataStyle: "body",
  } as PageQueryParams);
  const [listOptionsRoles, setListOptionsRoles] = useState<
    { value: number; label: string }[]
  >([]);
  const memberService = new MemberService();

  const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMember(e.target.value);
    setSearchOnboard(e.target.value);
  };

  const onChange = (key: string) => {
    setTab(key as TABS);
  };

  async function handleGetListRole() {
    try {
      const result = await memberService.getListRoles(paramsRoles);
      const { data } = result.data as PaginationData<AdminRole>;
      const optionsRole = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setListOptionsRoles(optionsRole);
    } catch (error) {
      console.log(error);
    }
  }
  const items: TabsProps["items"] = [
    {
      key: TABS.member,
      label: `Trifood Members`,
      children: (
        <>
          <MemberList
            setTotalItemsTable={setTotalItemsTable}
            searchValue={searchMember}
            listOptionsRoles={listOptionsRoles}
            tab={tab}
          />
        </>
      ),
    },
    {
      key: TABS.onBoard,
      label: `On-boarding`,
      children: (
        <>
          <OnBoardingList
            setTotalItemsTable={setTotalItemsTable}
            searchValue={searchOnboard}
            listOptionsRoles={listOptionsRoles}
            tab={tab}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    handleGetListRole();
  }, []);

  return (
    <div>
      <TridentityPageHeader title="Trifood Members" />
      <div className="category-attribute-search  active">
        <CategoryAttributeSearch
          onSearch={onSearch}
          placeholder="Search Member"
          totalItemsTable={totalItemsTable}
        />
      </div>
      <Tabs defaultActiveKey={TABS.member} items={items} onChange={onChange} />
    </div>
  );
};

export default AdminMember;
