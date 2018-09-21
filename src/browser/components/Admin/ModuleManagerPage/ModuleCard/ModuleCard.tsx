import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IModuleRepositoryItem } from '../../../../../interfaces/IModuleRepositoryItem';
import UiCard from '../../UiCard/UiCard';

import './ModuleCard.css';

interface IModuleCardProps {
  module: IModuleRepositoryItem;
  update: (module: IModuleRepositoryItem) => void;
  rebuild: (module: IModuleRepositoryItem) => void;
  remove: (module: IModuleRepositoryItem) => void;
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
  }

  public renderActions() {
    const hideActions = () => this.setState({ showActions: false });

    let updateButton: JSX.Element;
    if (this.props.module.hasUpdate) {
      const onUpdate = () => {
        hideActions();
        this.props.update(this.props.module);
      };
      updateButton = <div className="enabled clickable" onClick={onUpdate}>Update</div>;
    } else {
      updateButton = <div className="disabled">Update</div>;
    }

    let rebuildButton: JSX.Element;
    if (this.props.module.canBuild) {
      const onRebuild = () => {
        hideActions();
        this.props.rebuild(this.props.module);
      };
      rebuildButton = <div className="enabled clickable" onClick={onRebuild}>Rebuild</div>;
    } else {
      rebuildButton = <div className="disabled">Rebuild</div>;
    }

    let removeButton: JSX.Element;
    if (this.props.module.canRemove) {
      const onRemove = () => {
        hideActions();
        this.props.remove(this.props.module);
      };
      removeButton = <div className="enabled clickable" onClick={onRemove}>Remove</div>;
    } else {
      removeButton = <div className="disabled">Remove</div>;
    }

    const className = 'footer actions ' + (this.state.showActions ? 'show' : 'hide');

    return (
      <div className={className}>
        {updateButton}
        {rebuildButton}
        {removeButton}
        <div className="clickable" onClick={hideActions}><FontAwesomeIcon icon={SolidIcons.faTimes} /></div>
      </div>
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

    const showActions = () => this.setState({ showActions: true });

    const className = 'footer default ' + (this.state.showActions ? 'hide' : 'show');

    return (
      <div className={className}>
        <div className="version">{this.props.module.version}</div>
        {repoLink}
        <div className="clickable" onClick={showActions}><FontAwesomeIcon icon={SolidIcons.faCog} /> Modify</div>
      </div>
    );
  }

  public renderTitle() {
    let updateIcon: JSX.Element | undefined;
    if (this.props.module.hasUpdate) {
      updateIcon = <span className="hasUpdates"><FontAwesomeIcon icon={SolidIcons.faStarOfLife} /></span>;
    }

    return (
      <div className="title">
        <FontAwesomeIcon icon={SolidIcons.faCube} />
        <span className="name">{this.props.module.name}</span>
        {updateIcon}
      </div>
    );
  }

  public renderDescription() {
    const text = this.props.module.description ? this.props.module.description : 'no description';

    return (
      <div className="description">{text}</div>
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

    return <div className="author">by {author} </div>;
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
