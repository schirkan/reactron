import * as React from 'react';
import { IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';

import './ListLayout.css';

interface IListLayoutItemOptions {
  content: string;
  style: any;
}

interface IListLayoutOptions {
  items: IListLayoutItemOptions[];
}

export default class ListLayout extends React.Component<IDynamicReactComponentProps<IListLayoutOptions>> {
  public render() {
    return (
      <section className="ListLayout">
        {this.props.options.items.map((item, index) =>
          (<div className="ListItem" key={index} style={item.style}>{this.props.renderWebComponent(item.content)}</div>)
        )}
      </section>
    );
  }
}
