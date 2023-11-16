type Prettify<T> = { [K in keyof T]: T[K] } & {};
type AnyFunction = (...args: any[]) => any;

interface IPagination {
  page: number;
  pageSize: number;
}
