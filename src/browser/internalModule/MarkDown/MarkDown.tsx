import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { IMarkDownProps } from './IMarkDownProps';

import './MarkDown.css';

export default class MarkDown extends React.Component<IMarkDownProps> {
  public render() {
    return (
      <section className="MarkDown">
        <ReactMarkdown>{this.props.text}</ReactMarkdown>
      </section>
    );
  }
}
