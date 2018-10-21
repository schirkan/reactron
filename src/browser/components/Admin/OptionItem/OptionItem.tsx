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

// tslint:disable-next-line:no-empty-interface
interface IOptionItemState {
}

export default class OptionItem extends React.Component<IOptionItemProps, IOptionItemState> {
  private uniqueId = 'ID' + counter;

  constructor(props: IOptionItemProps) {
    super(props);

    this.state = {
      value: this.props.definition.defaultValue
    };

    // this.arrayItemChange = this.arrayItemChange.bind(this);
    this.triggerValueChange = this.triggerValueChange.bind(this);
    this.arrayItemAdd = this.arrayItemAdd.bind(this);
    this.arrayItemRemove = this.arrayItemRemove.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);

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
    array.push();
    this.props.valueChange(this.props.definition, array);
  }

  private renderArray() {
    const array = this.props.value as any[] || [];

    return (
      <React.Fragment>
        <div>Array {this.props.definition.displayName} ({array.length} items)</div>
        {array.map((value, index) => this.renderArrayItem(value, index))}
        <UiButton onClick={this.arrayItemAdd}>+</UiButton>
      </React.Fragment>
    );
  }

  private renderArrayItem(value: any, index: number) {
    const definition = { ...this.props.definition };
    definition.isArray = false;
    definition.displayName = index.toString();

    return (
      <React.Fragment>
        <OptionItem key={index} definition={definition} value={value} valueChange={this.arrayItemChange.bind(this, index)} />
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
        <OptionList definitions={this.props.definition.fields} value={this.props.value} valueChange={this.triggerValueChange} />;
      </React.Fragment>
    );
  }

  private onInputValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.triggerValueChange(e.currentTarget.value);
  }

  private renderTextInput() {
    return (
      <React.Fragment>
        <label htmlFor={this.uniqueId}>{this.props.definition.displayName}</label>
        <input type="text" id={this.uniqueId} value={this.props.value} onChange={this.onInputValueChange} />
      </React.Fragment>
    );
  }

  private renderNumberInput() {
    return (
      <input type="number" />
    );
  }

  private renderBooleanInput() {
    return (
      <input type="checkbox" />
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
      <div className="OptionItem">
        {this.renderInput()}
      </div>
    );
  }
}
