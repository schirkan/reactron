import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';

export default class NotFound extends React.Component<{ location: any }> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const location = this.props.location.pathname;
    return (
      <div className="NotFound" style={{ margin: '20px' }}>
        <h1>No page defined for path: {location}</h1>
        <RoundButton to="/admin">Admin</RoundButton>
        <RoundButton to="/">Home</RoundButton>
      </div >
    );
  }
}