import * as classname from 'classnames';
import * as React from 'react';
import { IUiCardTitleProps } from './IUiCardTitleProps';

import './UiCardTitle.css';

export default class UiCardTitle extends React.Component<IUiCardTitleProps> {
  public render() {
    return (
      <div className={classname('UiCardTitle', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
