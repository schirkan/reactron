import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';

export default class ComponentNotFound extends React.Component<{ componentName?: string, moduleName?: string }> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <section className="ComponentNotFound">
        <FontAwesome.FontAwesomeIcon icon={SvgIcons.faExclamationTriangle} size="4x" />
        <div className="text">Component not found: {this.props.moduleName}/{this.props.componentName}</div>
      </section>
    );
  }
}