import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { ISystemSettings } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import { apiClient } from '../../../ApiClient';
import OptionCard from '../OptionCard/OptionCard';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import UiLoadingCard from '../UiLoadingCard/UiLoadingCard';
import { systemSettingsFields } from './systemSettingsFields';

import './SettingsManagerPage.css';

export interface IModuleManagerPageState {
  loading: boolean;
  settings?: ISystemSettings;
}

export default class SettingsManagerPage extends React.Component<any, IModuleManagerPageState>{
  constructor(props: any) {
    super(props);

    this.state = { loading: true };

    this.loadSettings = this.loadSettings.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  public componentDidMount() {
    this.loadSettings();
  }

  public loadSettings(): Promise<void> {
    return apiClient.getSettings()
      .then(settings => this.setState({ settings, loading: false }))
      .catch(); // TODO
  }

  public saveSettings(newSettings: ISystemSettings): Promise<void> {
    return apiClient.setSettings(undefined, newSettings)
      .then(apiClient.getSettings.clearCache)
      .catch(); // TODO
  }

  public render() {
    return (
      <section className="SettingsManagerPage">
        {this.state.loading && (
          <UiFlowLayout>
            <UiLoadingCard />
          </UiFlowLayout>
        )}
        {this.state.settings && (
          <UiFlowLayout>
            <OptionCard options={this.state.settings} onSave={this.saveSettings}
              fields={systemSettingsFields} icon={SolidIcons.faCogs}
              title="Settings" showReset={true}
            />
          </UiFlowLayout>
        )}
      </section>
    );
  }
}
