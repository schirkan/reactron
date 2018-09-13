import * as React from 'react';
// import * as ReactMarkdown from 'react-markdown';

import './MarkDown.css';

export interface IMarkDownProps {
  text: string;
}

export default class MarkDown extends React.Component<IMarkDownProps> {
  public render() {
    return (
      <section className="MarkDown">
        {/* <ReactMarkdown>{this.props.text}</ReactMarkdown> */}
      </section>
    );
  }
}
