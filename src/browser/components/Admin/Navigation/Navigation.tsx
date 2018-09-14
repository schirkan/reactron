import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './Navigation.css';

export default class Navigation extends React.Component {
  public render() {
    return (
      <section className="Navigation">
        <NavLink activeClassName="active" to="/admin/ModuleManager" role="button" >Modules</NavLink>
        <NavLink activeClassName="active" to="/admin/ServiceManager" role="button">Services</NavLink>
        <NavLink activeClassName="active" to="/admin/Pages" role="button">Pages</NavLink>
        <NavLink activeClassName="active" to="/admin/Settings" role="button">Settings</NavLink>
        <NavLink activeClassName="active" to="/admin/System" role="button">System</NavLink>
      </section>
    );
  }
}
