import * as React from 'react';
import { IModuleRepositoryItem } from '../../../../interfaces/IModuleRepositoryItem';
import { apiClient } from '../../../ApiClient';

import './ModuleManagerPage.css';

interface IModuleManagerPageState {
  modules: IModuleRepositoryItem[];
}

export default class ModuleManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      modules: []
    };
  }

  public componentDidMount() {
    apiClient.getModules().then(modules => this.setState({ modules }));
  }

  public render() {
    return (
      <section className="ModuleManagerPage">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>Version</th>
              <th>Description</th>
              <th>Author</th>
              <th>Repository</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.modules.map(item => {
              let author = item.author;
              if (typeof item.author === 'object' && item.author.name) {
                author = item.author.name;
                if (item.author.email) {
                  author += ' ' + item.author.email;
                }
              }

              const onUpdate = () => apiClient.updateModule({ moduleName: item.name });
              const onInstall = () => apiClient.installModule({ moduleName: item.name });
              const onBuild = () => apiClient.buildModule({ moduleName: item.name });
              const onRemove = () => apiClient.deleteModule({ moduleName: item.name });

              return (<tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.version}</td>
                <td>{item.description}</td>
                <td>{author}</td>
                <td>{item.repository}</td>
                <td>
                  <button disabled={!item.canUpdate} onClick={onUpdate}>update</button>
                  <button disabled={!item.canInstall} onClick={onInstall}>install</button>
                  <button disabled={!item.canBuild} onClick={onBuild}>build</button>
                  <button disabled={!item.canRemove} onClick={onRemove}>delete</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </section>
    );
  }
}
