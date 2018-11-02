import * as React from 'react';
import { apiClient } from 'src/browser/ApiClient';
import { componentLoader } from 'src/browser/ComponentLoader';
import { IComponentDefinition } from 'src/interfaces/IComponentDefinition';
import { IWebComponentOptions } from 'src/interfaces/IWebComponentOptions';
import OptionList from '../../OptionList/OptionList';

import './SelectWebComponent.css';

interface IComponentDefinitionItem {
  key?: string;
  moduleName?: string;
  definition?: IComponentDefinition;
}

interface ISelectWebComponentProps {
  webComponentId?: string;
  onChange: (webComponentId?: string) => any;
}

interface ISelectWebComponentState {
  loadingWebComponents: boolean
  loadingComponentDefinitions: boolean
  webComponents: IWebComponentOptions[];
  componentDefinitions: IComponentDefinitionItem[];
  selectedComponentDefinition: IComponentDefinitionItem;
  selectedWebComponentOptions?: IWebComponentOptions;
}

export default class SelectWebComponent extends React.Component<ISelectWebComponentProps, ISelectWebComponentState> {
  constructor(props: ISelectWebComponentProps) {
    super(props);

    this.state = {
      loadingWebComponents: true,
      loadingComponentDefinitions: true,
      webComponents: [],
      componentDefinitions: [],
      selectedComponentDefinition: {}
    };

    this.initCurrentComponent = this.initCurrentComponent.bind(this);
    this.onOptionsChange = this.onOptionsChange.bind(this);
    this.onSelectedWebComponentChange = this.onSelectedWebComponentChange.bind(this);
    this.onSelectedComponentDefinitionChange = this.onSelectedComponentDefinitionChange.bind(this);
  }

  public componentDidMount() {
    this.loadComponentDefinitions();
    this.loadWebComponents();
  }

  private loadComponentDefinitions() {
    return componentLoader.getAllComponents()
      .then(result => {
        const componentDefinitions: IComponentDefinitionItem[] = [];
        Object.keys(result).forEach(moduleName => {
          const components = result[moduleName];
          components.forEach(definition => {
            const key = moduleName + '.' + definition.name;
            componentDefinitions.push({ moduleName, definition, key });
          });
        });
        this.setState({ componentDefinitions, loadingComponentDefinitions: false },
          this.initCurrentComponent);
      })
      .catch(err => console.log(err)); // TODO
  }

  private loadWebComponents() {
    return apiClient.getWebComponentOptions()
      .then(webComponents => {
        this.setState({ webComponents, loadingWebComponents: false },
          this.initCurrentComponent);
      })
      .catch(err => console.log(err)); // TODO
  }

  private initCurrentComponent() {
    if (this.state.loadingWebComponents || this.state.loadingComponentDefinitions) {
      return;
    }

    if (this.props.webComponentId) {
      const selectedWebComponentOptions = this.state.webComponents.find(x => x.id === this.props.webComponentId);
      if (selectedWebComponentOptions) {
        const key = selectedWebComponentOptions.moduleName + '.' + selectedWebComponentOptions.componentName;
        const selectedComponentDefinition = this.state.componentDefinitions.find(x => x.key === key);
        if (selectedComponentDefinition) {
          this.setState({ selectedComponentDefinition, selectedWebComponentOptions });
        }
      }
    }
  }

  private onSelectedWebComponentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onChange(e.currentTarget.value);
  }

  private onSelectedComponentDefinitionChange(e: React.ChangeEvent<HTMLSelectElement>) {

    //
  }

  private onOptionsChange(newOptions: any) {
    //
  }

  public renderContent() {
    if (this.state.loadingWebComponents || this.state.loadingComponentDefinitions) {
      return null;
    }

    return (
      <div>
        {/* <select value={this.props.webComponentId} onChange={this.onSelectedWebComponentChange}>
          {this.state.webComponents.map((item, index) =>
            <option key={index} value={item.id}>{item.componentName} ({item.id})</option>
          )}
        </select> */}
        <select value={this.state.selectedComponentDefinition.key} onChange={this.onSelectedComponentDefinitionChange}>
          {this.state.componentDefinitions.map(item =>
            <option key={item.key} value={item.key}>{item.definition && item.definition.displayName} ({item.moduleName})</option>
          )}
        </select>
        {this.state.selectedWebComponentOptions &&
          this.state.selectedComponentDefinition &&
          this.state.selectedComponentDefinition.definition && (
            <OptionList value={this.state.selectedWebComponentOptions.options}
              definitions={this.state.selectedComponentDefinition.definition.fields}
              valueChange={this.onOptionsChange} />
          )}
      </div>
    );
  }

  public render() {
    return (
      <div className="SelectWebComponent">
        {this.renderContent()}
      </div>
    );
  }
}
