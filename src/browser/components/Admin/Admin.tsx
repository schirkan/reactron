import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';
import './Admin.css';

export default class Admin extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <section className="admin">
        <RoundButton to="/">Home</RoundButton>
        <header className="header">
          <h1 className="title">Reactron Admin</h1>
        </header>
        <div className="content">
          Hier kommt der Content...
        </div>
      </section>
    );
  }
}
