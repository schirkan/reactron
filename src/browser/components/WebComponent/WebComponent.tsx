import * as React from 'react';
import { IWebComponentOptions } from '../../../interfaces/IWebComponentOptions';
import { apiClient } from '../../ApiClient';
import ComponentNotFound from '../ComponentNotFound/ComponentNotFound';
import DynamicReactComponent from '../DynamicReactComponent/DynamicReactComponent';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Loading from '../Loading/Loading';

import './WebComponent.css';

export interface IWebComponentProps {
  id: string;
}

export interface IWebComponentState {
  componentFound?: boolean;
  componentOptions?: IWebComponentOptions;
}

export default class WebComponent extends React.Component<IWebComponentProps, IWebComponentState> {
  constructor(props: IWebComponentProps) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate(prevProps: IWebComponentProps, prevState: IWebComponentState) {
    if (this.props.id !== prevProps.id) {
      this.loadComponent();
    }
  }

  public componentDidMount() {
    this.loadComponent();
  }

  private async loadComponent() {
    try {
      const allComponentOptions = await apiClient.getWebComponentOptions();
      const webComponentOptions = allComponentOptions.find(x => x.id === this.props.id);
      if (!webComponentOptions) {
        this.setState({ componentFound: false });
        return;
      }

      this.setState({
        componentOptions: webComponentOptions,
        componentFound: true
      });
    } catch (error) {
      console.log(error);
      this.setState({ componentFound: false });
    }
  }

  public render() {
    let content = <Loading />;

    if (this.state.componentFound === false) {
      content = <ComponentNotFound id={this.props.id} />;
    }

    if (this.state.componentOptions) {
      content = <DynamicReactComponent {...this.state.componentOptions} />;
    }

    return (
      <section className="WebComponent">
        <ErrorBoundary>{content}</ErrorBoundary>
      </section>
    );
  }
}
