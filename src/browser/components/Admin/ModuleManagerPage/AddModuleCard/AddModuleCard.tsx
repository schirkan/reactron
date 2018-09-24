import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import UiButton from '../../UiButton/UiButton';
import UiCard from '../../UiCard/UiCard';
import { IAddModuleCardProps } from './IAddModuleCardProps';

import './AddModuleCard.css';

export default class AddModuleCard extends React.Component<IAddModuleCardProps> {
  public render() {
    let input: HTMLInputElement | null;
    const onAdd = () => this.props.onAdd(input && input.value);

    return (
      <UiCard className="AddModuleCard">
        <input ref={el => input = el} placeholder="GitHub Repository URL" />
        <UiButton className="addButton" onClick={onAdd}>
          <FontAwesomeIcon icon={SolidIcons.faPlus} /> Add
        </UiButton>
      </UiCard>
    );
  }
}
