import * as React from 'react';
import { IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';

import './GridLayout.css';

interface IGridLayoutTileOptions {
  content: string;
  style: any;
}

interface IGridLayoutOptions {
  tiles: IGridLayoutTileOptions[];
  style: any;
}

export default class GridLayout extends React.Component<IDynamicReactComponentProps<IGridLayoutOptions>> {
  public render() {
    return (
      <section className="GridLayout" style={this.props.options.style}>
        {this.props.options.tiles.map((tile, index) =>
          (<div className="GridTile" key={index} style={tile.style}>{this.props.renderWebComponent(tile.content)}</div>)
        )}
      </section>
    );
  }
}
