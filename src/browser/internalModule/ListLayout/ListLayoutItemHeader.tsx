import { IInputComponentProps } from "@schirkan/reactron-interfaces";
import React from "react";
import { IListLayoutItemOptions } from "./IListLayoutItemOptions";

const style = {
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden'
};

export class ListLayoutItemHeader extends React.Component<IInputComponentProps> {
  public render() {
    const item = this.props.value as IListLayoutItemOptions || {};
    return (<div style={style}>[ {item.content} ]</div>);
  }
}