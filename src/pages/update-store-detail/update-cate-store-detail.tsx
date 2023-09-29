import { FormInstance } from "antd";
import React, { useEffect, useState } from "react";
import CustomSelect from "src/components/19.select/CustomSelect";
import { categoryService } from "src/services/category-service";

interface Props {
  form: FormInstance;
  isFormFilled: boolean;
}

const UpdateCateStoreDetail: React.FC<Props> = ({ form, isFormFilled }) => {
  const [optionsCategoryLevel1, setOptionsCategoryLevel1] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionsCategoryLevel2, setOptionsCategoryLevel2] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionsCategoryLevel3, setOptionsCategoryLevel3] = useState<
    { label: string; value: string }[]
  >([]);

  async function handleGetCateLevel1() {
    try {
      const { data } = await categoryService.getCategories({
        page: 1,
        perPage: 1000,
        paginationMetadataStyle: "body",
      });
      setOptionsCategoryLevel1(
        data.data.map((item: CategoryItem) => ({
          value: item.id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetCateLevelChild(ids: string) {
    try {
      const res = await categoryService.getChildCategories(ids);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetCateLevel2(id: number[]) {
    if (id.length === 0) {
      setOptionsCategoryLevel2([]);
      setOptionsCategoryLevel3([]);
      return;
    }
    try {
      const cateLevel2 = await handleGetCateLevelChild(id.join(","));
      const cateOptionsLevel2 = cateLevel2.map((cate: any) => {
        return cate.children?.map((category: Category) => ({
          value: category.id,
          label: category.name,
        }));
      });
      setOptionsCategoryLevel2(cateOptionsLevel2.flat());
    } catch (error) {
      console.log(error);
    }
  }
  async function handleGetCateLevel3(id: number[]) {
    if (id.length === 0) {
      setOptionsCategoryLevel3([]);
      return;
    }
    try {
      const cateLevel3 = await handleGetCateLevelChild(id.join(","));
      const cateOptionsLevel3 = cateLevel3.map((cate: any) => {
        return cate.children?.map((category: Category) => ({
          value: category.id,
          label: category.name,
        }));
      });
      setOptionsCategoryLevel3(cateOptionsLevel3.flat());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetCateLevel1();
  }, []);

  useEffect(() => {
    if (!isFormFilled) return;
    handleGetCateLevel2(
      form.getFieldValue("categoriesLevel1").map((item: Category) => item.id)
    );
    handleGetCateLevel3(
      form.getFieldValue("categoriesLevel2").map((item: Category) => item.id)
    );
  }, [isFormFilled]);
  return (
    <>
      <p>Category Level 1</p>
      <CustomSelect
        rules={[{ required: true, message: "This field is required" }]}
        placeholder="Choose business categories"
        name="categoryLevel1Ids"
        options={optionsCategoryLevel1}
        mode="multiple"
        allowClear
        onChange={handleGetCateLevel2}
      />
      {optionsCategoryLevel2?.length > 0 && (
        <>
          <p>Category Level 2</p>
          <CustomSelect
            rules={[{ required: false, message: "This field is required" }]}
            placeholder="Choose business sub categories level 2"
            name="categoryLevel2Ids"
            options={optionsCategoryLevel2}
            mode="multiple"
            allowClear
            onChange={handleGetCateLevel3}
          />
        </>
      )}
      {optionsCategoryLevel3?.length > 0 && (
        <>
          <p>Category Level 3</p>
          <CustomSelect
            rules={[{ required: false, message: "This field is required" }]}
            placeholder="Choose business sub categories level 3"
            name="categoryLevel3Ids"
            options={optionsCategoryLevel3}
            mode="multiple"
            allowClear
          />
        </>
      )}
    </>
  );
};

export default UpdateCateStoreDetail;
