// main entry file for react
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Admin from './browser/components/Admin/Admin';
import App from './browser/components/App/App';
import ErrorBoundary from './browser/components/ErrorBoundary/ErrorBoundary';
import NotFound from './browser/components/NotFound/NotFound';

import './index.css';

ReactDOM.render(
  (<ErrorBoundary>
    <Router>
      <Switch>
        <Route exact={true} path='/' component={App} />
        <Route path='/admin' component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </ErrorBoundary>),
  document.getElementById('root') as HTMLElement
);
