export type OrderByValues = 'asc' | 'desc';

/**
 * 根据提供的 Object 生成 Record OrderBy 类型
 */
export type OrderByType<T extends Record<string, any>> = T extends Record<
  string,
  any
>
  ? Record<keyof T, OrderByValues>
  : Record<string, OrderByValues>;
