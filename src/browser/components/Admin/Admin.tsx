import * as React from 'react';
import Loading from '../Loading/Loading';
import RoundButton from '../RoundButton/RoundButton';
import './Admin.css';

export default class Admin extends React.Component {
  public render() {
    return (
      <section className="Admin">
        <RoundButton to="/">Home</RoundButton>
        <div className="title">Reactron Admin</div>

        <div className="navigation">
          Hier kommt die Navigation
        </div>
        <div className="content">
          <Loading text="Hier kommt der Content..." />
        </div>
      </section>
    );
  }
}
