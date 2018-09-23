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

    // this.checkUpdates = this.checkUpdates.bind(this);
    // this.updateAll = this.updateAll.bind(this);
    // this.updateModule = this.updateModule.bind(this);
    // this.remove = this.remove.bind(this);
    // this.rebuild = this.rebuild.bind(this);
    // this.hideResult = this.hideResult.bind(this);
  }
  
  public componentDidMount() {
    this.loadServices();
  }

  public loadServices() {
    return apiClient.getAllServices().then(services => this.setState({ services }));
  }

  public render() {
    return (
      <section className="ServiceManagerPage">
        <UiFlowLayout>
          {this.state.services.map(item => <ServiceCard key={item.name} service={item} />)}
        </UiFlowLayout>
      </section>
    );
  }
}
