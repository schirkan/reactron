import * as React from 'react';
import { Link } from 'react-router-dom';
import { IRoundButtonProps } from './IRoundButtonProps';
import './RoundButton.scss';

export default class RoundButton extends React.Component<IRoundButtonProps> {
  public render() {
    return <Link className="RoundButton" to={this.props.to} role="button">{this.props.children}</Link>;
  }
}
