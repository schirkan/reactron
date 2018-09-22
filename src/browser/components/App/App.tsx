import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { IWebPageOptions } from '../../../interfaces/IWebPageOptions';
import { apiClient } from '../../ApiClient';
import Admin from '../Admin/Admin';
import Loading from '../Loading/Loading';
import PageNotFound from '../PageNotFound/PageNotFound';
import WebComponent from '../WebComponent/WebComponent';

import './App.css';

export interface IAppState {
  pages?: IWebPageOptions[];
}

export default class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    apiClient.getWebPages().then(pages => this.setState({ pages }));

    // TODO: register page/component change event
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
            <Route path="/admin" component={Admin} />
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
