import * as classname from 'classnames';
import * as React from 'react';
import { IUiComponentProps } from '../IUiComponentProps';
import { overlayManager } from './OverlayManager';

import './UiOverlay.css';

interface IUiComponentState {
  visible: boolean;
}

export default class UiOverlay extends React.Component<IUiComponentProps, IUiComponentState> {
  constructor(props: IUiComponentProps) {
    super(props);

    this.state = {
      visible: true
    };
  }

  public componentDidMount() {
    overlayManager.add(this);
  }

  public componentWillUnmount() {
    overlayManager.remove(this);
  }

  public show() {
    this.setState({ visible: true });
  }
  public hide() {
    this.setState({ visible: false });
  }

  public render() {
    return (
      <div hidden={!this.state.visible} className={classname('UiOverlay', this.props.className)} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
