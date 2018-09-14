import * as React from 'react';
import { apiClient } from '../../../ApiClient';

import './SystemPage.css';

export default class SystemPage extends React.Component {
  constructor(props: any) {
    super(props);

    this.exitApplication = this.exitApplication.bind(this);
    this.restartApplication = this.restartApplication.bind(this);
    this.shutdownSystem = this.shutdownSystem.bind(this);
    this.restartSystem = this.restartSystem.bind(this);
    this.resetApplication = this.resetApplication.bind(this);
  }

  public exitApplication() {
    apiClient.exitApplication();
  }

  public restartApplication() {
    apiClient.restartApplication();
  }

  public shutdownSystem() {
    apiClient.shutdownSystem();
  }

  public restartSystem() {
    apiClient.restartSystem();
  }

  public resetApplication() {
    apiClient.resetApplication();
  }

  public render() {
    return (
      <section className="SystemPage">
        <button onClick={this.exitApplication}>Exit Application</button>
        <button onClick={this.restartApplication}>Restart Application</button>
        <button onClick={this.shutdownSystem}>Shutdown System</button>
        <button onClick={this.restartSystem}>Restart System</button>
        <div className="danger">
          <span>Danger Zone</span>
          <button onClick={this.resetApplication}>Reset Application</button>
        </div>
      </section>
    );
  }
}
