import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';
import { IComponentNotFoundProps } from './IComponentNotFoundProps';

import './ComponentNotFound.scss';

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
        <div className="header">
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationTriangle} size={this.props.iconSize} />
          <h4>Component not found!</h4>
        </div>
        <ul>{text.map(x => <li>{x}</li>)}</ul>
        <RoundButton to="/admin">
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faCog} /> Admin
        </RoundButton>
      </section>
    );
  }
}