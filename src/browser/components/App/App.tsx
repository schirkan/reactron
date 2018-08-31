import * as React from 'react';
import ExternalModule from '../ExternalModule/ExternalModule';
import './App.css';
import logo from './logo.svg';

export default class App extends React.Component<any, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  public render() {
    if (this.state.error) {
      return <h1>Something went wrong. {JSON.stringify(this.state.error)}</h1>;
    }

    return (
      <section className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-content">
          <ExternalModule componentName="HelloWorld" moduleName="dynamic-electron-react-module-example" />
        </div>
      </section>
    );
  }

  public componentDidCatch(error: any) {
    this.setState({ error });
  }
}
