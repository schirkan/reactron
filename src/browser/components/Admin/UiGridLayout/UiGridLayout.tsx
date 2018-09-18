import * as React from 'react';

import './UiGridLayout.css';

export default class UiGridLayout extends React.Component<{ className?: string }> {
  public render() {
    return (
      <section className={'ui-grid-layout ' + this.props.className}>
        {this.props.children}
      </section>
    );
  }
}
