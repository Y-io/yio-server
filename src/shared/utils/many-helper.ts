export const paginationHelper = (page = 1, pageSize = 10) => {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
};

export function whereInputHelper<T extends Record<string, any>>(filter = {}) {
  const where: Record<string, any> = {};

  Object.keys(filter).forEach((v) => {
    if (filter[v]) {
      if (!where[v]) {
        where[v] = {};
      }
      where[v]['contains'] = filter[v];
    }
  });

  return where as T;
}

export function transformObjToArr(originObj = {}, defaultObj = {}) {
  const uniqueKeys = new Set([
    ...Object.keys(originObj),
    ...Object.keys(defaultObj),
  ]);

  return Array.from(uniqueKeys).map((key) => ({
    [key]: originObj[key] || defaultObj[key],
  }));
}
