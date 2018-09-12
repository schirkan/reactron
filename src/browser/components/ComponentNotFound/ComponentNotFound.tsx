import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';

import './ComponentNotFound.css';

interface IComponentNotFoundProps {
  componentName?: string;
  moduleName?: string
  iconSize?: SizeProp;
}

export default class ComponentNotFound extends React.Component<IComponentNotFoundProps> {
  public static defaultProps: Partial<IComponentNotFoundProps> = {
    iconSize: "4x"
  };

  public render() {
    return (
      <section className="ComponentNotFound">
        <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationTriangle} size={this.props.iconSize} />
        <div className="text">Component not found: {this.props.moduleName}/{this.props.componentName}</div>
      </section>
    );
  }
}