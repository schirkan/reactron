import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';
import logo from './logo.svg';
import './Welcome.css';

export default class Welcome extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <section className="Welcome">
        <img src={logo} className="logo" alt="logo" />
        <div className="title">Welcome to Reactron</div>
        <RoundButton to="/admin">Admin</RoundButton>
      </section>
    );
  }
}
