import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import classname from 'classnames';
import * as React from 'react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

import './Loading.scss';

export interface ILoadingProps {
  text?: string;
  iconSize?: SizeProp;
  center?: boolean;
  style?: React.CSSProperties;
}

export default class Loading extends React.Component<ILoadingProps> {
  public static defaultProps: Partial<ILoadingProps> = {
    iconSize: "4x"
  };

  public render() {
    return (
      <section className={classname('Loading', { 'center': this.props.center })} style={this.props.style}>
        <FontAwesome.FontAwesomeIcon icon={SvgIcons.faSpinner} size={this.props.iconSize} spin={true} />
        {this.props.text && (<div className="text">{this.props.text}</div>)}
      </section>
    );
  }
}
