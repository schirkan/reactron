import * as React from 'react';
import { apiClient } from 'src/browser/ApiClient';
import Loading from 'src/browser/components/Loading/Loading';
import { IWebComponentOptions } from 'src/interfaces/IWebComponentOptions';

import './SelectWebComponent.css';

interface ISelectWebComponentProps {
  webComponentId: string;
  onChange: (webComponentId: string) => any;
}

interface ISelectWebComponentState {
  loading: boolean
  webComponents: IWebComponentOptions[];
  selectedWebComponent?: IWebComponentOptions;
}

export default class SelectWebComponent extends React.Component<ISelectWebComponentProps, ISelectWebComponentState> {
  constructor(props: ISelectWebComponentProps) {
    super(props);

    this.state = {
      loading: true,
      webComponents: [],
    };

    this.onSelectValueChange = this.onSelectValueChange.bind(this);
  }

  public componentDidMount() {
    this.loadComponents();
  }

  private loadComponents() {
    return apiClient.getWebComponentOptions()
      .then(webComponents => this.setState({ webComponents, loading: false }))
      .catch(err => console.log(err)); // TODO
  }


  private onSelectValueChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onChange(e.currentTarget.value);
  }

  public renderContent() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <select value={this.props.webComponentId} onChange={this.onSelectValueChange}>
        {this.state.webComponents.map((item, index) =>
          <option key={index} value={item.id}>{item.componentName} ({item.id})</option>
        )}
      </select>
    );
  }

  public render() {
    return (
      <div className="SelectWebComponent">
        {this.renderContent()}
      </div>
    );
  }
}
