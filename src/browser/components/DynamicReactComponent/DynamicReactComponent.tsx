import * as React from 'react';
import { IComponentDefinition } from '../../../interfaces/IComponentDefinition';
import { instance as componentLoader } from '../../ComponentLoader';
import { DynamicReactComponentProps } from '../../DynamicReactComponentProps';
import ComponentNotFound from '../ComponentNotFound/ComponentNotFound';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Loading from '../Loading/Loading';

import './DynamicReactComponent.css';

export interface IDynamicReactComponentProps {
  moduleName: string;
  componentName: string;
  options?: any;
}

export interface IDynamicReactComponentState {
  componentFound?: boolean;
  componentProps?: IDynamicReactComponentProps;
  componentDefinition?: IComponentDefinition;
}

export default class DynamicReactComponent extends React.Component<IDynamicReactComponentProps, IDynamicReactComponentState> {
  constructor(props: IDynamicReactComponentProps) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate(prevProps: IDynamicReactComponentProps, prevState: IDynamicReactComponentState) {
    if (this.props.moduleName !== prevProps.moduleName ||
      this.props.componentName !== prevProps.componentName ||
      this.props.options !== prevProps.options) { // TODO
      this.loadComponent();
    }
  }

  public componentDidMount() {
    this.loadComponent();
  }

  private async loadComponent() {
    try {
      const moduleComponents = await componentLoader.getModuleComponents(this.props.moduleName);
      if (!moduleComponents) {
        this.setState({ componentFound: false });
        return;
      }

      const componentDefinition = moduleComponents.find(x => x.name === this.props.componentName);
      if (!componentDefinition || !componentDefinition.component) {
        this.setState({ componentFound: false });
        return;
      }

      this.setState({
        componentProps: new DynamicReactComponentProps(this.props.moduleName, this.props.componentName, this.props.options),
        componentDefinition,
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
      content = <ComponentNotFound
        moduleName={this.props.moduleName}
        componentName={this.props.componentName} />;
    }

    if (this.state.componentDefinition && this.state.componentDefinition.component && this.state.componentProps) {
      const Component = this.state.componentDefinition.component;
      content = <Component {...this.state.componentProps} />;
    }

    return (
      <section className="DynamicReactComponent">
        <ErrorBoundary>{content}</ErrorBoundary>
      </section>
    );
  }
}
