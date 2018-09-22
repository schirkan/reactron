import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as classname from 'classnames';
import * as React from 'react';
import UiCard from '../../UiCard/UiCard';
import { IUpdateModulesCardProps } from './IUpdateModulesCardProps';

import './UpdateModulesCard.css';

export default class UpdateModulesCard extends React.Component<IUpdateModulesCardProps> {
  constructor(props: IUpdateModulesCardProps) {
    super(props);
  }

  public render() {
    const modulesWithUpdates = this.props.modules.filter(x => x.hasUpdate);
    const isChecked = this.props.modules.some(x => x.hasUpdate !== undefined);
    const updatesTitle = isChecked ? modulesWithUpdates.length : '-';

    let checkUpdatesButton;
    if (this.props.checkingUpdates) {
      checkUpdatesButton = (
        <div className="checkUpdatesButton clickable disabled">
          <FontAwesomeIcon icon={SolidIcons.faSyncAlt} spin={true} /> Check
        </div>
      );
    } else {
      checkUpdatesButton = (
        <div className="checkUpdatesButton clickable" onClick={this.props.onCheckUpdates}>
          <FontAwesomeIcon icon={SolidIcons.faSyncAlt} /> Check
        </div>
      );
    }

    const updateAllButtonClassname = classname('updateAllButton', 'clickable', { 'disabled': !modulesWithUpdates.length })
    const updateAllButton = (
      <div className={updateAllButtonClassname} onClick={this.props.onUpdateAll}>
        <FontAwesomeIcon icon={SolidIcons.faDownload} /> Update All
      </div>
    );

    return (
      <UiCard className="UpdateModulesCard">
        <div className="title">Updates: {updatesTitle}</div>
        {checkUpdatesButton}
        {updateAllButton}
      </UiCard>
    );
  }
}
