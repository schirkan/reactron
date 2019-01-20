import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { IMarkDownOptions } from './IMarkDownOptions';

import './MarkDown.scss';

export default class MarkDown extends React.Component<IMarkDownOptions> {
  public render() {
    return (
      <section className="MarkDown" style={this.props.style}>
        <ReactMarkdown source={this.props.text} />
      </section>
    );
  }
}
