import * as React from 'react';
import { IGridLayoutOptions, IGridLayoutTileOptions } from './IGridLayoutTileOptions';
import { IReactronComponentContext } from '@schirkan/reactron-interfaces';

import './GridLayout.scss';

export default class GridLayout extends React.Component<IGridLayoutOptions> {
  public context!: IReactronComponentContext;
  
  constructor(props: IGridLayoutOptions) {
    super(props);

    this.renderTile = this.renderTile.bind(this);
  }

  private renderTile(tile: IGridLayoutTileOptions, index: number) {
    const style = { ...this.props.tileStyle, ...tile.style };
    style.gridColumn = tile.col.toString();
    if (tile.colspan > 1) {
      style.gridColumn += ' / span ' + tile.colspan;
    }

    style.gridRow = tile.row.toString();
    if (tile.rowspan > 1) {
      style.gridRow += ' / span ' + tile.rowspan;
    }
    return (
      <div className="GridTile" key={index} style={style}>
        {this.context.renderComponent({ id: tile.content })}
      </div>
    );
  }

  public render() {
    return (
      <section className="GridLayout" style={this.props.gridStyle}>
        {this.props.tiles.map(this.renderTile)}
      </section>
    );
  }
}
