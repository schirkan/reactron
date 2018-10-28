import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IFieldDefinition } from 'src/interfaces/IObjectDefinition';
import { ISystemSettings } from '../../../../../interfaces/ISystemSettings';
import OptionList from '../../OptionList/OptionList';
import UiButton from '../../UiButton/UiButton';
import UiCard from '../../UiCard/UiCard';
import UiCardButtonRow from '../../UiCardButtonRow/UiCardButtonRow';
import UiCardContent from '../../UiCardContent/UiCardContent';
import UiCardTitle from '../../UiCardTitle/UiCardTitle';
import { ISettingsCardProps } from './ISettingsCardProps';

import './SettingsCard.css';

interface ISettingsCardState {
  newSettings: ISystemSettings;
}

const systemSettingsFields: IFieldDefinition[] = [{
  description: 'Language',
  displayName: 'Language',
  name: 'lang',
  valueType: 'string',
  values: [
    { value: 'de-DE', text: 'German' },
    { value: 'en-GB', text: 'English' },
    { value: 'fr-FR', text: 'French' },
  ]
}, {
  description: 'Location',
  displayName: 'Location',
  name: 'location',
  valueType: 'string'
}, {
  description: 'Timezone',
  displayName: 'Timezone',
  name: 'timezone',
  valueType: 'string',
  values: [
    { value: 'Europe/Berlin', text: 'Europe/Berlin' },
    { value: 'Europe/London', text: 'Europe/London' },
    { value: 'Asia/Tokyo', text: 'Asia/Tokyo' },
    { value: 'America/New_York', text: 'America/New York' },
  ]
}, {
  description: 'Path of page to show on startup',
  displayName: 'Startup Path',
  name: 'startupPath',
  valueType: 'string'
}, {
  description: 'Sample Checkbox',
  displayName: 'Checkbox',
  name: 'cb1',
  valueType: 'boolean'
}, {
  description: 'Sample Object',
  displayName: 'Object',
  fields: [
    {
      description: 'Sample Text',
      displayName: 'Text',
      name: 'stringValue',
      valueType: 'string'
    },
    {
      description: 'Sample Number',
      displayName: 'Number',
      name: 'numericValue',
      valueType: 'number'
    },
    {
      description: 'Sample Checkbox',
      displayName: 'Checkbox',
      name: 'booleanValue',
      valueType: 'boolean'
    }, {
      description: 'Sample DropDown',
      displayName: 'DropDown',
      name: 'value',
      valueType: 'string',
      values: [
        { value: '111', text: '1st Item' },
        { value: '222', text: '2nd Item' },
        { value: '333', text: '3rd Item' },
      ]
    }
  ],
  name: 'obj1',
  valueType: 'object'
}, {
  description: 'Sample Array',
  displayName: 'Array',
  isArray: true,
  name: 'arr1',
  valueType: 'string'
}];

export default class SettingsCard extends React.Component<ISettingsCardProps, ISettingsCardState> {
  constructor(props: ISettingsCardProps) {
    super(props);

    this.state = { newSettings: props.settings };

    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.settingsChange = this.settingsChange.bind(this);
  }

  private reset() {
    this.setState({ newSettings: this.props.settings });
  }

  private save() {
    return this.props.onSave(this.state.newSettings);
  }

  private settingsChange(newValue: any) {
    this.setState({ newSettings: newValue });
  }

  public renderTitle() {
    return (
      <UiCardTitle>
        <FontAwesomeIcon icon={SolidIcons.faCog} /> Settings
      </UiCardTitle>
    );
  }

  public renderContent() {
    return (
      <OptionList definitions={systemSettingsFields}
        value={this.state.newSettings}
        valueChange={this.settingsChange}
      />
    );
  }

  public renderFooter() {
    return (
      <UiCardButtonRow divider="half">
        <UiButton onClick={this.reset}>
          <FontAwesomeIcon icon={SolidIcons.faUndo} /> Reset
        </UiButton>
        <UiButton onClick={this.save}>
          <FontAwesomeIcon icon={SolidIcons.faSave} /> Save
        </UiButton>
      </UiCardButtonRow>
    );
  }

  public render() {
    return (
      <UiCard className="SettingsCard">
        {this.renderTitle()}
        {this.renderContent()}
        <UiCardContent style={{ whiteSpace: 'pre' }}>
          {JSON.stringify(this.state.newSettings, undefined, 2)}
        </UiCardContent>
        {this.renderFooter()}
      </UiCard >
    );
  }
}
