export type OrderByValues = 'asc' | 'desc';

/**
 * 根据提供的 Object 生成 Record OrderBy 类型
 */
export type OrderByType<T extends Record<string, any>> = T extends Record<string, any>
  ? Record<keyof T, OrderByValues>
  : Record<string, OrderByValues>;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type AnyFunction = (...args: any[]) => any;

export interface IPagination {
  page: number;
  pageSize: number;
}
