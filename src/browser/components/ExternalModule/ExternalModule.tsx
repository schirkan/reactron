import * as React from 'react';
import { ModuleHelper } from '../../../common/moduleHelper';
import { IDynamicReactComponentClass, IDynamicReactComponentClassProps } from '../../../interfaces/IDynamicReactComponentClass';
import { instance as componentLoader } from '../../ComponentLoader';

export interface IExternalModuleProps {
  moduleName: string;
  componentName: string;
}

export interface IExternalModuleState {
  componentFound?: boolean;
  componentClass?: IDynamicReactComponentClass;
  componentProps?: IDynamicReactComponentClassProps;
}

export default class ExternalModule extends React.Component<IExternalModuleProps, IExternalModuleState> {
  constructor(props: IExternalModuleProps) {
    super(props);
    this.state = {};
  }

  public componentDidUpdate(prevProps: IExternalModuleProps, prevState: IExternalModuleState) {
    if (this.props.componentName !== prevProps.componentName || this.props.moduleName !== prevProps.moduleName) {
      this.loadComponent();
    }
  }

  public componentDidMount() {
    this.loadComponent();
  }

  private async loadComponent() {
    try {
      const componentClass = await componentLoader.loadComponent(this.props.moduleName, this.props.componentName);
      const componentProps = {
        backendService: new ModuleHelper(this.props.moduleName),
        options: { initialText: 'Hello World' } // TODO from component options repo
      };
      this.setState({ componentClass, componentProps, componentFound: !!componentClass });
    } catch (error) {
      this.setState({ componentFound: false });
      console.log(error);
    }
  }

  public render() {
    if (this.state.componentFound === false) {
      return (
        <div>
          <h2>Sample Module not installed.</h2>
          <div>run</div>
          <pre>
            cd modules<br />
            git clone https://github.com/schirkan/electron-react-external-module-example<br />
            cd ..<br />
            npm run build-modules<br />
          </pre>
          <div>and reload</div>
        </div>
      );
    }

    if (this.state.componentClass && this.state.componentProps) {
      const Component = this.state.componentClass;

      return (
        <section className="ExternalModules">
          <Component {...this.state.componentProps} />
        </section>
      );
    }

    return <div>Loading...</div>;
  }
}
