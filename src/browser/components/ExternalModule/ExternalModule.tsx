import * as React from 'react';
import { IDynamicReactComponentClass, IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';
import { instance as componentLoader } from '../../ComponentLoader';
import { DynamicReactComponentProps } from '../../DynamicReactComponentProps';

export interface IExternalModuleProps {
  moduleName: string;
  componentName: string;
  options: any;
}

export interface IExternalModuleState {
  componentFound?: boolean;
  componentClass?: IDynamicReactComponentClass;
  componentProps?: IDynamicReactComponentProps;
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
      const componentProps = new DynamicReactComponentProps(this.props.moduleName, this.props.componentName, this.props.options);
      this.setState({ componentClass, componentProps, componentFound: !!componentClass });
    } catch (error) {
      this.setState({ componentFound: false });
      console.log(error);
    }
  }

  public render() {
    // TODO: remove
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
        <section className="ExternalModule">
          <Component {...this.state.componentProps} />
        </section>
      );
    }

    return <div>Loading...</div>;
  }
}
