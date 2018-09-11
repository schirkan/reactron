import * as React from 'react';
import { IComponentDefinition } from '../../../interfaces/IComponentDefinition';
import { IDynamicReactComponentClass, IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';
import { apiClient } from '../../ApiClient';
import { instance as componentLoader } from '../../ComponentLoader';
import { DynamicReactComponentProps } from '../../DynamicReactComponentProps';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Loading from '../Loading/Loading';

export interface IWebComponentProps {
  id: string;
}

export interface IWebComponentState {
  componentFound?: boolean;
  componentClass?: IDynamicReactComponentClass;
  componentProps?: IDynamicReactComponentProps;
  componentDefinition?: IComponentDefinition;
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

      const moduleComponents = await componentLoader.getModuleComponents(webComponentOptions.moduleName);
      if (!moduleComponents) {
        this.setState({ componentFound: false });
        return;
      }

      const componentDefinition = moduleComponents.find(x => x.name === webComponentOptions.componentName);
      if (!componentDefinition || !componentDefinition.component) {
        this.setState({ componentFound: false });
        return;
      }

      this.setState({
        componentClass: componentDefinition.component,
        componentProps: new DynamicReactComponentProps(webComponentOptions.moduleName, webComponentOptions.componentName, webComponentOptions.options),
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
      content = <div>Component not found</div>;
    }

    if (this.state.componentClass && this.state.componentProps) {
      const Component = this.state.componentClass;
      content = <Component {...this.state.componentProps} />;
    }

    return (
      <section className="WebComponent">
        <ErrorBoundary>{content}</ErrorBoundary>
      </section>
    );
  }
}
