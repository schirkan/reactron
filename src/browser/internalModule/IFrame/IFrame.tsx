import * as React from 'react';
import { IIFrameOptions } from './IIFrameOptions';

import './IFrame.css';

export default class IFrame extends React.Component<IIFrameOptions> {
  public render() {
    return <iframe className="ui-iframe" src={this.props.url} />;
  }
}
