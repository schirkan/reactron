import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { IComponentNotFoundProps } from './IComponentNotFoundProps';

import './ComponentNotFound.css';

export default class ComponentNotFound extends React.Component<IComponentNotFoundProps> {
  public static defaultProps: Partial<IComponentNotFoundProps> = {
    iconSize: "4x"
  };

  public render() {
    const text = [];
    if (this.props.id) {
      text.push (<span>Id: {this.props.id}</span>);
    }
    if (this.props.componentName) {
      text.push (<span>Component: {this.props.componentName}</span>);
    }
    if (this.props.moduleName) {
      text.push (<span>Module: {this.props.moduleName}</span>);
    }

    return (
      <section className="ComponentNotFound">
        <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationTriangle} size={this.props.iconSize} />
        <div className="text">Component not found: {text}</div>
      </section>
    );
  }
}