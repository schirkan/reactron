import * as React from 'react';

import './UiFlowLayout.css';

export default class UiFlowLayout extends React.Component<{ className?: string }> {
  public render() {
    return (
      <section className={'ui-flow-layout ' + this.props.className}>
        {this.props.children}
      </section>
    );
  }
}
