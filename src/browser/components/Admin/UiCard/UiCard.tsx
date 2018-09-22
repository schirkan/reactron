import * as classname from 'classnames';
import * as React from 'react';
import { IUiCardProps } from './IUiCardProps';

import './UiCard.css';

export default class UiCard extends React.Component<IUiCardProps> {
  public render() {
    return (
      <section className={classname('UiCard', this.props.className)}>
        {this.props.children}
      </section >
    );
  }
}
