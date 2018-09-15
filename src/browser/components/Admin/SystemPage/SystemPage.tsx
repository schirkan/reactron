import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IServerInfo } from '../../../../interfaces/IServerInfo';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';

import './SystemPage.css';

interface ISystemPageState {
  info?: IServerInfo;
}

export default class SystemPage extends React.Component<any, ISystemPageState> {
  constructor(props: any) {
    super(props);
    this.state = {};

    this.exitApplication = this.exitApplication.bind(this);
    this.restartApplication = this.restartApplication.bind(this);
    this.shutdownSystem = this.shutdownSystem.bind(this);
    this.rebootSystem = this.rebootSystem.bind(this);
    this.resetApplication = this.resetApplication.bind(this);
  }

  public componentDidMount() {
    apiClient.getServerInfo().then(info => {
      this.setState({ info });
    });
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

  public rebootSystem() {
    apiClient.rebootSystem();
  }

  public resetApplication() {
    apiClient.resetApplication();
  }

  public renderInformation() {
    if (!this.state.info) {
      return <Loading />;
    }

    const free = Math.round(this.state.info.memory.free / 1024 / 1024);
    const total = Math.round(this.state.info.memory.total / 1024 / 1024);
    return (
      <fieldset className="information">
        <legend>Information</legend>
        <ul>
          <li>
            <span className="label">Version</span>
            <span className="value">{this.state.info.version}</span>
          </li>
          <li>
            <span className="label">CPU</span>
            <span className="value">{this.state.info.cpu.count} x {this.state.info.cpu.speed} MHz</span>
          </li>
          <li>
            <span className="label">Memory</span>
            <span className="value">{free} MB / {total} MB</span>
          </li>
          <li>
            <span className="label">IP</span>
            <span className="value">{this.state.info.ip}</span>
          </li>
          <li>
            <span className="label">Hostname</span>
            <span className="value">{this.state.info.hostname}</span>
          </li>
        </ul>
      </fieldset>
    );
  }

  public render() {
    return (
      <section className="SystemPage">
        {this.renderInformation()}

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
          <button onClick={this.rebootSystem}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faRedo} />
            Reboot System
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
