import * as React from 'react';
import { IExternalModule } from '../../IExternalModule';
import { loadModule } from '../../ModuleLoader';

export default class ExternalModuleExample extends React.Component<any, { text: string, module?: IExternalModule, moduleFound?: boolean }> {
  private server: any;

  constructor(props: any) {
    super(props);
    this.state = { text: 'Hello World' };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  public async componentWillMount() {
    try {
      const module = await loadModule('dynamic-electron-react-module-example');
      const HelloService = module.services.HelloService as any;
      this.server = new HelloService();
      this.server.start();
      this.setState({ module, moduleFound: true });
    } catch (error) {
      this.setState({ moduleFound: false });
      console.log(error);
    }
  }

  public componentWillUnmount() {
    try {
      this.server.stop();
    } catch (error) {
      console.log(error);
    }
  }

  public onButtonClick() {
    try {
      this.setState({ text: this.server.sayHello('Martin') });
    } catch (error) {
      console.log(error);
    }
  }

  public render() {
    if (this.state.moduleFound === false) {
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

    if (this.state.module) {
      const HelloWorld = this.state.module.components.HelloWorld;

      return (
        <section className="ExternalModules">
          <HelloWorld text={this.state.text} />
          <button onClick={this.onButtonClick}>Say Hello from Server</button>
        </section>
      );
    }

    return <div>Loading module...</div>;
  }
}
