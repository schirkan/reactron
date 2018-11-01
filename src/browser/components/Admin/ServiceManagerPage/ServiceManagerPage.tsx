import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IServiceRepositoryItem } from '../../../../interfaces/IServiceRepositoryItem';
import { apiClient } from '../../../ApiClient';
import OptionCard from '../OptionCard/OptionCard';
import UiButton from '../UiButton/UiButton';
import UiCard from '../UiCard/UiCard';
import UiCardButtonRow from '../UiCardButtonRow/UiCardButtonRow';
import UiCardContent from '../UiCardContent/UiCardContent';
import UiCardTitle from '../UiCardTitle/UiCardTitle';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import UiLoadingCard from '../UiLoadingCard/UiLoadingCard';
import UiOverlay from '../UiOverlay/UiOverlay';
import ServiceCard from './ServiceCard/ServiceCard';

import './ServiceManagerPage.css';

export interface IModuleManagerPageState {
  loadingServices: boolean;
  loadingServiceOptions: boolean;
  services: IServiceRepositoryItem[];
  showOptions: boolean,
  showLog: boolean,
  selectedService: IServiceRepositoryItem | undefined;
  selectedServiceOptions: any;
}

export default class ServiceManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loadingServices: true,
      loadingServiceOptions: false,
      services: [],
      showOptions: false,
      showLog: false,
      selectedService: undefined,
      selectedServiceOptions: undefined
    };

    this.showLog = this.showLog.bind(this);
    this.closeLog = this.closeLog.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.closeOptions = this.closeOptions.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.saveOptions = this.saveOptions.bind(this);
    this.optionsChange = this.optionsChange.bind(this);
  }

  public componentDidMount() {
    this.loadServices();
  }

  public loadServices() {
    return apiClient.getAllServices()
      .then(services => this.setState({ services, loadingServices: false }))
      .catch(err => this.setState({ loadingServices: false })); // TODO
  }

  private showLog(service: IServiceRepositoryItem) {
    this.setState({ showLog: true, selectedService: service });
  }

  private showOptions(service: IServiceRepositoryItem) {
    this.setState({
      showOptions: true,
      selectedService: service,
      selectedServiceOptions: undefined
    }, this.loadOptions);
  }

  private closeOptions() {
    this.setState({ showOptions: false, selectedService: undefined });
  }

  private closeLog() {
    this.setState({ showLog: false, selectedService: undefined });
  }

  private loadOptions() {
    if (!this.state.selectedService) {
      return;
    }

    this.setState({ loadingServiceOptions: true });

    apiClient.getServiceOptions({
      moduleName: this.state.selectedService.moduleName,
      serviceName: this.state.selectedService.name
    })
      .then(options => {
        this.setState({ selectedServiceOptions: options, loadingServiceOptions: false })
      });
  }

  private optionsChange(newOptions: any) {
    this.setState({ selectedServiceOptions: newOptions })
  }

  private saveOptions() {
    if (!this.state.selectedService) {
      return;
    }

    apiClient.setServiceOptions({
      moduleName: this.state.selectedService.moduleName,
      serviceName: this.state.selectedService.name
    },
      this.state.selectedServiceOptions
    );

    this.closeOptions();
  }

  private renderServiceOptionsDialog() {
    if (!this.state.showOptions || !this.state.selectedService) {
      return null;
    }
    if (this.state.loadingServiceOptions) {
      return <UiOverlay><UiLoadingCard /></UiOverlay>;
    }

    const title = 'Options for ' + this.state.selectedService.displayName;

    return (
      <UiOverlay>
        <OptionCard icon={SolidIcons.faCogs}
          title={title} fields={this.state.selectedService.options || []}
          options={this.state.selectedServiceOptions}
          onSave={this.saveOptions} onCancel={this.closeOptions}
        />
      </UiOverlay>
    );
  }

  private renderServiceLogDialog() {
    if (!this.state.showLog || !this.state.selectedService) {
      return null;
    }

    return (
      <UiOverlay>
        <UiCard className="ServiceLogCard">
          <UiCardTitle>
            Log for {this.state.selectedService.displayName}
          </UiCardTitle>
          <UiCardContent>
            <ul>
              {this.state.selectedService.log.map(item => (
                <li>{item}</li>
              ))}
            </ul>
          </UiCardContent>
          <UiCardButtonRow divider="full">
            <UiButton onClick={this.closeLog}>
              <FontAwesomeIcon icon={SolidIcons.faTimes} /> Close
            </UiButton>
          </UiCardButtonRow>
        </UiCard>
      </UiOverlay>
    );
  }

  private renderServiceGroups() {
    if (this.state.loadingServices) {
      return <UiFlowLayout><UiLoadingCard /></UiFlowLayout>;
    }

    const groups = this.state.services.map(x => x.moduleName).filter(onlyUnique);
    return groups.map(moduleName => this.renderServiceGroup(moduleName));
  }

  private renderServiceGroup(moduleName: string) {
    const services = this.state.services.filter(x => x.moduleName === moduleName); // TODO: .sort((a, b) => a.displayName > b.displayName)

    return (
      <React.Fragment key={moduleName}>
        <div className="group-header"><FontAwesomeIcon icon={SolidIcons.faCube} /> {moduleName}</div>
        <UiFlowLayout>
          {services.map(item =>
            <ServiceCard key={item.name} service={item} onShowLog={this.showLog} onShowOptions={this.showOptions} />
          )}
        </UiFlowLayout>
      </React.Fragment>
    );
  }

  public render() {
    return (
      <section className="ServiceManagerPage">
        {this.renderServiceGroups()}
        {this.renderServiceOptionsDialog()}
        {this.renderServiceLogDialog()}
      </section>
    );
  }
}

function onlyUnique(value: any, index: number, self: any[]) {
  return self.indexOf(value) === index;
}