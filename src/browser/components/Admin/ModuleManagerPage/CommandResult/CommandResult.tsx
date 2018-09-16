import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ICommandResult } from '../../../../../interfaces/ICommandResult';

import './CommandResult.css';

interface ICommandResultProps {
  results: ICommandResult[];
  onClose: () => void;
}

export default class CommandResult extends React.Component<ICommandResultProps> {
  constructor(props: ICommandResultProps) {
    super(props);

  }

  public renderCommandResult(result: ICommandResult, index: number) {
    const icon = result.success === false ?
      <FontAwesomeIcon icon={SolidIcons.faTimes} /> :
      <FontAwesomeIcon icon={SolidIcons.faCheck} />;

    let log: JSX.Element | undefined;
    if (result.log && result.log.length) {
      log = (<ul className="log">
        {result.log.map((item, i) => <li key={i}>{item}</li>)}
      </ul>);
    }

    return (
      <div className="result" key={index}>
        <div className="commandTitle">{icon} {result.command} args: {result.args}</div>
        {log}
      </div>
    );
  }

  public render() {
    return (
      <section className="CommandResult">
        <div className="title">Result:</div>
        <div className="close clickable" onClick={this.props.onClose}>
          <FontAwesomeIcon icon={SolidIcons.faTimes} />
        </div>
        <div className="results">
          {this.props.results.map((item, index) => this.renderCommandResult(item, index))}
        </div>
      </section >
    );
  }
}
