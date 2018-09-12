import * as React from 'react';
import Loading from '../Loading/Loading';
import RoundButton from '../RoundButton/RoundButton';
import './Admin.css';
import Navigation from './Navigation/Navigation';

export default class Admin extends React.Component {
  public render() {
    return (
      <section className="Admin">
        <RoundButton to="/">Home</RoundButton>
        <div className="title">Reactron Admin</div>

        <Navigation/>
        
        <div className="content">
          <Loading text="Hier kommt der Content..." />
        </div>
      </section>
    );
  }
}
