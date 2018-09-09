import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';

import './Loading.css';

export default class Loading extends React.Component<{ text?: string }> {
  public render() {
    return (
      <section className="Loading">
        <FontAwesome.FontAwesomeIcon icon={SvgIcons.faSpinner} spin={true} />
        <div>{this.props.text}</div>
      </section>
    );
  }
}
