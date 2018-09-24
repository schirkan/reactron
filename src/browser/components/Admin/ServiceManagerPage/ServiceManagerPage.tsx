import * as React from 'react';
import { IServiceRepositoryItem } from '../../../../interfaces/IServiceRepositoryItem';
import { apiClient } from '../../../ApiClient';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import ServiceCard from './ServiceCard/ServiceCard';

import './ServiceManagerPage.css';

export interface IModuleManagerPageState {
  loading: boolean;
  services: IServiceRepositoryItem[];
}

export default class ServiceManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      services: []
    };

    this.showLog = this.showLog.bind(this);
    this.showOptions = this.showOptions.bind(this);
  }

  public componentDidMount() {
    this.loadServices();
  }

  public loadServices() {
    return apiClient.getAllServices()
      .then(services => this.setState({ services }))
      .catch(); // TODO
  }

  private showLog(service: IServiceRepositoryItem) {
    return alert('TODO: log ' + service.name);
  }

  private showOptions(service: IServiceRepositoryItem) {
    return alert('TODO: options ' + service.name);
  }

  public render() {
    return (
      <section className="ServiceManagerPage">
        <UiFlowLayout>
          {this.state.services.map(item =>
            <ServiceCard key={item.name} service={item} onShowLog={this.showLog} onShowOptions={this.showOptions} />
          )}
        </UiFlowLayout>
      </section>
    );
  }
}
