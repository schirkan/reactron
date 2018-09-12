import * as React from 'react';
import { IDynamicReactComponentProps } from '../../../interfaces/IDynamicReactComponentClass';

import './IFrame.css';

interface IIFrameOptions {
  url: string
}

export default class IFrame extends React.Component<IDynamicReactComponentProps<IIFrameOptions>> {
  public render() {
    return <iframe className="ui-iframe" src={this.props.options.url} />;
  }
}
