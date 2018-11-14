import { IFieldDefinition } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import OptionItem from '../OptionItem/OptionItem';

import './OptionList.css';

interface IOptionListProps {
  fields?: IFieldDefinition[];
  value: object;
  valueChange: (newValue: object) => void;
}

export default class OptionList extends React.Component<IOptionListProps> {
  constructor(props: IOptionListProps) {
    super(props);

    this.valueChange = this.valueChange.bind(this);
  }

  private valueChange(field: IFieldDefinition, value: any) {
    const newValue = { ...this.props.value };
    newValue[field.name] = value;
    this.props.valueChange(newValue);
  }

  public render() {
    if (!this.props.fields || !this.props.fields.length) {
      return null;
      // return <span>No options / fields defined</span>;
    }

    return (
      <div className="OptionList">
        {this.props.fields.map(field => {
          const value = this.props.value && this.props.value[field.name];
          return <OptionItem key={field.name} definition={field} value={value} valueChange={this.valueChange} />;
        })}
      </div>
    );
  }
}
