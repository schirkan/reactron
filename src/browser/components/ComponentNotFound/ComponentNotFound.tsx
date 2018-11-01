import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';
import { IComponentNotFoundProps } from './IComponentNotFoundProps';

import './ComponentNotFound.css';

export default class ComponentNotFound extends React.Component<IComponentNotFoundProps> {
  public static defaultProps: Partial<IComponentNotFoundProps> = {
    iconSize: "4x"
  };

  public render() {
    const text = [];
    if (this.props.id) {
      text.push('Id: ' + this.props.id);
    }
    if (this.props.componentName) {
      text.push('Component: ' + this.props.componentName);
    }
    if (this.props.moduleName) {
      text.push('Module: ' + this.props.moduleName);
    }

    return (
      <section className="ComponentNotFound">
        <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationTriangle} size={this.props.iconSize} />
        <div className="text">Component not found: {text.join(' | ')}</div>
        <RoundButton to="/admin">
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faCog} /> Admin
        </RoundButton>
      </section>
    );
  }
}