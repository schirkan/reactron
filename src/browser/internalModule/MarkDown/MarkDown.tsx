import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { IMarkDownOptions } from './IMarkDownProps';

import './MarkDown.css';

export default class MarkDown extends React.Component<IMarkDownOptions> {
  public render() {
    return (
      <section className="MarkDown">
        <ReactMarkdown source={this.props.text} />
      </section>
    );
  }
}
