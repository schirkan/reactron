import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { IDynamicReactComponentProps } from 'src/interfaces/IDynamicReactComponentClass';
import { IMarkDownOptions } from './IMarkDownProps';

import './MarkDown.css';

export default class MarkDown extends React.Component<IDynamicReactComponentProps<IMarkDownOptions>> {
  public render() {
    return (
      <section className="MarkDown">
        <ReactMarkdown source={this.props.options.text} />
      </section>
    );
  }
}
