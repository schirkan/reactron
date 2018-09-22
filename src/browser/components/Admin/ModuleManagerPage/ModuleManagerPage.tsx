
import * as React from 'react';
import { ICommandResult } from '../../../../interfaces/ICommandResult';
import { IModuleRepositoryItem } from '../../../../interfaces/IModuleRepositoryItem';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import AddModuleCard from './AddModuleCard/AddModuleCard';
import CommandResult from './CommandResult/CommandResult';
import ModuleCard from './ModuleCard/ModuleCard';

import './ModuleManagerPage.css';
import UpdateModulesCard from './UpdateModulesCard/UpdateModulesCard';

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

    this.checkUpdates = this.checkUpdates.bind(this);
    this.updateAll = this.updateAll.bind(this);
    this.updateModule = this.updateModule.bind(this);
    this.remove = this.remove.bind(this);
    this.rebuild = this.rebuild.bind(this);
    this.hideResult = this.hideResult.bind(this);
  }

  public componentDidMount() {
    this.loadModules();
  }

  public loadModules() {
    return apiClient.getModules().then(modules => this.setState({ modules }));
  }

  public checkUpdates() {
    this.setState({ checkingUpdates: true }, () => {
      apiClient.checkUpdates().then(() => {
        this.setState({ checkingUpdates: false });
        apiClient.getModules.clearCache();
        this.loadModules();
      });
    });
  }

  public updateAll() {
    const modulesWithUpdates = this.state.modules.filter(x => x.hasUpdate);
    if (!modulesWithUpdates.length) {
      return;
    }

    const results: ICommandResult[] = [];

    this.setState({ loading: true }, async () => {
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
      this.loadModules();
    });
  }

  public async updateModule(module: IModuleRepositoryItem): Promise<void> {
    if (!module.hasUpdate) {
      return
    };

    this.setState({ loading: true }, async () => {
      try {
        const result = await apiClient.updateModule({ moduleName: module.name });
        this.showResult(result);
      } catch (error) {
        this.showError(error);
      }
      apiClient.getModules.clearCache();
      this.loadModules();
    });
  }

  public async rebuild(module: IModuleRepositoryItem): Promise<void> {
    if (!module.canBuild) {
      return;
    };

    this.setState({ loading: true }, async () => {
      try {
        const result = await apiClient.rebuildModule({ moduleName: module.name });
        this.showResult(result);
      } catch (error) {
        this.showError(error);
      }
      apiClient.getModules.clearCache();
      this.loadModules();
    });
  }

  public async remove(module: IModuleRepositoryItem): Promise<void> {
    if (!module.canRemove) {
      return;
    };

    this.setState({ loading: true }, async () => {
      try {
        const result = await apiClient.deleteModule({ moduleName: module.name });
        this.showResult(result);
      } catch (error) {
        this.showError(error);
      }
      apiClient.getModules.clearCache();
      this.loadModules();
    });
  }

  public async add(repository: string | null): Promise<void> {
    if (!repository || !repository.trim()) {
      return;
    };

    this.setState({ loading: true }, async () => {
      try {
        const result = await apiClient.addModule(undefined, { repository });
        this.showResult(result);
      } catch (error) {
        this.showError(error);
      }
      apiClient.getModules.clearCache();
      this.loadModules();
    });
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

  public renderLoading() {
    if (!this.state.loading) {
      return;
    }
    return (
      <div className="overlay">
        <Loading center={true} />
      </div>
    );
  }

  public renderResult() {
    if (!this.state.showResult) {
      return;
    }
    return (
      <div className="overlay">
        <CommandResult results={this.state.results} onClose={this.hideResult} />
      </div>
    );
  }

  public render() {
    return (
      <section className="ModuleManagerPage">
        {this.renderLoading()}
        {this.renderResult()}
        <UiFlowLayout>
          <AddModuleCard onAdd={this.add} />
          <UpdateModulesCard
            checkingUpdates={this.state.checkingUpdates}
            modules={this.state.modules}
            onCheckUpdates={this.checkUpdates}
            onUpdateAll={this.updateAll}
            onUpdateModule={this.updateModule} />
        </UiFlowLayout>
        <UiFlowLayout>
          {this.state.modules.map(item =>
            <ModuleCard key={item.name}
              module={item}
              onRemove={this.remove}
              onRebuild={this.rebuild}
              onUpdate={this.updateModule} />)}
        </UiFlowLayout>
      </section>
    );
  }
}
