import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IServerInfo } from '../../../../interfaces/IServerInfo';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import UiCard from '../UiCard/UiCard';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';

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

  public renderInformationCard() {
    let content;
    if (!this.state.info) {
      content = <Loading />;
    } else {
      const free = Math.round(this.state.info.memory.free / 1024 / 1024);
      const total = Math.round(this.state.info.memory.total / 1024 / 1024);
      content = (
        <ul>
          <li>
            <span>Version</span>
            <span>{this.state.info.version}</span>
          </li>
          <li>
            <span>CPU</span>
            <span>{this.state.info.cpu.count} x {this.state.info.cpu.speed} MHz</span>
          </li>
          <li>
            <span>Memory</span>
            <span>{free} MB / {total} MB</span>
          </li>
          <li>
            <span>IP</span>
            <span>{this.state.info.ip}</span>
          </li>
          <li>
            <span>Hostname</span>
            <span>{this.state.info.hostname}</span>
          </li>
        </ul>
      );
    }

    return (
      <UiCard className="information">
        <div className="title">Information</div>
        {content}
      </UiCard>
    );
  }

  public renderApplicationCard() {
    return (
      <UiCard>
        <div className="title">Application</div>
        <div className="clickable" onClick={this.exitApplication}>
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faSignOutAlt} />
          Exit
        </div>
        <div className="clickable" onClick={this.restartApplication}>
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faRedo} />
          Restart
        </div>
      </UiCard>
    );
  }

  public renderSystemCard() {
    return (
      <UiCard>
        <div className="title">System</div>
        <div className="clickable" onClick={this.shutdownSystem}>
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faPowerOff} />
          Shutdown
        </div>
        <div className="clickable" onClick={this.rebootSystem}>
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faRedo} />
          Reboot
        </div>
      </UiCard>
    );
  }

  public renderDangerCard() {
    return (
      <UiCard className="danger">
        <div className="title">Danger Zone</div>
        <div className="clickable" onClick={this.resetApplication}>
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationTriangle} />
          Reset Application
        </div>
      </UiCard>
    );
  }

  public render() {
    return (
      <section className="SystemPage">
        <UiFlowLayout>
          {this.renderInformationCard()}
          {this.renderApplicationCard()}
          {this.renderSystemCard()}
          {this.renderDangerCard()}
        </UiFlowLayout>
      </section>
    );
  }
}
