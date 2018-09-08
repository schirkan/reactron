import * as React from 'react';
import { Link } from 'react-router-dom';
import './RoundButton.css';

interface IRoundButtonProps {
  to: string;
}

export default class RoundButton extends React.Component<IRoundButtonProps> {
  constructor(props: IRoundButtonProps) {
    super(props);
  }

  public render() {
    return <Link className="RoundButton" to={this.props.to} role="button">{this.props.children}</Link>;
  }
}
