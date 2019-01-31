import { IExtraWebComponentProps, IReactronComponentContext, IReactronComponentDefinition, IWebComponentOptions } from '@schirkan/reactron-interfaces';
import classname from 'classnames';
import * as React from 'react';
import { services } from '../../ReactronServicesFrontend';
import { componentLoader } from '../../ComponentLoader';
import { WebComponentContext } from '../../WebComponentContext';
import { WebComponentContextType } from '../../WebComponentContext';
import ComponentNotFound from '../ComponentNotFound/ComponentNotFound';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Loading from '../Loading/Loading';

import './WebComponent.scss';

export interface IWebComponentProps extends Partial<IWebComponentOptions>, IExtraWebComponentProps {
}

interface IWebComponentState {
  componentFound?: boolean;
  componentContext?: IReactronComponentContext;
  componentDefinition?: IReactronComponentDefinition;
  componentOptions?: IWebComponentOptions;
}

export default class WebComponent extends React.Component<IWebComponentProps, IWebComponentState> {
  constructor(props: IWebComponentProps) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate(prevProps: IWebComponentProps) {
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

      if (this.props.id) {
        // nur mit der ID lesen
        const allComponentOptions = await services.components.getAll();
        webComponentOptions = allComponentOptions.find(x => x.id === this.props.id);
      } else if (this.props.moduleName && this.props.componentName) {
        webComponentOptions = {
          id: '',
          parentId: '',
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
        componentContext: new WebComponentContext(webComponentOptions),
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
    let content = <Loading center={true} />;

    if (this.state.componentFound === false) {
      content = <ComponentNotFound {...this.props} />;
    }

    if (this.state.componentDefinition && this.state.componentDefinition.component && this.state.componentContext) {
      const Component = this.state.componentDefinition.component as typeof React.Component;

      // set contextType
      if (!Component.contextType) {
        Component.contextType = WebComponentContextType;
      }

      const props = this.state.componentOptions && this.state.componentOptions.options || {};

      // render context and component
      content = (
        <WebComponentContextType.Provider value={this.state.componentContext}>
          <Component {...props} />
        </WebComponentContextType.Provider>
      );
    }

    const className = classname("WebComponent", this.props.className);

    return (
      <section className={className} style={this.props.style}>
        <ErrorBoundary>
          {content}
        </ErrorBoundary>
      </section>
    );
  }
}
