import * as React from 'react';
import { IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';

import './GridLayout.css';

interface IGridLayoutTileOptions {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  content: string;
  style: any;
}

interface IGridLayoutOptions {
  rows: number;
  cols: number;
  gridStyle: any;
  tileStyle: any;
  tiles: IGridLayoutTileOptions[];
}

export default class GridLayout extends React.Component<IDynamicReactComponentProps<IGridLayoutOptions>> {
  constructor(props: IDynamicReactComponentProps<IGridLayoutOptions>) {
    super(props);

    this.renderTile = this.renderTile.bind(this);
  }

  private renderTile(tile: IGridLayoutTileOptions, index: number) {
    const style = { ...this.props.options.tileStyle, ...tile.style };
        style['grid-column'] = tile.col.toString();
        if (tile.colspan > 1) {
          style['grid-column'] += ' / span ' + tile.colspan;
        }
    
        style['grid-row'] = tile.row.toString();
        if (tile.rowspan > 1) {
          style['grid-row'] += ' / span ' + tile.rowspan;
        }
    return (
      <div className="GridTile" key={index} style={style}>
        {this.props.renderWebComponent(tile.content)}
      </div>
    );
  }

  public render() {
    return (
      <section className="GridLayout" style={this.props.options.gridStyle}>
        {this.props.options.tiles.map(this.renderTile)}
      </section>
    );
  }
}
