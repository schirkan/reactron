// main entry file for react
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './browser/components/App/App';
import ErrorBoundary from './browser/components/ErrorBoundary/ErrorBoundary';

import './index.scss';

ReactDOM.render(
  <ErrorBoundary><App /></ErrorBoundary>,
  document.getElementById('root') as HTMLElement
);