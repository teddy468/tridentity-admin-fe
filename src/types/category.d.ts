declare interface CreateUpdateCategoryBody {
  name: string;
  description: string;
  parent_category_id: number | null;
  cover: string;
  image: string;
  settings: {
    is_highlight: boolean;
    is_top: boolean;
  };
  status: number;
}

declare interface CategoryItem {
  name: string;
  description: string;
  parent_category_id: number | null;
  cover: string;
  image: string;
  settings: {
    is_highlight: boolean;
    is_top: boolean;
  };
  id: number;
  sub_category_count: string;
  product_count: number;
  status: 1 | 0;
}

declare interface CategoryConfig {
  category: CategoryItem;
  position: number;
}
declare interface Category extends CategoryItem {}

declare interface CategoryTree extends Category {
  parent?: CategoryTree;
  children: CategoryTree[];
  parents?: CategoryTree[];
}

declare interface SubCategoryItem extends Omit<CategoryTree, "children"> {}
