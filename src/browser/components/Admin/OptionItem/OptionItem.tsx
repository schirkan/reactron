import * as React from 'react';
import { IFieldDefinition } from '../../../../interfaces/IObjectDefinition';
import OptionList from '../OptionList/OptionList';
import UiButton from '../UiButton/UiButton';

import './OptionItem.css';

let counter = 0;

interface IOptionItemProps {
  definition: IFieldDefinition,
  value: any,
  valueChange: (definition: IFieldDefinition, newValue: any) => void
}

export default class OptionItem extends React.Component<IOptionItemProps> {
  private uniqueId = 'ID' + counter;

  constructor(props: IOptionItemProps) {
    super(props);

    this.triggerValueChange = this.triggerValueChange.bind(this);
    this.arrayItemAdd = this.arrayItemAdd.bind(this);
    this.arrayItemRemove = this.arrayItemRemove.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onSelectValueChange = this.onSelectValueChange.bind(this);

    counter++;
  }

  private getDefaultValue(field: IFieldDefinition) {
    const value = field.defaultValue;

    if (field.isArray) {
      if (value && Array.isArray(value)) {
        return value;
      }
      return [];
    }

    switch (field.valueType) {
      case 'object':
        return value || {};
      case 'number':
        return value || 0;
      case 'boolean':
        return value || false;
      case 'string':
        return value || '';
      case 'style':
        return value || {};
      case 'webComponent':
        return null;
    }
    return null;
  }

  private triggerValueChange(newValue: any) {
    this.props.valueChange(this.props.definition, newValue);
  }

  private arrayItemChange(index: number, newValue: any) {
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
    let array = this.props.value as any[] || [];
    array = array.slice();
    array.push(this.getDefaultValue(this.props.definition));
    this.props.valueChange(this.props.definition, array);
  }

  private renderArray() {
    const array = this.props.value as any[] || [];

    return (
      <React.Fragment>
        <div>
          <span>Array {this.props.definition.displayName} ({array.length} items)</span>
          <UiButton onClick={this.arrayItemAdd}>+</UiButton>
        </div>        
        {array.map((value, index) => this.renderArrayItem(value, index))}
      </React.Fragment>
    );
  }

  private renderArrayItem(value: any, index: number) {
    const definition = { ...this.props.definition };
    definition.isArray = false;
    definition.displayName = index.toString();

    return (
      <React.Fragment key={index}>
        <OptionItem definition={definition} value={value} valueChange={this.arrayItemChange.bind(this, index)} />
        <UiButton onClick={this.arrayItemRemove.bind(this, index)}>-</UiButton>
      </React.Fragment>
    );
  }

  private renderObject() {
    if (!this.props.definition.fields) {
      return <span>Not itemDefinition</span>;
    }
    return (
      <React.Fragment>
        <div>Object {this.props.definition.displayName}</div>
        <OptionList definitions={this.props.definition.fields} value={this.props.value} valueChange={this.triggerValueChange} />
      </React.Fragment>
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

  private renderTextInput() {
    let inputControl;
    if (this.props.definition.values) {
      const options = this.props.definition.values.map((item, index) =>
        <option key={index} value={item.value}>{item.text}</option>
      );
      inputControl = (
        <select id={this.uniqueId} value={this.props.value} onChange={this.onSelectValueChange}>
          {options}
        </select>
      );
    } else {
      inputControl = <input type="text" id={this.uniqueId} value={this.props.value} onChange={this.onInputChange} />;
    }

    return (
      <React.Fragment>
        <label htmlFor={this.uniqueId}>{this.props.definition.displayName}</label>
        {inputControl}
      </React.Fragment>
    );
  }

  private renderNumberInput() {
    return (
      <React.Fragment>
        <label htmlFor={this.uniqueId}>{this.props.definition.displayName}</label>
        <input type="number" id={this.uniqueId} value={this.props.value} onChange={this.onInputChange}
          min={this.props.definition.minValue} max={this.props.definition.maxValue} step={this.props.definition.stepSize}
        />
      </React.Fragment>
    );
  }

  private renderBooleanInput() {
    return (
      <React.Fragment>
        <label htmlFor={this.uniqueId}>{this.props.definition.displayName}</label>
        <input type="checkbox" id={this.uniqueId} value={this.props.value} onChange={this.onCheckboxChange} />
      </React.Fragment>
    );
  }

  private renderStyleInput() {
    return (
      <input type="text" />
    );
  }

  private renderWebComponentInput() {
    return (
      <input type="text" />
    );
  }

  public renderInput() {
    if (this.props.definition.isArray) {
      return this.renderArray();
    }
    switch (this.props.definition.valueType) {
      case 'object':
        return this.renderObject();
      case 'number':
        return this.renderNumberInput();
      case 'boolean':
        return this.renderBooleanInput();
      case 'string':
        return this.renderTextInput();
      case 'style':
        return this.renderStyleInput();
      case 'webComponent':
        return this.renderWebComponentInput();
    }
    return null;
  }

  public render() {
    return (
      <div className="OptionItem" data-valuetype={this.props.definition.valueType}>
        {this.renderInput()}
      </div>
    );
  }
}
