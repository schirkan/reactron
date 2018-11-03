import * as Regularcons from '@fortawesome/free-regular-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { apiClient } from 'src/browser/ApiClient';
import { componentLoader } from 'src/browser/ComponentLoader';
import { getDefaultObjectValue } from 'src/common/optionsHelper';
import { IComponentDefinition } from 'src/interfaces/IComponentDefinition';
import { IWebComponentOptions } from 'src/interfaces/IWebComponentOptions';
import * as uuidv4 from 'uuid/v4';
import { OptionCardContext, OptionsCardContextData } from '../../OptionCard/OptionCardContext';
import OptionList from '../../OptionList/OptionList';
import UiButton from '../../UiButton/UiButton';

import './WebComponentForm.css';

interface IComponentDefinitionItem {
  key: string;
  moduleName: string;
  definition: IComponentDefinition;
}

interface IWebComponentFormProps {
  webComponentId?: string;
  onChange: (webComponentId?: string) => any;
}

interface IWebComponentFormState {
  loadingWebComponents: boolean
  loadingComponentDefinitions: boolean
  webComponents: IWebComponentOptions[];
  componentDefinitions: IComponentDefinitionItem[];
  selectedComponentDefinition?: IComponentDefinitionItem;
  selectedWebComponentOptions?: IWebComponentOptions;
}

export default class WebComponentForm extends React.Component<IWebComponentFormProps, IWebComponentFormState> {
  public static contextType = OptionCardContext;

  constructor(props: IWebComponentFormProps) {
    super(props);

    this.state = {
      loadingWebComponents: true,
      loadingComponentDefinitions: true,
      webComponents: [],
      componentDefinitions: []
    };

    this.initCurrentComponent = this.initCurrentComponent.bind(this);
    this.onOptionsChange = this.onOptionsChange.bind(this);
    this.removeWebComponent = this.removeWebComponent.bind(this);
    this.onSelectedComponentDefinitionChange = this.onSelectedComponentDefinitionChange.bind(this);
  }

  private get formEvents(): OptionsCardContextData {
    return this.context as OptionsCardContextData;
  }

  public componentDidMount() {
    this.loadComponentDefinitions();
    this.loadWebComponents();
  }

  public componentWillUnmount() {
    if (this.state.selectedWebComponentOptions) {
      this.formEvents.webComponentRemoved(this.state.selectedWebComponentOptions);
    }
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

  private onSelectedComponentDefinitionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newKey = e.currentTarget.value;

    const selectedComponentDefinition = this.state.componentDefinitions.find(x => x.key === newKey);
    const currentWebComponentOptions = this.state.selectedWebComponentOptions;
    let newWebComponentOptions: IWebComponentOptions | undefined;

    if (selectedComponentDefinition) {
      const id = currentWebComponentOptions && currentWebComponentOptions.id || 'WebComponent_' + uuidv4();

      newWebComponentOptions = {
        id,
        moduleName: selectedComponentDefinition.moduleName,
        componentName: selectedComponentDefinition.definition.name,
        options: getDefaultObjectValue(selectedComponentDefinition.definition.fields)
      };
    }

    // trigger id change
    const newId = newWebComponentOptions && newWebComponentOptions.id;
    if (this.props.webComponentId !== newId) {
      this.props.onChange(newId);

      if (newWebComponentOptions) {
        // notify component created
        this.formEvents.webComponentCreated(newWebComponentOptions);
      } else if (currentWebComponentOptions) {
        // notify component remove
        this.formEvents.webComponentRemoved(currentWebComponentOptions);
      }
    }

    this.setState({ selectedWebComponentOptions: newWebComponentOptions, selectedComponentDefinition });
  }

  private removeWebComponent() {
    if (this.state.selectedWebComponentOptions) {
      // notify component remove
      this.formEvents.webComponentRemoved(this.state.selectedWebComponentOptions);
      this.setState({ selectedWebComponentOptions: undefined, selectedComponentDefinition: undefined });
    }
  }

  private onOptionsChange(newOptions: any) {
    if (!this.state.selectedWebComponentOptions) {
      return;
    }
    const newWebComponentOptions = { ...this.state.selectedWebComponentOptions };
    newWebComponentOptions.options = newOptions;
    this.setState({ selectedWebComponentOptions: newWebComponentOptions });

    // notify component changed
    this.formEvents.webComponentChanged(newWebComponentOptions);
  }

  public renderComponentSelection() {
    if (this.state.loadingWebComponents || this.state.loadingComponentDefinitions) {
      return null;
    }

    const selectedComponentKey = this.state.selectedComponentDefinition && this.state.selectedComponentDefinition.key || '';

    if (this.state.selectedComponentDefinition) {
      return (
        <div className="componentTitle" >
          <UiButton>
            <FontAwesomeIcon icon={SolidIcons.faCube} />
          </UiButton>
          <label>
            {this.state.selectedComponentDefinition.definition.displayName} ({this.state.selectedComponentDefinition.moduleName})
          </label>
          <UiButton onClick={this.removeWebComponent}>
            <FontAwesomeIcon icon={Regularcons.faTrashAlt} />
          </UiButton>
        </div>
      );
    }

    return (
      <select className="componentSelect" value={selectedComponentKey} onChange={this.onSelectedComponentDefinitionChange}>
        <option key="_" value="">Select Component...</option>
        {this.state.componentDefinitions.map(item =>
          <option key={item.key} value={item.key}>{item.definition.displayName} ({item.moduleName})</option>
        )}
      </select>
    );
  }

  public render() {
    return (
      <div className="WebComponentForm">
        {this.renderComponentSelection()}
        {this.state.selectedWebComponentOptions &&
          this.state.selectedComponentDefinition && (
            <OptionList value={this.state.selectedWebComponentOptions.options}
              definitions={this.state.selectedComponentDefinition.definition.fields}
              valueChange={this.onOptionsChange} />
          )}
      </div>
    );
  }
}
