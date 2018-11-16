import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as classname from 'classnames';
import * as React from 'react';
import UiButton from '../../UiButton/UiButton';
import UiCard from '../../UiCard/UiCard';
import UiCardButtonRow from '../../UiCardButtonRow/UiCardButtonRow';
import UiCardContent from '../../UiCardContent/UiCardContent';
import UiCardTitle from '../../UiCardTitle/UiCardTitle';

import './ModuleCard.css';

export interface IModuleCardProps {
  module: IModuleRepositoryItem;
  onUpdate: (module: IModuleRepositoryItem) => void;
  onRebuild: (module: IModuleRepositoryItem) => void;
  onRemove: (module: IModuleRepositoryItem) => void;
}

interface IModuleCardState {
  showActions: boolean;
}

export default class ModuleCard extends React.Component<IModuleCardProps, IModuleCardState> {
  constructor(props: IModuleCardProps) {
    super(props);

    this.state = {
      showActions: false
    };

    this.showActions = this.showActions.bind(this);
    this.hideActions = this.hideActions.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onRebuild = this.onRebuild.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  private showActions() {
    this.setState({ showActions: true });
  }

  private hideActions() {
    this.setState({ showActions: false });
  }

  private onUpdate() {
    this.hideActions();
    this.props.onUpdate(this.props.module);
  }

  private onRebuild() {
    this.hideActions();
    this.props.onRebuild(this.props.module);
  }

  private onRemove() {
    this.hideActions();
    this.props.onRemove(this.props.module);
  }

  public renderTitle() {
    let updateIcon: JSX.Element | undefined;
    if (this.props.module.hasUpdate) {
      updateIcon = <span className="hasUpdate"><FontAwesomeIcon icon={SolidIcons.faStarOfLife} /></span>;
    }

    return (
      <UiCardTitle>
        <FontAwesomeIcon icon={SolidIcons.faCube} /> {this.props.module.name}
        {updateIcon}
      </UiCardTitle>
    );
  }

  public renderDescription() {
    return (
      <UiCardContent className="description">
        {this.props.module.description || 'no description'}
      </UiCardContent>
    );
  }

  public renderAuthor() {
    let authorName: string | undefined = 'unknown';
    let authorMail: string | undefined;
    if (typeof this.props.module.author === 'string') {
      authorName = this.props.module.author;
    } else if (typeof this.props.module.author === 'object') {
      authorName = this.props.module.author.name || this.props.module.author.email;
      authorMail = this.props.module.author.email;
    }
    const author = (authorMail) ? (<a href={'mailto://' + authorMail}>{authorName}</a>) : authorName;

    return (
      <UiCardContent className="author">by {author}</UiCardContent>
    );
  }

  public renderFooter() {
    let repoLink = <div />;
    if (this.props.module.repository) {
      repoLink = (
        <a className="clickable" href={this.props.module.repository} target="_blank">
          <FontAwesomeIcon icon={BrandIcons.faGithub} /> GitHub
        </a>
      );
    }

    const className = classname('footer', 'default', { 'hide': this.state.showActions });

    return (
      <UiCardButtonRow className={className} divider="half">
        <div className="version">{this.props.module.version}</div>
        {repoLink}
        <UiButton onClick={this.showActions}><FontAwesomeIcon icon={SolidIcons.faCog} /> Modify</UiButton>
      </UiCardButtonRow>
    );
  }

  public renderActions() {
    const className = classname('footer', 'actions', { 'hide': !this.state.showActions });

    return (
      <UiCardButtonRow className={className} divider="full">
        <UiButton disabled={!this.props.module.hasUpdate} onClick={this.onUpdate}>Update</UiButton>
        <UiButton disabled={!this.props.module.canBuild} onClick={this.onRebuild}>Rebuild</UiButton>
        <UiButton disabled={!this.props.module.canRemove} onClick={this.onRemove}>Remove</UiButton>
        <UiButton onClick={this.hideActions}><FontAwesomeIcon icon={SolidIcons.faTimes} /></UiButton>
      </UiCardButtonRow>
    );
  }

  public render() {
    return (
      <UiCard className="ModuleCard">
        {this.renderTitle()}
        {this.renderDescription()}
        {this.renderAuthor()}
        {this.renderFooter()}
        {this.renderActions()}
      </UiCard>
    );
  }
}
