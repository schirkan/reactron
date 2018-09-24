import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import UiButton from '../../UiButton/UiButton';
import UiCard from '../../UiCard/UiCard';
import UiCardButtonRow from '../../UiCardButtonRow/UiCardButtonRow';
import { IUpdateModulesCardProps } from './IUpdateModulesCardProps';

import './UpdateModulesCard.css';

export default class UpdateModulesCard extends React.Component<IUpdateModulesCardProps> {
  public render() {
    const modulesWithUpdates = this.props.modules.filter(x => x.hasUpdate);
    const isChecked = this.props.modules.some(x => x.hasUpdate !== undefined);
    const updatesTitle = isChecked ? modulesWithUpdates.length : '-';

    return (
      <UiCard className="UpdateModulesCard">
        <UiCardButtonRow divider="full">
          <div>Updates: {updatesTitle}</div>
          <UiButton className="checkUpdatesButton" onClick={this.props.onCheckUpdates} disabled={this.props.checkingUpdates}>
            <FontAwesomeIcon icon={SolidIcons.faSyncAlt} spin={this.props.checkingUpdates} /> Check
          </UiButton>
          <UiButton className="updateAllButton" onClick={this.props.onCheckUpdates} disabled={!modulesWithUpdates.length}>
            <FontAwesomeIcon icon={SolidIcons.faDownload} /> Update All
          </UiButton>
        </UiCardButtonRow>
      </UiCard>
    );
  }
}
