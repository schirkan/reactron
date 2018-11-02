import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { getDefaultFieldValue } from '../../../../common/getDefaultFieldValue';
import { IFieldDefinition } from '../../../../interfaces/IObjectDefinition';
import OptionList from '../OptionList/OptionList';
import UiButton from '../UiButton/UiButton';
import SelectWebComponent from './SelectWebComponent/SelectWebComponent';

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
  detailsVisible: boolean;
}

export default class OptionItem extends React.Component<IOptionItemProps, IOptionItemState> {
  constructor(props: IOptionItemProps) {
    super(props);

    let hasDetails = !!props.definition.isArray;

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
      detailsVisible: false
    };

    this.triggerValueChange = this.triggerValueChange.bind(this);
    this.arrayItemAdd = this.arrayItemAdd.bind(this);
    this.arrayItemRemove = this.arrayItemRemove.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onSelectValueChange = this.onSelectValueChange.bind(this);
    this.toggleItemDetails = this.toggleItemDetails.bind(this);
  }



  private triggerValueChange(newValue: any) {
    this.props.valueChange(this.props.definition, newValue);
  }

  private arrayItemChange(index: number, definition: IFieldDefinition, newValue: any) {
    let array = this.props.value as any[] || [];
    array = array.slice();
    array[index] = newValue;
    this.props.valueChange(this.props.definition, array);
  }

  private arrayItemRemove(index: number) {
    let array = this.props.value as any[] || [];
    array = array.slice();
    array.splice(index, 1);
    this.props.valueChange(this.props.definition, array);
  }

  private arrayItemAdd() {
    const arrayItemDefinition = { ...this.props.definition };
    arrayItemDefinition.isArray = false;

    let array = this.props.value as any[] || [];
    array = array.slice();
    array.push(getDefaultFieldValue(arrayItemDefinition));
    this.props.valueChange(this.props.definition, array);
  }

  private renderArray() {
    const array = this.props.value as any[] || [];
    return (
      <React.Fragment>
        {array.map((value, index) => this.renderArrayItem(value, index))}
        <UiButton onClick={this.arrayItemAdd} className="arrayItemAddButton">
          <FontAwesomeIcon icon={SolidIcons.faPlus} /> Add item
        </UiButton>
      </React.Fragment>
    );
  }

  private renderArrayItem(value: any, index: number) {
    const arrayItemDefinition = { ...this.props.definition };
    arrayItemDefinition.isArray = false;
    arrayItemDefinition.displayName = (index + 1).toString();

    return (
      <React.Fragment key={index}>
        <UiButton onClick={this.arrayItemRemove.bind(this, index)}>
          <FontAwesomeIcon icon={SolidIcons.faMinus} />
        </UiButton>
        <OptionItem definition={arrayItemDefinition} value={value} valueChange={this.arrayItemChange.bind(this, index)} />
      </React.Fragment>
    );
  }

  private renderObject() {
    if (!this.props.definition.fields) {
      return <span>Not itemDefinition</span>;
    }
    return (
      <OptionList definitions={this.props.definition.fields} value={this.props.value} valueChange={this.triggerValueChange} />
    );
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
      <React.Fragment>
        TODO: STYLE
      </React.Fragment>
    );
  }

  private renderWebComponentInput() {
    // <input type="text" id={this.state.uniqueId} value={this.props.value} onChange={this.onInputChange} />

    return (
      <React.Fragment>        
        <SelectWebComponent onChange={this.triggerValueChange} webComponentId={this.props.value} />
      </React.Fragment>
    );
  }

  private toggleItemDetails() {
    this.setState(state => ({ detailsVisible: !state.detailsVisible }));
  }

  private renderItemHeader() {
    let subHeaderText = null;

    if (this.props.definition.isArray) {
      const array = this.props.value as any[] || [];
      subHeaderText = '(' + array.length + ' items)';
    }

    return (
      <UiButton className="item-header" onClick={this.toggleItemDetails}>
        <span className="header-text">{this.props.definition.displayName}</span>
        <span className="sub-header-text">{subHeaderText}</span>
        <UiButton>
          <FontAwesomeIcon icon={this.state.detailsVisible ? SolidIcons.faArrowDown : SolidIcons.faArrowRight} />
        </UiButton>
      </UiButton>
    );
  }

  private renderLabel() {
    if (this.state.hasDetails) {
      return this.renderItemHeader();
    }
    return <label htmlFor={this.state.uniqueId}>{this.props.definition.displayName}</label>;
  }

  private renderInput() {
    if (this.state.hasDetails) {
      return (
        <div className="item-details" hidden={!this.state.detailsVisible} data-isarray={this.props.definition.isArray ? 'true' : 'false'}>
          {this.renderInputInternal()}
        </div>
      );
    }
    return this.renderInputInternal();
  }

  private renderInputInternal() {
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
      <div className="OptionItem" data-hasdetails={this.state.hasDetails ? 'true' : 'false'} data-detailsvisible={this.state.detailsVisible ? 'true' : 'false'}>
        {this.renderLabel()}
        {this.renderInput()}
      </div>
    );
  }
}
