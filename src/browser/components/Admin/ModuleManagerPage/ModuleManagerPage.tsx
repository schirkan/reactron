import { ICommandResult, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import UiLoadingCard from '../UiLoadingCard/UiLoadingCard';
import UiOverlay from '../UiOverlay/UiOverlay';
import AddModuleCard from './AddModuleCard/AddModuleCard';
import CommandResult from './CommandResult/CommandResult';
import ModuleCard from './ModuleCard/ModuleCard';
import UpdateModulesCard from './UpdateModulesCard/UpdateModulesCard';

import './ModuleManagerPage.css';

export interface IModuleManagerPageState {
  loading: boolean;
  checkingUpdates: boolean;
  showResult: boolean;
  results: ICommandResult[];
  modules: IModuleRepositoryItem[];
}

export default class ModuleManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      checkingUpdates: false,
      showResult: false,
      results: [],
      modules: []
    };

    this.loadModules = this.loadModules.bind(this);
    this.checkUpdates = this.checkUpdates.bind(this);
    this.updateAll = this.updateAll.bind(this);
    this.updateModule = this.updateModule.bind(this);
    this.removeModule = this.removeModule.bind(this);
    this.rebuildModule = this.rebuildModule.bind(this);
    this.addModule = this.addModule.bind(this);
    this.hideResult = this.hideResult.bind(this);
  }

  public componentDidMount() {
    this.loadModules();
  }

  public loadModules(): Promise<void> {
    return apiClient.getModules()
      .then(modules => this.setState({ modules }))
      .catch(); // TODO
  }

  public async checkUpdates(): Promise<void> {
    this.setState({ checkingUpdates: true });
    await apiClient.checkUpdates();
    this.setState({ checkingUpdates: false });
    apiClient.getModules.clearCache();
    await this.loadModules();
  }

  public async updateAll(): Promise<void> {
    const modulesWithUpdates = this.state.modules.filter(x => x.hasUpdate);
    if (!modulesWithUpdates.length) {
      return;
    }

    const results: ICommandResult[] = [];
    this.setState({ loading: true });
    try {
      for (const module of modulesWithUpdates) {
        const result = await apiClient.updateModule({ moduleName: module.name });
        results.push(...result);
      }
      this.showResult(results);
    } catch (error) {
      this.showError(error);
    }
    apiClient.getModules.clearCache();
    await this.loadModules();
  }

  public async updateModule(module: IModuleRepositoryItem): Promise<void> {
    if (!module.hasUpdate) {
      return;
    };

    this.setState({ loading: true });
    try {
      const result = await apiClient.updateModule({ moduleName: module.name });
      this.showResult(result);
    } catch (error) {
      this.showError(error);
    }
    apiClient.getModules.clearCache();
    await this.loadModules();
  }

  public async rebuildModule(module: IModuleRepositoryItem): Promise<void> {
    if (!module.canBuild) {
      return;
    };

    this.setState({ loading: true });
    try {
      const result = await apiClient.rebuildModule({ moduleName: module.name });
      this.showResult(result);
    } catch (error) {
      this.showError(error);
    }
    apiClient.getModules.clearCache();
    await this.loadModules();
  }

  public async removeModule(module: IModuleRepositoryItem): Promise<void> {
    if (!module.canRemove) {
      return;
    };

    this.setState({ loading: true });
    try {
      const result = await apiClient.deleteModule({ moduleName: module.name });
      this.showResult(result);
    } catch (error) {
      this.showError(error);
    }
    apiClient.getModules.clearCache();
    await this.loadModules();
  }

  public async addModule(repository: string | null): Promise<void> {
    if (!repository || !repository.trim()) {
      return;
    };

    this.setState({ loading: true });
    try {
      const result = await apiClient.addModule(undefined, { repository });
      this.showResult(result);
    } catch (error) {
      this.showError(error);
    }
    apiClient.getModules.clearCache();
    await this.loadModules();
  }

  private showError(err: any) {
    const message = err && err.message || JSON.stringify(err);
    const result = { command: 'Error', success: false, log: [message] } as ICommandResult;
    this.setState({ loading: false, showResult: true, results: [result] });
  }

  private showResult(results: ICommandResult[]) {
    this.setState({ loading: false, showResult: true, results });
  }

  public hideResult() {
    this.setState({ showResult: false });
  }

  public render() {
    return (
      <section className="ModuleManagerPage">
        {this.state.loading && (
          <UiOverlay><Loading center={true} /></UiOverlay>
        )}
        {this.state.showResult && (
          <UiOverlay>
            <CommandResult results={this.state.results} onClose={this.hideResult} />
          </UiOverlay>
        )}
        <UiFlowLayout>
          <AddModuleCard onAdd={this.addModule} />
          <UpdateModulesCard
            checkingUpdates={this.state.checkingUpdates}
            modules={this.state.modules}
            onCheckUpdates={this.checkUpdates}
            onUpdateAll={this.updateAll}
            onUpdateModule={this.updateModule} />
        </UiFlowLayout>
        {!this.state.modules.length && (
          <UiFlowLayout>
            <UiLoadingCard />
          </UiFlowLayout>
        )}
        <UiFlowLayout>
          {this.state.modules.map(item =>
            <ModuleCard key={item.name}
              module={item}
              onRemove={this.removeModule}
              onRebuild={this.rebuildModule}
              onUpdate={this.updateModule} />)}
        </UiFlowLayout>
      </section>
    );
  }
}
