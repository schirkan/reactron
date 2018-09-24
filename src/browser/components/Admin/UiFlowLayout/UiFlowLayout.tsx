import * as classname from 'classnames';
import * as React from 'react';
import { IUiComponentProps } from '../IUiComponentProps';

import './UiFlowLayout.css';

export default class UiFlowLayout extends React.Component<IUiComponentProps> {
  private renderChildren() {
    if (Array.isArray(this.props.children)) {
      return this.props.children.map((child, index) => <div key={index}>{child}</div>);
    } else {
      return <div>{this.props.children}</div>;
    }
  }

  public render() {
    return (
      <section className={classname('UiFlowLayout', this.props.className)} style={this.props.style}>
        {this.renderChildren()}
      </section>
    );
  }
}
