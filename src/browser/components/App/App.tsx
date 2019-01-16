import { IWebPageOptions, topicNames } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import numeral from 'numeral';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { inernalModuleContext } from '../../inernalModuleContext';
import { apiClient } from '../../ApiClient';
import Loading from '../Loading/Loading';
import PageNotFound from '../PageNotFound/PageNotFound';
import WebComponent from '../WebComponent/WebComponent';

// load moment & numeral locales
import 'moment/min/locales.min';
import 'numeral/min/locales.min';

import './App.css';

export interface IAppState {
  pages?: IWebPageOptions[];
}

export default class App extends React.Component<any, IAppState> {
  private reloadTimer: number | undefined;
  private reloadWait: number = 2000;

  constructor(props: any) {
    super(props);
    this.state = {};
    this.reload = this.reload.bind(this);
    this.triggerReload = this.triggerReload.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  public componentDidMount() {
    this.init();
    this.subscribeTopics();
    document.addEventListener('keydown', this.onKeyDown);
  }

  public componentWillUnmount() {
    this.unsubscribeTopics();
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown(e: KeyboardEvent) {
    const evtobj = window.event ? window.event as KeyboardEvent : e;
    if (evtobj.keyCode === 65 && evtobj.ctrlKey && evtobj.altKey) {
      window.location.href = '/admin';
    }
  }

  private subscribeTopics() {
    // register page/component change event
    if (inernalModuleContext.topics) {
      inernalModuleContext.topics.subscribe(topicNames.pagesUpdated, this.triggerReload);
      inernalModuleContext.topics.subscribe(topicNames.componentsUpdated, this.triggerReload);
      inernalModuleContext.topics.subscribe(topicNames.systemSettingsUpdated, this.triggerReload);
    }
  }

  private unsubscribeTopics() {
    if (inernalModuleContext.topics) {
      inernalModuleContext.topics.unsubscribe(topicNames.pagesUpdated, this.triggerReload);
      inernalModuleContext.topics.unsubscribe(topicNames.componentsUpdated, this.triggerReload);
      inernalModuleContext.topics.unsubscribe(topicNames.systemSettingsUpdated, this.triggerReload);
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
