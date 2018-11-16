export interface IGridLayoutTileOptions {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  content: string;
  style: any;
}

export interface IGridLayoutOptions {
  gridStyle: any;
  tileStyle: any;
  tiles: IGridLayoutTileOptions[];
}