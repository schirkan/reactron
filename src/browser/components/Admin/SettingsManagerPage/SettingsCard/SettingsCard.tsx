import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ISystemSettings } from '../../../../../interfaces/ISystemSettings';
import UiButton from '../../UiButton/UiButton';
import UiCard from '../../UiCard/UiCard';
import UiCardButtonRow from '../../UiCardButtonRow/UiCardButtonRow';
import UiCardTitle from '../../UiCardTitle/UiCardTitle';
import { ISettingsCardProps } from './ISettingsCardProps';

import './SettingsCard.css';

interface ISettingsCardState {
  newSettings: ISystemSettings;
}

export default class SettingsCard extends React.Component<ISettingsCardProps, ISettingsCardState> {
  constructor(props: ISettingsCardProps) {
    super(props);

    this.state = { newSettings: props.settings };

    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
  }

  private reset() {
    this.setState({ newSettings: this.props.settings });
  }

  private save() {
    return this.props.onSave(this.state.newSettings);
  }

  public renderTitle() {
    return (
      <UiCardTitle>
        <FontAwesomeIcon icon={SolidIcons.faCog} /> Settings
      </UiCardTitle>
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
        {this.renderFooter()}
      </UiCard>
    );
  }
}
