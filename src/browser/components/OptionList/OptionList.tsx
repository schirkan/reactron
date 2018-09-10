import * as React from 'react';
import { IOptionDefinition } from '../../../interfaces/IObjectDefinition';
import OptionItem from '../OptionItem/OptionItem';
import './OptionList.css';

interface IOptionListProps {
  definitions: IOptionDefinition[],
  options: any,
  value: any,
}

export default class OptionList extends React.Component<IOptionListProps> {
  constructor(props: IOptionListProps) {
    super(props);
  }

  public render() {
    return (
      <div className="OptionList">
        {this.props.definitions.map(item => {
          const value = this.props.options[item.name];
          return <OptionItem options={this.props.options} key={item.name} definition={item} value={value} />;
        })}
      </div>
    );
  }
}
