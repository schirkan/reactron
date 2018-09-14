export interface IGridLayoutTileOptions {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  content: string;
  style: any;
}
export interface IGridLayoutOptions {
  rows: number;
  cols: number;
  gridStyle: any;
  tileStyle: any;
  tiles: IGridLayoutTileOptions[];
}