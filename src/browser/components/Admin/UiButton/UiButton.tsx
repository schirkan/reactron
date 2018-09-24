import * as classname from 'classnames';
import * as React from 'react';
import { IUiButtonProps } from './IUiButtonProps';

import './UiButton.css';

interface IUiButtonState {
  running: boolean;
}

export default class UiButton extends React.Component<IUiButtonProps, IUiButtonState> {
  constructor(props: IUiButtonProps) {
    super(props);

    this.state = { running: false };

    this.onClick = this.onClick.bind(this);
  }
  
  private onClick() {
    if (this.props.disabled || this.state.running || !this.props.onClick) {
      return;
    }
    this.setState({ running: true }, () => {
      Promise.resolve(this.props.onClick())
        .catch()
        .then(() => {
          this.setState({ running: false });
        });
    });
  }

  public render() {
    const className = classname('UiButton', 'clickable',
      this.props.className, { 'disabled': this.props.disabled || this.state.running });

    return (
      <div className={className} onClick={this.onClick} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
