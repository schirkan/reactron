import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as RegularIcons from '@fortawesome/free-regular-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFieldDefinition } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import OptionList from '../OptionList/OptionList';
import UiButton from '../UiButton/UiButton';
import ArrayForm from './ArrayForm/ArrayForm';
import StyleForm from './StyleForm/StyleForm';
import WebComponentForm from './WebComponentForm/WebComponentForm';

import './OptionItem.css';

let counter = 0;

interface IOptionItemProps {
  definition: IFieldDefinition;
  value: any;
  valueChange: (definition: IFieldDefinition, newValue: any) => void;
}

interface IOptionItemState {
  uniqueId: string;
  hasDetails: boolean;
  detailsVisible?: boolean;
}

export default class OptionItem extends React.Component<IOptionItemProps, IOptionItemState> {
  constructor(props: IOptionItemProps) {
    super(props);

    let hasDetails = !!props.definition.isArray || (props.definition.textRows !== undefined && props.definition.textRows > 1);

    switch (props.definition.valueType) {
      case 'object':
      case 'style':
      case 'webComponent':
        hasDetails = true;
        break;
    }

    this.state = {
      uniqueId: 'ID' + (counter++),
      hasDetails,
    };

    this.triggerValueChange = this.triggerValueChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onTextareaChange = this.onTextareaChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onSelectValueChange = this.onSelectValueChange.bind(this);
    this.toggleItemDetails = this.toggleItemDetails.bind(this);
  }

  private triggerValueChange(newValue: any) {
    this.props.valueChange(this.props.definition, newValue);
  }

  private renderArray() {
    return (
      <ArrayForm definition={this.props.definition} value={this.props.value} valueChange={this.triggerValueChange} />
    );
  }

  private renderObject() {
    return (
      <OptionList fields={this.props.definition.fields} value={this.props.value} valueChange={this.triggerValueChange} />
    );
  }

  private onTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.triggerValueChange(e.currentTarget.value);
  }

  private onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.triggerValueChange(e.currentTarget.value);
  }

  private onSelectValueChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.triggerValueChange(e.currentTarget.value);
  }

  private onCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.triggerValueChange(e.currentTarget.checked);
  }

  private renderDropDown() {
    const values = this.props.definition.values || [];
    const options = values.map((item, index) =>
      <option key={index} value={item.value}>{item.text}</option>
    );

    return (
      <select id={this.state.uniqueId} value={this.props.value} onChange={this.onSelectValueChange}>
        {options}
      </select>
    );
  }

  private renderTextInput() {
    if (this.props.definition.textRows !== undefined && this.props.definition.textRows > 1) {
      return (
        <textarea id={this.state.uniqueId} value={this.props.value} onChange={this.onTextareaChange} rows={this.props.definition.textRows} />
      );
    }

    return (
      <input type="text" id={this.state.uniqueId} value={this.props.value} onChange={this.onInputChange} />
    );
  }

  private renderNumberInput() {
    let inputType = 'number';

    if (this.props.definition.minValue !== undefined &&
      this.props.definition.maxValue !== undefined) {
      inputType = 'range';
    }

    return (
      <input type={inputType} id={this.state.uniqueId} value={this.props.value}
        onChange={this.onInputChange} step={this.props.definition.stepSize}
        min={this.props.definition.minValue} max={this.props.definition.maxValue} />
    );
  }

  private renderBooleanInput() {
    return (
      <input type="checkbox" id={this.state.uniqueId} value={this.props.value} onChange={this.onCheckboxChange} />
    );
  }

  private renderStyleInput() {
    return (
      <StyleForm value={this.props.value} onChange={this.triggerValueChange} />
    );
  }

  private renderWebComponentInput() {
    return (
      <WebComponentForm webComponentId={this.props.value} onChange={this.triggerValueChange} />
    );
  }

  private toggleItemDetails() {
    this.setState(state => ({ detailsVisible: !state.detailsVisible }));
  }

  private renderItemHeader() {
    let subHeaderText = null;
    let icon = null;

    if (this.props.definition.isArray) {
      const array = this.props.value as any[] || [];
      subHeaderText = '(' + array.length + ' items)';
      icon = SolidIcons.faList;
    } else if (this.props.definition.valueType === 'string') {
      subHeaderText = this.props.value;
    } else if (this.props.definition.valueType === 'style') {
      subHeaderText = JSON.stringify(this.props.value);
      if(subHeaderText === '{}'){
        subHeaderText = '';
      }
      icon = BrandIcons.faCss3;
    } else if (this.props.definition.valueType === 'webComponent') {
      subHeaderText = this.props.value || 'Component';
      icon = RegularIcons.faFile;
    }

    return (
      <UiButton className="item-header" onClick={this.toggleItemDetails}>
        <label>
          {this.props.children}
          {icon && (<UiButton><FontAwesomeIcon icon={icon} /></UiButton>)}
          <span className="header-text">{this.props.definition.displayName}</span>
        </label>
        <span className="sub-header-text">{subHeaderText}</span>
        <UiButton>
          <FontAwesomeIcon icon={this.state.detailsVisible ? SolidIcons.faCaretDown : SolidIcons.faCaretRight} />
        </UiButton>
      </UiButton>
    );
  }

  private renderLabel() {
    if (this.state.hasDetails) {
      return this.renderItemHeader();
    }
    return (
      <label htmlFor={this.state.uniqueId}>
        {this.props.children}
        <span className="header-text">{this.props.definition.displayName}</span>
      </label>
    );
  }

  private renderInput() {
    if (this.state.hasDetails) {
      return (
        <div className="item-details" hidden={!this.state.detailsVisible} data-isarray={this.props.definition.isArray ? 'true' : 'false'}>
          {this.renderInputControl()}
        </div>
      );
    }
    return this.renderInputControl();
  }

  private renderInputControl() {
    if (this.props.definition.isArray) {
      return this.renderArray();
    }

    if (this.props.definition.values && this.props.definition.values.length) {
      return this.renderDropDown();
    }

    switch (this.props.definition.valueType) {
      case 'number':
        return this.renderNumberInput();
      case 'boolean':
        return this.renderBooleanInput();
      case 'string':
        return this.renderTextInput();
      case 'object':
        return this.renderObject();
      case 'style':
        return this.renderStyleInput();
      case 'webComponent':
        return this.renderWebComponentInput();
    }

    return null;
  }

  public render() {
    return (
      <div className="OptionItem"
        data-hasdetails={this.state.hasDetails ? 'true' : 'false'}
        data-detailsvisible={this.state.detailsVisible ? 'true' : 'false'}
        data-valuetype={this.props.definition.valueType}>
        {this.renderLabel()}
        {this.renderInput()}
      </div>
    );
  }
}
