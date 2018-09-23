import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IServerInfo } from '../../../../interfaces/IServerInfo';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import UiButton from '../UiButton/UiButton';
import UiCard from '../UiCard/UiCard';
import UiCardButtonRow from '../UiCardButtonRow/UiCardButtonRow';
import UiCardContent from '../UiCardContent/UiCardContent';
import UiCardTitle from '../UiCardTitle/UiCardTitle';
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
    apiClient.getServerInfo().then(info => this.setState({ info }));
  }

  // TODO: confirm dialog

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
        <UiCardTitle>Information</UiCardTitle>
        <UiCardContent>{content}</UiCardContent>
      </UiCard>
    );
  }

  public renderApplicationCard() {
    return (
      <UiCard>
        <UiCardTitle>Application</UiCardTitle>
        <UiCardButtonRow divider="half">
          <UiButton onClick={this.exitApplication}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faSignOutAlt} /> Exit
          </UiButton>
          <UiButton onClick={this.restartApplication}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faRedo} /> Restart
          </UiButton>
        </UiCardButtonRow>
      </UiCard>
    );
  }

  public renderSystemCard() {
    return (
      <UiCard>
        <UiCardTitle>System</UiCardTitle>
        <UiCardButtonRow divider="half">
          <UiButton onClick={this.shutdownSystem}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faPowerOff} /> Shutdown
          </UiButton>
          <UiButton onClick={this.rebootSystem}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faRedo} /> Reboot
          </UiButton>
        </UiCardButtonRow>
      </UiCard>
    );
  }

  public renderDangerCard() {
    return (
      <UiCard className="danger">
        <UiCardTitle>Danger Zone</UiCardTitle>
        <UiCardButtonRow>
          <UiButton onClick={this.resetApplication}>
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationTriangle} /> Reset Application
          </UiButton>
        </UiCardButtonRow>
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
