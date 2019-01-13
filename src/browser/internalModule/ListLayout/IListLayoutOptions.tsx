import { IListLayoutItemOptions } from "./IListLayoutItemOptions";

export interface IListLayoutOptions {
  listStyle: React.CSSProperties;
  itemStyle: React.CSSProperties;
  items: IListLayoutItemOptions[];
}