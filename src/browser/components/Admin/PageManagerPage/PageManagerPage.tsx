import * as React from 'react';
import { IWebPageOptions } from '../../../../interfaces/IWebPageOptions';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import UiOverlay from '../UiOverlay/UiOverlay';

import './PageManagerPage.css';

export interface IModuleManagerPageState {
  loading: boolean;
  pages: IWebPageOptions[];
}

export default class PageManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      pages: []
    };

    this.loadPage = this.loadPage.bind(this);
    this.savePage = this.savePage.bind(this);
  }

  public componentDidMount() {
    this.loadPage();
  }

  public loadPage(): Promise<void> {
    return apiClient.getWebPages()
      .then(pages => this.setState({ pages }))
      .catch(); // TODO
  }

  public savePage(page: IWebPageOptions): Promise<void> {
    return apiClient.setWebPage(undefined, page)
      .catch(); // TODO
  }

  public render() {
    return (
      <section className="PageManagerPage">
        {this.state.loading && (
          <UiOverlay><Loading center={true} /></UiOverlay>
        )}
        {this.state.pages && (
          <UiFlowLayout>
            pages
          </UiFlowLayout>
        )}
      </section>
    );
  }
}
