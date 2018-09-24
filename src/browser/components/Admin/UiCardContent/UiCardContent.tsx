import * as classname from 'classnames';
import * as React from 'react';
import { IUiComponentProps } from '../IUiComponentProps';

import './UiCardContent.css';

export default class UiCardContent extends React.Component<IUiComponentProps> {
  public render() {
    return (
      <div className={classname('UiCardContent', this.props.className)} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
