import * as classname from 'classnames';
import * as React from 'react';
import { IUiComponentProps } from '../IUiComponentProps';

import './UiOverlay.css';

export default class UiOverlay extends React.Component<IUiComponentProps> {
  public render() {
    return (
      <div className={classname('UiOverlay', this.props.className)} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
