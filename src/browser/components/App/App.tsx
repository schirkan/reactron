import { IWebPageOptions } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { inernalModuleContext } from 'src/browser/inernalModuleContext';
import { apiClient } from '../../ApiClient';
import Loading from '../Loading/Loading';
import PageNotFound from '../PageNotFound/PageNotFound';
import WebComponent from '../WebComponent/WebComponent';

import './App.css';

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
    this.loadPages();

    // register page/component change event
    if (inernalModuleContext.topics) {
      inernalModuleContext.topics.subscribe('pages-updated', this.triggerReload);
      inernalModuleContext.topics.subscribe('components-updated', this.triggerReload);
      inernalModuleContext.topics.subscribe('system-settings-updated', this.triggerReload);
    }
  }

  private async loadPages() {
    const pages = await apiClient.getWebPages();
    return this.setState({ pages });
  }

  private triggerReload() {
    console.log('triggerReload', arguments);
    window.clearTimeout(this.reloadTimer);
    this.reloadTimer = window.setTimeout(this.reload, this.reloadWait);
  }

  private reload() {
    apiClient.getWebPages.clearCache();
    apiClient.getWebComponentOptions.clearCache();
    this.loadPages();
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
              (<Route key={item.path} path={item.path} exact={true} component={this.renderPage(item.webComponentId, item.style)} />)
            )}
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      );
    }

    return <section className="App">{content}</section>;
  }
}
