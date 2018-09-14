import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
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
        <fieldset>
          <legend>Application</legend>
          <button onClick={this.exitApplication}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faSignOutAlt} />
            Exit Application
          </button>
          <button onClick={this.restartApplication}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faRedo} />
            Restart Application
          </button>
        </fieldset>

        <fieldset>
          <legend>System</legend>
          <button onClick={this.shutdownSystem}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faPowerOff} />
            Shutdown System
          </button>
          <button onClick={this.restartSystem}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faRedo} />
            Restart System
          </button>
        </fieldset>

        <fieldset className="danger">
          <legend>Danger Zone</legend>
          <button onClick={this.resetApplication}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationCircle} />
            Reset Application
          </button>
        </fieldset>
      </section>
    );
  }
}
