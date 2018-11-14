import { IReactronComponentProps } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import { IIFrameOptions } from './IIFrameOptions';

import './IFrame.css';

export default class IFrame extends React.Component<IReactronComponentProps<IIFrameOptions>> {
  public render() {
    return <iframe className="ui-iframe" src={this.props.options.url} />;
  }
}
