import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';

export default class PageNotFound extends React.Component<{ location: any }> {
  public render() {
    const location = this.props.location.pathname;
    return (
      <div className="PageNotFound" style={{ margin: '20px' }}>
        <h1>No page defined for path: {location}</h1>
        <RoundButton to="/admin">Admin</RoundButton>
        <RoundButton to="/">Home</RoundButton>
      </div >
    );
  }
}