import { IWebPageOptions } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import numeral from 'numeral';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { inernalModuleContext } from 'src/browser/inernalModuleContext';
import { apiClient } from '../../ApiClient';
import Loading from '../Loading/Loading';
import PageNotFound from '../PageNotFound/PageNotFound';
import WebComponent from '../WebComponent/WebComponent';

import './App.css';

// load moment locales
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/ru';

// load numeral locales
import 'numeral/min/locales.min';

export interface IAppState {
  pages?: IWebPageOptions[];
}

export default class App extends React.Component<{}, IAppState> {
  private reloadTimer: number;
  private reloadWait: number = 2000;

  constructor(props: any) {
    super(props);
    this.state = {};
    this.reload = this.reload.bind(this);
    this.triggerReload = this.triggerReload.bind(this);
  }

  public componentDidMount() {
    this.init();

    // register page/component change event
    if (inernalModuleContext.topics) {
      inernalModuleContext.topics.subscribe('pages-updated', this.triggerReload);
      inernalModuleContext.topics.subscribe('components-updated', this.triggerReload);
      inernalModuleContext.topics.subscribe('system-settings-updated', this.triggerReload);
    }
  }

  private async init() {
    // load settings
    const settings = await apiClient.getSettings();
    moment.locale(settings.lang);
    numeral.locale(settings.lang);

    // load pages
    const pages = await apiClient.getWebPages();
    return this.setState({ pages });
  }

  private triggerReload() {
    window.clearTimeout(this.reloadTimer);
    this.reloadTimer = window.setTimeout(this.reload, this.reloadWait);
  }

  private reload() {
    console.log('reload');
    apiClient.clearCache();
    this.init();
  }

  public renderPage(id: string, style: any) {
    return () => (
      <section className="WebPage" style={style}>
        <WebComponent id={id} />
      </section>
    );
  }

  public render() {
    let content = <Loading text="Loading Reactron..." center={true} />;

    if (this.state.pages) {
      content = (
        <Router>
          <Switch>
            {this.state.pages.map(item =>
              (<Route key={item.path} path={item.path} exact={item.path === '/'} component={this.renderPage(item.webComponentId, item.style)} />)
            )}
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      );
    }

    return <section className="App">{content}</section>;
  }
}
