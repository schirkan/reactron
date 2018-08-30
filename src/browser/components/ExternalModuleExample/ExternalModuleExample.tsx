import * as React from 'react';
import { IDynamicReactComponentClass } from '../../../interfaces/IDynamicReactComponentClass';
import { instance as componentLoader } from '../../ComponentLoader';

export default class ExternalModuleExample extends React.Component<any, { helloWorldComponent?: IDynamicReactComponentClass, componentFound?: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public async componentWillMount() {
    try {
      const helloWorldComponent = await componentLoader.loadComponent('dynamic-electron-react-module-example', 'HelloWorld');
      this.setState({ helloWorldComponent, componentFound: !!helloWorldComponent });
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

    if (this.state.helloWorldComponent) {
      const HelloWorld = this.state.helloWorldComponent;
      return (
        <section className="ExternalModules">
          <HelloWorld backendService={componentLoader.backendService} options={{ text: 'Hello World' }} />
        </section>
      );
    }

    return <div>Loading...</div>;
  }
}
