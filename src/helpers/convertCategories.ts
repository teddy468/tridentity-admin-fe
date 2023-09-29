export const getCategoriesTrees = (categories: Category[]) => {
  const converted: CategoryTree[] = categories.map((item) => ({
    ...item,
    children: [],
  }));
  const trees: CategoryTree[] = [];
  converted.forEach((item) => {
    if (!item.parent_category_id) return trees.push(item);
    item.parent = converted.find(
      (category) => category.id === item.parent_category_id
    );
    if (item.parent?.status === 0) item.status = 0;
    item.parent?.children.push(item);
  });
  return trees;
};

const getParents = (
  parents: CategoryTree[],
  parent: CategoryTree
): CategoryTree[] => {
  if (parent.parent)
    return getParents([parent.parent, ...parents], parent.parent);
  else return parents;
};

export const getCategoriesRows = (
  categories: Category[]
): (Category | null)[][] => {
  const trees = getCategoriesTrees(categories);
  const parents: CategoryTree[] = [];
  const gotoLast = (tree: CategoryTree) => {
    if (!tree.children.length) parents.push(tree);
    tree.children.map((item) => gotoLast(item));
  };
  gotoLast(trees[0]);

  const rows = parents.map((item) => {
    return [...getParents([], item), item];
  });
  const shows: CategoryTree[] = [];
  return rows.map((row) =>
    row.map((item) => {
      if (shows.includes(item)) return null;
      shows.push(item);
      return item;
    })
  );
};

export const CategoryLevel = (
  level1: Category[],
  level2: Category[],
  level3: Category[]
) => {
  const categoryTreeLevel: Category[][] = [];

  if (level3.length > 0) {
    level3.forEach((item: any) => {
      const arrayCate = [];
      const level2OfItemIdx = level2.findIndex(
        (level2Item: any) => level2Item.id === item.parent_category_id
      );
      const level2OfItem = level2.splice(level2OfItemIdx, 1);

      const level1OfItemIdx = level1.findIndex(
        (level1Item: any) =>
          level1Item.id === level2OfItem[0].parent_category_id
      );
      const level1OfItem = level1.splice(level1OfItemIdx, 1);

      arrayCate.push(level1OfItem[0]);
      arrayCate.push(level2OfItem[0]);
      arrayCate.push(item);
      categoryTreeLevel.push(arrayCate);
    });
    if (level2.length > 0) {
      level2.forEach((item: any) => {
        const arrayCate = [];
        const level1OfItemIdx = level1.findIndex(
          (level1Item: any) => level1Item.id === item.parent_category_id
        );
        const level1OfItem = level1.splice(level1OfItemIdx, 1);
        arrayCate.push(level1OfItem[0]);
        arrayCate.push(item);
        categoryTreeLevel.push(arrayCate);
      });
    }
    if (level1.length > 0) {
      level1.forEach((item: any) => {
        const arrayCate = [];
        arrayCate.push(item);
        categoryTreeLevel.push(arrayCate);
      });
    }
  } else if (level2.length > 0) {
    level2.forEach((item: any) => {
      const arrayCate = [];
      const level1OfItemIdx = level1.findIndex(
        (level1Item: any) => level1Item.id === item.parent_category_id
      );
      const level1OfItem = level1.splice(level1OfItemIdx, 1);
      arrayCate.push(level1OfItem[0]);
      arrayCate.push(item);
      categoryTreeLevel.push(arrayCate);
    });
    if (level1.length > 0) {
      level1.forEach((item: any) => {
        const arrayCate = [];
        arrayCate.push(item);
        categoryTreeLevel.push(arrayCate);
      });
    }
  } else {
    level1.forEach((item: any) => {
      const arrayCate = [];
      arrayCate.push(item);
      categoryTreeLevel.push(arrayCate);
    });
  }

  return categoryTreeLevel;
};

export const GetCateLevel = (
  level1: Category[],
  level2: Category[],
  level3: Category[]
) => {
  const cateTest: any = [];
  if (level3.length > 0) {
    level3.forEach((itemLv3: any) => {
      const arrayCate: any = [];
      const itemLevel2 = level2.find(
        (itemLevel2: any) => itemLevel2.id === itemLv3.parent_category_id
      );

      const itemLevel1 = level1.find(
        (itemLevel1: any) => itemLevel1.id === itemLevel2!.parent_category_id
      );
      arrayCate.push(itemLevel1);
      arrayCate.push(itemLevel2);
      arrayCate.push(itemLv3);
      cateTest.push(arrayCate);
    });
  }
};
