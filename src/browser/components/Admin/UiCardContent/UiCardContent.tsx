import * as classname from 'classnames';
import * as React from 'react';
import { IUiCardContentProps } from './IUiCardContentProps';

import './UiCardContent.css';

export default class UiCardContent extends React.Component<IUiCardContentProps> {
  public render() {
    return (
      <div className={classname('UiCardContent', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
