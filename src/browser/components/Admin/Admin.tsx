import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'
import RoundButton from '../RoundButton/RoundButton';
import ModuleManagerPage from './ModuleManagerPage/ModuleManagerPage';
import Navigation from './Navigation/Navigation';
import PageManagerPage from './PageManagerPage/PageManagerPage';
import ServiceManagerPage from './ServiceManagerPage/ServiceManagerPage';
import SettingsManagerPage from './SettingsManagerPage/SettingsManagerPage';
import SystemPage from './SystemPage/SystemPage';

import './Admin.css';

export default class Admin extends React.Component {
  public render() {
    return (
      <section className="Admin">
        <header>
          <RoundButton to="/">
            <FontAwesome.FontAwesomeIcon icon={SvgIcons.faHome} /> Home
          </RoundButton>
          <div className="title">Reactron Admin</div>
        </header>
        <Navigation />
        <div className="content">
          <Switch>
            <Route path="/admin/ModuleManager" component={ModuleManagerPage} />
            <Route path="/admin/ServiceManager" component={ServiceManagerPage} />
            <Route path="/admin/Pages" component={PageManagerPage} />
            <Route path="/admin/Settings" component={SettingsManagerPage} />
            <Route path="/admin/System" component={SystemPage} />
            <Redirect to="/admin/ModuleManager" />
          </Switch>
        </div>
      </section>
    );
  }
}
