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
              <th>Description</th>
              <th>Author</th>
              <th>Module</th>
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
              return (<tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{author}</td>
                <td>{item.repository}</td>
                <td>update|install|build|delete</td>
              </tr>);
            })}
          </tbody>
        </table>
      </section>
    );
  }
}
