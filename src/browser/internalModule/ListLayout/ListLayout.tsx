import * as React from 'react';
import { IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';

import './ListLayout.css';

interface IListLayoutItemOptions {
  content: string;
  style: any;
}

interface IListLayoutOptions {
  listStyle: any;
  itemStyle: any;
  items: IListLayoutItemOptions[];
}

export default class ListLayout extends React.Component<IDynamicReactComponentProps<IListLayoutOptions>> {
  constructor(props: IDynamicReactComponentProps<IListLayoutOptions>) {
    super(props);

    this.renderListItem = this.renderListItem.bind(this);
  }

  private renderListItem(item: IListLayoutItemOptions, index: number) {
    const style = { ...this.props.options.itemStyle, ...item.style };

    return (
      <div className="ListItem" key={index} style={style}>
        {this.props.renderWebComponent(item.content)}
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
