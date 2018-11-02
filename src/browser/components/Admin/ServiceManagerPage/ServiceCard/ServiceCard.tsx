import * as RegularIcons from '@fortawesome/free-regular-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import UiButton from '../../UiButton/UiButton';
import UiCard from '../../UiCard/UiCard';
import UiCardButtonRow from '../../UiCardButtonRow/UiCardButtonRow';
import UiCardContent from '../../UiCardContent/UiCardContent';
import UiCardTitle from '../../UiCardTitle/UiCardTitle';
import { IServiceCardProps } from './IServiceCardProps';

import './ServiceCard.css';

export default class ServiceCard extends React.Component<IServiceCardProps> {
  constructor(props: IServiceCardProps) {
    super(props);

    this.showOptions = this.showOptions.bind(this);
    this.showLog = this.showLog.bind(this);
  }

  private showOptions() {
    return this.props.onShowOptions(this.props.service);
  }

  private showLog() {
    return this.props.onShowLog(this.props.service);
  }

  public renderTitle() {
    return (
      <UiCardTitle>
        <FontAwesomeIcon icon={SolidIcons.faCogs} /> {this.props.service.name}
      </UiCardTitle>
    );
  }

  public renderDescription() {
    return (
      <UiCardContent className="description">
        {this.props.service.description || 'no description'}
      </UiCardContent>
    );
  }

  public renderFooter() {
    return (
      <UiCardButtonRow divider="half">
        <UiButton onClick={this.showLog}>
          <FontAwesomeIcon icon={RegularIcons.faFile} /> Log
        </UiButton>
        <UiButton onClick={this.showOptions}>
          <FontAwesomeIcon icon={SolidIcons.faCog} /> Options
        </UiButton>
      </UiCardButtonRow>
    );
  }

  public render() {
    return (
      <UiCard className="ServiceCard">
        {this.renderTitle()}
        {this.renderDescription()}
        {this.renderFooter()}
      </UiCard>
    );
  }
}
