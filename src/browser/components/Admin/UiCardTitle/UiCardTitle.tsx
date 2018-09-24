import * as classname from 'classnames';
import * as React from 'react';
import { IUiComponentProps } from '../IUiComponentProps';

import './UiCardTitle.css';

export default class UiCardTitle extends React.Component<IUiComponentProps> {
  public render() {
    return (
      <div className={classname('UiCardTitle', this.props.className)} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
