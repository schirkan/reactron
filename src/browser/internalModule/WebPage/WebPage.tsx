import * as React from 'react';
import { IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';
import './WebPage.css';

interface IWebPageOptions{
  url: string
}

export default class WebPage extends React.Component<IDynamicReactComponentProps<IWebPageOptions>> {
  public render() {
    return (
      <section className="WebPage">
        <iframe src={this.props.options.url} />
      </section>
    );
  }
}
