import { IReactronComponentProps } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { IMarkDownOptions } from './IMarkDownProps';

import './MarkDown.css';

export default class MarkDown extends React.Component<IReactronComponentProps<IMarkDownOptions>> {
  public render() {
    return (
      <section className="MarkDown">
        <ReactMarkdown source={this.props.options.text} />
      </section>
    );
  }
}
