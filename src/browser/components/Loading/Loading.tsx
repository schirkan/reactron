import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ILoadingProps } from './ILoadingProps';

import './Loading.css';

export default class Loading extends React.Component<ILoadingProps> {
  public static defaultProps: Partial<ILoadingProps> = {
    iconSize: "4x"
  };

  public render() {
    return (
      <section className="Loading">
        <FontAwesome.FontAwesomeIcon icon={SvgIcons.faSpinner} size={this.props.iconSize} spin={true} />
        <div className="text">{this.props.text}</div>
      </section>
    );
  }
}
