import * as React from 'react';
import { IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';
import { IIFrameOptions } from './IIFrameOptions';

import './IFrame.css';

export default class IFrame extends React.Component<IDynamicReactComponentProps<IIFrameOptions>> {
  public render() {
    return <iframe className="ui-iframe" src={this.props.options.url} />;
  }
}
