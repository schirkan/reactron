import * as classname from 'classnames';
import * as React from 'react';
import { IUiCardButtonRowProps } from './IUiCardButtonRowtProps';

import './UiCardButtonRow.css';

export default class UiCardButtonRow extends React.Component<IUiCardButtonRowProps> {
  public render() {
    const className = classname('UiCardButtonRow', this.props.className, {
      'UiCardButtonRowDividerFull': this.props.divider === 'full',
      'UiCardButtonRowDividerHalf': this.props.divider === 'half',
    });

    return (
      <div className={className} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
