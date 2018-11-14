import { IReactronComponentProps } from '@schirkan/reactron-interfaces';
import * as React from 'react';

import './Notifications.css';

export default class Notifications extends React.Component<IReactronComponentProps, any> {
  constructor(props: IReactronComponentProps) {
    super(props);
  }

  public render() {
    return <section className="Notifications">Notifications</section>;
  }
}
