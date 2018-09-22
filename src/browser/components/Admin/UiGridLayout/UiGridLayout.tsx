import * as classname from 'classnames';
import * as React from 'react';
import { IUiGridLayoutProps } from './IUiGridLayoutProps';

import './UiGridLayout.css';

export default class UiGridLayout extends React.Component<IUiGridLayoutProps> {
  public render() {
    return (
      <section className={classname('UiGridLayout', this.props.className)}>
        {this.props.children}
      </section>
    );
  }
}
