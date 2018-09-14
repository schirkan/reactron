import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';
import { IPageNotFoundProps } from './IPageNotFoundProps';

export default class PageNotFound extends React.Component<IPageNotFoundProps> {
  public render() {
    return (
      <div className="PageNotFound" style={{ margin: '20px' }}>
        <h1>No page defined for path: {this.props.location.pathname}</h1>
        <RoundButton to="/admin">Admin</RoundButton>
        <RoundButton to="/">Home</RoundButton>
      </div >
    );
  }
}