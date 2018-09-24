import * as React from 'react';
import { ISystemSettings } from '../../../../interfaces/ISystemSettings';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import UiOverlay from '../UiOverlay/UiOverlay';
import SettingsCard from './SettingsCard/SettingsCard';

import './SettingsManagerPage.css';

export interface IModuleManagerPageState {
  loading: boolean;
  settings?: ISystemSettings;
}

export default class SettingsManagerPage extends React.Component<any, IModuleManagerPageState>{
  constructor(props: any) {
    super(props);

    this.state = { loading: false };

    this.loadSettings = this.loadSettings.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  public componentDidMount() {
    this.loadSettings();
  }

  public loadSettings(): Promise<void> {
    return apiClient.getSettings()
      .then(settings => this.setState({ settings }))
      .catch(); // TODO
  }

  public saveSettings(newSettings: ISystemSettings): Promise<void> {
    return apiClient.setSettings(undefined, newSettings)
      .catch(); // TODO
  }

  public render() {
    return (
      <section className="SettingsManagerPage">
        {this.state.loading && (
          <UiOverlay><Loading center={true} /></UiOverlay>
        )}
        {this.state.settings && (
          <UiFlowLayout>
            <SettingsCard settings={this.state.settings} onSave={this.saveSettings} />
          </UiFlowLayout>
        )}
      </section>
    );
  }
}
