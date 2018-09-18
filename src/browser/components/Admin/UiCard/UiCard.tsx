import * as React from 'react';

import './UiCard.css';

export default class UiCard extends React.Component<{ className?: string }> {
  public render() {
    return (
      <section className={'ui-card ' + this.props.className}>
        {this.props.children}
      </section >
    );
  }
}
