import * as React from 'react';
import { IWebComponentOptions } from '../../../interfaces/IWebComponentOptions';
import { apiClient } from '../../ApiClient';
import { componentLoader } from '../../ComponentLoader';
import { DynamicReactComponentProps } from '../../DynamicReactComponentProps';
import ComponentNotFound from '../ComponentNotFound/ComponentNotFound';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Loading from '../Loading/Loading';
import { IWebComponentProps } from './IWebComponentProps';
import { IWebComponentState } from './IWebComponentState';

import './WebComponent.css';
export default class WebComponent extends React.Component<IWebComponentProps, IWebComponentState> {
  constructor(props: IWebComponentProps) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate(prevProps: IWebComponentProps, prevState: IWebComponentState) {
    if (this.props.id !== prevProps.id ||
      this.props.moduleName !== prevProps.moduleName ||
      this.props.componentName !== prevProps.componentName ||
      this.props.options !== prevProps.options) {
      this.loadComponent();
    }
  }

  public componentDidMount() {
    this.loadComponent();
  }

  private async loadComponent() {
    try {
      let webComponentOptions: IWebComponentOptions | undefined;

      // nur mit der ID lesen
      if (this.props.id) {
        const allComponentOptions = await apiClient.getWebComponentOptions();
        webComponentOptions = allComponentOptions.find(x => x.id === this.props.id);
      } else if (this.props.moduleName && this.props.componentName) {
        webComponentOptions = {
          id: '',
          moduleName: this.props.moduleName,
          componentName: this.props.componentName,
          options: this.props.options,
        };
      }

      if (!webComponentOptions) {
        this.setState({ componentFound: false });
        return;
      }

      const moduleComponents = await componentLoader.getModuleComponents(webComponentOptions.moduleName);
      if (!moduleComponents) {
        this.setState({ componentFound: false });
        return;
      }
      
      const componentName = webComponentOptions.componentName;
      const componentDefinition = moduleComponents.find(x => x.name === componentName);
      if (!componentDefinition || !componentDefinition.component) {
        this.setState({ componentFound: false });
        return;
      }

      this.setState({
        componentProps: new DynamicReactComponentProps(webComponentOptions.moduleName,
          webComponentOptions.componentName, webComponentOptions.options),
        componentDefinition,
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
      content = <ComponentNotFound {...this.props} />;
    }

    if (this.state.componentDefinition && this.state.componentDefinition.component && this.state.componentProps) {
      const Component = this.state.componentDefinition.component;
      content = <Component {...this.state.componentProps} />;
    }

    return (
      <section className="WebComponent">
        <ErrorBoundary>{content}</ErrorBoundary>
      </section>
    );
  }
}
