import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ICommandResult } from '../../../../../interfaces/ICommandResult';
import UiCard from '../../UiCard/UiCard';
import { ICommandResultProps } from './ICommandResultProps';

import './CommandResult.css';

export default class CommandResult extends React.Component<ICommandResultProps> {
  constructor(props: ICommandResultProps) {
    super(props);
  }

  public renderCommandResult(result: ICommandResult, key: string) {
    const icon = result.success === false ?
      <FontAwesomeIcon icon={SolidIcons.faTimes} /> :
      result.success === true ?
        <FontAwesomeIcon icon={SolidIcons.faCheck} /> :
        <FontAwesomeIcon icon={SolidIcons.faQuestion} />;

    let log: JSX.Element | undefined;
    if (result.log && result.log.length) {
      log = (
        <ul className="log">
          {result.log.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    }

    let title = result.command || '';
    if (result.args) {
      title += ' | args: ' + result.args;
    }

    return (
      <React.Fragment>
        <div className="result" key={key}>
          <div className="commandTitle">{icon} {title}</div>
          {log}
        </div>
        {result.children && result.children.map((child, index) =>
          this.renderCommandResult(child, key + '.' + index))}
      </React.Fragment>
    );
  }

  public render() {
    return (
      <UiCard className="CommandResult">
        <div className="title">Result</div>
        <div className="close clickable" onClick={this.props.onClose}>
          <FontAwesomeIcon icon={SolidIcons.faTimes} />
        </div>
        <div className="results">
          {this.props.results.map((item, index) => this.renderCommandResult(item, index.toString()))}
        </div>
      </UiCard>
    );
  }
}
