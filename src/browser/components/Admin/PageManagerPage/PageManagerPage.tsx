import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IWebPageOptions } from '../../../../interfaces/IWebPageOptions';
import { apiClient } from '../../../ApiClient';
import Loading from '../../Loading/Loading';
import OptionCard from '../OptionCard/OptionCard';
import UiButton from '../UiButton/UiButton';
import UiCard from '../UiCard/UiCard';
import UiFlowLayout from '../UiFlowLayout/UiFlowLayout';
import UiLoadingCard from '../UiLoadingCard/UiLoadingCard';
import UiOverlay from '../UiOverlay/UiOverlay';
import PageCard from './PageCard/PageCard';
import { pageOptionsFields } from './pageOptionsFields';

import './PageManagerPage.css';

export interface IModuleManagerPageState {
  loading: boolean;
  pages: IWebPageOptions[];
  showPageDetailsDialog: boolean;
  selectedPage?: IWebPageOptions;
}

export default class PageManagerPage extends React.Component<any, IModuleManagerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: true,
      pages: [],
      showPageDetailsDialog: false
    };

    this.loadPages = this.loadPages.bind(this);
    this.savePage = this.savePage.bind(this);
    this.hidePageDetailsDialog = this.hidePageDetailsDialog.bind(this);
    this.showPageDetailsDialog = this.showPageDetailsDialog.bind(this);
    this.confirmPageDeletion = this.confirmPageDeletion.bind(this);
  }

  public componentDidMount() {
    this.loadPages();
  }

  private loadPages(): Promise<void> {
    this.setState({ loading: true });

    return apiClient.getWebPages()
      .then(pages => this.setState({ pages, loading: false }))
      .catch(err => this.setState({ loading: false })); // TODO
  }

  private savePage(page: IWebPageOptions): Promise<void> {
    return apiClient.setWebPage(undefined, page)
      .then(this.hidePageDetailsDialog)
      .then(apiClient.getWebPages.clearCache)
      .then(this.loadPages)
      .catch(err => console.log(err)); // TODO
  }

  private deletePage(page: IWebPageOptions): Promise<void> {
    return apiClient.deleteWebPage(page)
      .then(this.hidePageDetailsDialog)
      .then(apiClient.getWebPages.clearCache)
      .then(this.loadPages)
      .catch(err => console.log(err)); // TODO
  }

  private showPageDetailsDialog(page?: IWebPageOptions) {
    this.setState({ showPageDetailsDialog: true, selectedPage: page });
  }

  private hidePageDetailsDialog() {
    this.setState({ showPageDetailsDialog: false, selectedPage: undefined });
  }

  private confirmPageDeletion(page: IWebPageOptions) {
    if (window.confirm("Delete?")) {
      this.deletePage(page);
    }
  }

  private renderPageCards() {
    if (this.state.loading) {
      return <UiFlowLayout><UiLoadingCard /></UiFlowLayout>;
    }

    return (
      <UiFlowLayout>
        {this.state.pages.map((item, index) =>
          <PageCard key={index} page={item} onEdit={this.showPageDetailsDialog}
            onDelete={this.confirmPageDeletion} />
        )}
      </UiFlowLayout>
    );
  }

  private renderPageAddCard() {
    return (
      <UiFlowLayout>
        <UiCard className="AddPageCard">
          <UiButton className="addButton" onClick={this.showPageDetailsDialog}>
            <FontAwesomeIcon icon={SolidIcons.faPlus} /> Add Page
          </UiButton>
        </UiCard>
      </UiFlowLayout>
    );
  }

  private renderPageDetailsDialog() {
    if (!this.state.showPageDetailsDialog) {
      return null;
    }

    const page = this.state.selectedPage;
    const title = page ? 'Edit Page' : 'Add Page';

    return (
      <UiOverlay>
        <OptionCard icon={SolidIcons.faCogs}
          title={title} fields={pageOptionsFields}
          onSave={this.savePage} onCancel={this.hidePageDetailsDialog} options={page || {}}
        />
      </UiOverlay>
    );
  }

  public render() {
    return (
      <section className="PageManagerPage">
        {/* {this.state.loading && (
          <UiOverlay><Loading center={true} /></UiOverlay>
        )} */}
        {this.renderPageAddCard()}
        {this.renderPageCards()}
        {this.renderPageDetailsDialog()}
      </section>
    );
  }
}
