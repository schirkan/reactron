import * as classname from 'classnames';
import * as React from 'react';
import { IUiButtonProps } from './IUiButtonProps';

import './UiButton.css';

export default class UiButton extends React.Component<IUiButtonProps> {
  public render() {
    const onClick = this.props.disabled ? undefined : this.props.onClick;
    const className = classname('UiButton', 'clickable',
      this.props.className, { 'disabled': this.props.disabled });

    return (
      <div className={className} onClick={onClick}>
        {this.props.children}
      </div>
    );
  }
}
