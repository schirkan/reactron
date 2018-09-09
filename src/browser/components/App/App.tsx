import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { IWebPageOptions } from '../../../interfaces/IWebPageOptions';
import { instance as clientRepository } from '../../ClientRepository';
import Admin from '../Admin/Admin';
import Loading from '../Loading/Loading';
import NotFound from '../NotFound/NotFound';
import WebComponent from '../WebComponent/WebComponent';

import './App.css';

interface IAppState {
  pages?: IWebPageOptions[];
}

export default class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    clientRepository.getWebPages().then(pages => this.setState({ pages }));

    // TODO: register page/component change event
  }

  public getWebCmponent(id: string) {
    return () => <WebComponent id={id} />;
  }

  public render() {
    let content = <Loading text="Loading Reactron..." />;

    if (this.state.pages) {
      content = (
        <Router>
          <Switch>
            <Route path="/admin" component={Admin} />
            {this.state.pages.map(item =>
              (<Route key={item.path} path={item.path} exact={true} component={this.getWebCmponent(item.webComponentId)} />)
            )}
            <Route component={NotFound} />
          </Switch>
        </Router>
      );
    }

    return <section className="App">{content}</section>;
  }
}
