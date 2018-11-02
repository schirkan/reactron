import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IServiceRepositoryItem } from 'src/interfaces/IServiceRepositoryItem';
import UiButton from '../../UiButton/UiButton';
import UiFlowLayout from '../../UiFlowLayout/UiFlowLayout';
import ServiceCard from '../ServiceCard/ServiceCard';

import './ServiceGroup.css';

export interface IModuleManagerPageProps {
  services: IServiceRepositoryItem[];
  moduleName: string;
  onShowServiceLog: (service: IServiceRepositoryItem) => any;
  onShowServiceOptions: (service: IServiceRepositoryItem) => any;
}

export interface IModuleManagerPageState {
  groupOpen: boolean;
}

export default class ServiceGroup extends React.Component<IModuleManagerPageProps, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      groupOpen: false
    };

    this.toggleGroup = this.toggleGroup.bind(this);
  }

  private toggleGroup() {
    this.setState(state => ({ groupOpen: !state.groupOpen }));
  }

  public render() {
    return (
      <section className="ServiceGroup">
        <UiButton className="group-header" onClick={this.toggleGroup}>
          <FontAwesomeIcon icon={SolidIcons.faCube} /> {this.props.moduleName} ({this.props.services.length})
          <FontAwesomeIcon icon={this.state.groupOpen ? SolidIcons.faArrowDown : SolidIcons.faArrowRight} />
        </UiButton>
        {this.state.groupOpen && (
          <UiFlowLayout>
            {this.props.services.map(item =>
              <ServiceCard key={item.name} service={item} onShowLog={this.props.onShowServiceLog} onShowOptions={this.props.onShowServiceOptions} />
            )}
          </UiFlowLayout>
        )}
      </section>
    );
  }
}