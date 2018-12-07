import { IInputComponentProps } from "@schirkan/reactron-interfaces";
import React from "react";
import { IGridLayoutTileOptions } from "./IGridLayoutTileOptions";

const style = {
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden'
};

export class GridLayoutTileHeader extends React.Component<IInputComponentProps> {
  public render() {
    const tile = this.props.value as IGridLayoutTileOptions || {};
    return (<div style={style}>[ {tile.row} | {tile.col} | {tile.content} ]</div>);
  }
}