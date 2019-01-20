import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import RoundButton from '../RoundButton/RoundButton';
import { IPageNotFoundProps } from './IPageNotFoundProps';

import './PageNotFound.scss'

export default class PageNotFound extends React.Component<IPageNotFoundProps> {
  public render() {
    return (
      <div className="PageNotFound">
        <h1><FontAwesome.FontAwesomeIcon icon={SvgIcons.faQuestionCircle} /> 404</h1>
        <h2>No page defined for path: {this.props.location.pathname}</h2>
        <RoundButton to="/admin">
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faCog} /> Admin
        </RoundButton>
        <RoundButton to="/">
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faHome} /> Home
        </RoundButton>
      </div >
    );
  }
}