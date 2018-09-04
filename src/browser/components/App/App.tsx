import * as React from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ExternalModule from '../ExternalModule/ExternalModule';
import './App.css';
import logo from './logo.svg';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <section className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-content">
          <ErrorBoundary>
            <ExternalModule componentName="HelloWorld" moduleName="dynamic-electron-react-module-example" />
          </ErrorBoundary>
        </div>
      </section>
    );
  }
}
