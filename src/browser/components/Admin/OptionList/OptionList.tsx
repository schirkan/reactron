import * as React from 'react';
import { IFieldDefinition } from '../../../../interfaces/IObjectDefinition';
import OptionItem from '../OptionItem/OptionItem';

import './OptionList.css';

interface IOptionListProps {
  definitions?: IFieldDefinition[],
  value: any,
  valueChange: (newValue: any) => void
}

export default class OptionList extends React.Component<IOptionListProps> {
  constructor(props: IOptionListProps) {
    super(props);

    this.valueChange = this.valueChange.bind(this);
  }

  private valueChange(definition: IFieldDefinition, value: any) {
    const newValue = { ...this.props.value };
    newValue[definition.name] = value;
    this.props.valueChange(newValue);
  }

  public render() {
    return (
      <div className="OptionList">
        {this.props.definitions && this.props.definitions.map(item => {
          const value = this.props.value && this.props.value[item.name];
          return <OptionItem key={item.name} definition={item} value={value} valueChange={this.valueChange} />;
        })}
      </div>
    );
  }
}
