import * as React from 'react';
import { IFieldDefinition } from '../../../../interfaces/IObjectDefinition';
import OptionItem from '../OptionItem/OptionItem';

import './OptionList.css';

interface IOptionListProps {
  definitions?: IFieldDefinition[];
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
    if (!this.props.definitions || !this.props.definitions.length) {
      return null;
    }

    return (
      <div className="OptionList">
        {this.props.definitions.map(field => {
          const value = this.props.value && this.props.value[field.name];
          return <OptionItem key={field.name} definition={field} value={value} valueChange={this.valueChange} />;
        })}
      </div>
    );
  }
}
