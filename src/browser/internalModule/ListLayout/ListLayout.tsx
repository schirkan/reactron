import * as React from 'react';
import { IListLayoutItemOptions } from "./IListLayoutItemOptions";
import { IListLayoutOptions } from "./IListLayoutOptions";

import './ListLayout.css';

export default class ListLayout extends React.Component<IListLayoutOptions> {
  constructor(props: IListLayoutOptions) {
    super(props);

    this.renderListItem = this.renderListItem.bind(this);
  }

  private renderListItem(item: IListLayoutItemOptions, index: number) {
    const style = { ...this.props.itemStyle, ...item.style };

    return (
      <div className="ListItem" key={index} style={style}>
        {this.context.renderComponent({ id: item.content })}
      </div>
    );
  }

  public render() {
    return (
      <section className="ListLayout">
        {this.props.items.map(this.renderListItem)}
      </section>
    );
  }
}
