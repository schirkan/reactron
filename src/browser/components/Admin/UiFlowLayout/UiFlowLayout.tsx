import * as classname from 'classnames';
import * as React from 'react';
import { IUiFlowLayoutProps } from './IUiFlowLayoutProps';

import './UiFlowLayout.css';

export default class UiFlowLayout extends React.Component<IUiFlowLayoutProps> {
  public render() {
    return (
      <section className={classname('UiFlowLayout', this.props.className)}>
        {this.props.children.map((child, index) => <div key={index}>{child}</div>)}
      </section>
    );
  }
}
