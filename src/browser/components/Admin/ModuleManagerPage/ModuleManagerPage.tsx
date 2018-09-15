import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ICommandResult } from '../../../../interfaces/ICommandResult';
import { IModuleRepositoryItem } from '../../../../interfaces/IModuleRepositoryItem';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import ModuleTile from './ModuleTile/ModuleTile';

import './ModuleManagerPage.css';

interface IModuleManagerPageState {
  loading: boolean;
  showResult: boolean;
  result: string[];
  modules: IModuleRepositoryItem[];
}

export default class ModuleManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      showResult: false,
      result: [],
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
    if (!module.canUpdate) {
      return
    };

    this.setState({ loading: true }, async () => {
      const result = await apiClient.updateModule({ moduleName: module.name });
      this.showResult(result);
    });
  }

  public async rebuild(module: IModuleRepositoryItem): Promise<void> {
    if (!module.canBuild) {
      return;
    };

    this.setState({ loading: true }, async () => {
      const result1 = await apiClient.installModule({ moduleName: module.name });
      const result2 = await apiClient.buildModule({ moduleName: module.name });
      this.showResult(result1, result2);
    });
  }

  public async remove(module: IModuleRepositoryItem): Promise<void> {
    if (!module.canRemove) {
      return;
    };

    this.setState({ loading: true }, async () => {
      const result = await apiClient.deleteModule({ moduleName: module.name });
      this.showResult(result);
      apiClient.getModules.clearCache();
      this.loadModules();
    });
  }

  public async add(repository: string | null): Promise<void> {
    if (!repository || !repository.trim()) {
      return;
    };

    this.setState({ loading: true }, async () => {
      const result = await apiClient.addModule({ repository });
      this.showResult(result);
      apiClient.getModules.clearCache();
      this.loadModules();
    });
  }

  private showResult(...results: Array<ICommandResult<void>>) {
    const log: string[] = [];

    const pushLog = (commandResult: ICommandResult<void>) => {
      log.push((commandResult.success ? 'success' : 'fail') + ': ' + commandResult.command);
      log.push(...commandResult.log);

      if (commandResult.children) {
        commandResult.children.forEach(r => {
          pushLog(r);
        });
      }
    }

    results.forEach(r => {
      pushLog(r);
    });

    this.setState({
      loading: false,
      showResult: true,
      result: log
    });
  }

  public hideResult() {
    this.setState({ showResult: false });
  }

  public renderLoading() {
    return this.state.loading && <div className="overlay"><Loading /></div>;
  }

  public renderResult() {
    if (!this.state.showResult) {
      return;
    }

    return (
      <div className="overlay">
        <div className="result">
          <div className="title">
            Result:
          </div>
          <div className="close clickable" onClick={this.hideResult}>
            <FontAwesomeIcon icon={SolidIcons.faTimes} />
          </div>
          <ul className="log">
            {this.state.result.map((item, index) =>
              <li key={index}>{item}</li>
            )}
          </ul>
        </div>
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

  public render() {
    return (
      <section className="ModuleManagerPage">
        {this.renderLoading()}
        {this.renderResult()}
        {this.renderAdd()}
        {this.state.modules.map(item =>
          <ModuleTile key={item.name} module={item} remove={this.remove}
            rebuild={this.rebuild} update={this.update} />)}
      </section>
    );
  }
}
