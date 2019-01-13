export interface IGridLayoutTileOptions {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  content: string;
  style: React.CSSProperties;
}

export interface IGridLayoutOptions {
  gridStyle: React.CSSProperties;
  tileStyle: React.CSSProperties;
  tiles: IGridLayoutTileOptions[];
}