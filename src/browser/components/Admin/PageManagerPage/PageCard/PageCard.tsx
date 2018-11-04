import * as RegularIcons from '@fortawesome/free-regular-svg-icons';
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

    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  private onEdit() {
    return this.props.onEdit(this.props.page);
  }

  private onDelete() {
    return this.props.onDelete(this.props.page);
  }

  public renderTitle() {
    return (
      <UiCardTitle>
        <FontAwesomeIcon icon={RegularIcons.faFile} /> {this.props.page.title} ({this.props.page.path})
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
        <UiButton onClick={this.onEdit}>
          <FontAwesomeIcon icon={RegularIcons.faEdit} /> Edit
        </UiButton>
        <UiButton onClick={this.onDelete}>
          <FontAwesomeIcon icon={RegularIcons.faTrashAlt} /> Delete
        </UiButton>
      </UiCardButtonRow>
    );
  }

  public render() {
    return (
      <UiCard className="PageCard">
        {this.renderTitle()}
        {/* {this.renderPath()} */}
        {this.renderFooter()}
      </UiCard>
    );
  }
}
