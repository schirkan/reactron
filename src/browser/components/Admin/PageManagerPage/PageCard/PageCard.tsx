import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import UiButton from '../../UiButton/UiButton';
import UiCard from '../../UiCard/UiCard';
import UiCardButtonRow from '../../UiCardButtonRow/UiCardButtonRow';
import UiCardContent from '../../UiCardContent/UiCardContent';
import UiCardTitle from '../../UiCardTitle/UiCardTitle';
import { IPageCardProps } from './IPageCardProps';

import './PageCard.css';

export default class PageCard extends React.Component<IPageCardProps> {
  constructor(props: IPageCardProps) {
    super(props);

    this.showOptions = this.showOptions.bind(this);
  }

  private showOptions() {
    return;
  }

  public renderTitle() {
    return (
      <UiCardTitle>
        <FontAwesomeIcon icon={SolidIcons.faPaperclip} /> {this.props.page.title}
      </UiCardTitle>
    );
  }

  public renderPath() {
    return (
      <UiCardContent className="path">
        {this.props.page.path}
      </UiCardContent>
    );
  }

  public renderFooter() {
    return (
      <UiCardButtonRow divider="half">
        <UiButton onClick={this.showOptions}>
          <FontAwesomeIcon icon={SolidIcons.faCog} /> Options
        </UiButton>
      </UiCardButtonRow>
    );
  }

  public render() {
    return (
      <UiCard className="PageCard">
        {this.renderTitle()}
        {this.renderPath()}
        {this.renderFooter()}
      </UiCard>
    );
  }
}
