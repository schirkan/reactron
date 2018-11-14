import { IReactronComponentProps } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import { IListLayoutItemOptions, IListLayoutOptions } from './IListLayoutOptions';

import './ListLayout.css';

export default class ListLayout extends React.Component<IReactronComponentProps<IListLayoutOptions>> {
  constructor(props: IReactronComponentProps<IListLayoutOptions>) {
    super(props);

    this.renderListItem = this.renderListItem.bind(this);
  }

  private renderListItem(item: IListLayoutItemOptions, index: number) {
    const style = { ...this.props.options.itemStyle, ...item.style };

    return (
      <div className="ListItem" key={index} style={style}>
        {this.props.context.renderComponent({ id: item.content })}
      </div>
    );
  }

  public render() {
    return (
      <section className="ListLayout">
        {this.props.options.items.map(this.renderListItem)}
      </section>
    );
  }
}
