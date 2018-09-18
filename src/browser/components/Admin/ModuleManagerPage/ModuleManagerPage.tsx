import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ICommandResult } from '../../../../interfaces/ICommandResult';
import { IModuleRepositoryItem } from '../../../../interfaces/IModuleRepositoryItem';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import UiGridLayout from '../UiGridLayout/UiGridLayout';
import CommandResult from './CommandResult/CommandResult';
import ModuleCard from './ModuleCard/ModuleCard';

import './ModuleManagerPage.css';

interface IModuleManagerPageState {
  loading: boolean;
  showResult: boolean;
  results: ICommandResult[];
  modules: IModuleRepositoryItem[];
}

export default class ModuleManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      showResult: false,
      results: [],
      modules: []
    };

    this.update = this.update.bind(this);
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

  public async update(module: IModuleRepositoryItem): Promise<void> {
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
    this.setState({
      loading: false,
      showResult: true,
      results: [message]
    });
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
        <Loading />
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

  public renderAdd() {
    let input: HTMLInputElement | null;
    const onAdd = () => this.add(input && input.value);
    return (
      <div className="addForm">
        <input ref={el => input = el} placeholder="GitHub Repository URL" />
        <div className="addButton clickable" onClick={onAdd}>
          <FontAwesomeIcon icon={SolidIcons.faPlus} /> Add
        </div>
      </div>
    );
  }

  public renderModules() {
    return (
      <UiFlowLayout>
        {this.state.modules.map(item =>
          <ModuleCard key={item.name} module={item} remove={this.remove}
            rebuild={this.rebuild} update={this.update} />)}
            
        {this.state.modules.map(item =>
          <ModuleCard key={item.name + "2"} module={item} remove={this.remove}
            rebuild={this.rebuild} update={this.update} />)}
            
        {this.state.modules.map(item =>
          <ModuleCard key={item.name + "3"} module={item} remove={this.remove}
            rebuild={this.rebuild} update={this.update} />)}
      </UiFlowLayout>
    );
  }

  public render() {
    return (
      <section className="ModuleManagerPage">
        {this.renderLoading()}
        {this.renderResult()}
        {this.renderAdd()}
        {this.renderModules()}
      </section>
    );
  }
}
