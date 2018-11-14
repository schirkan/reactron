import { IReactronComponentProps } from '@schirkan/reactron-interfaces';
import * as React from 'react';

import './CarouselLayout.css';

export default class CarouselLayout extends React.Component<IReactronComponentProps, any> {
  constructor(props: IReactronComponentProps) {
    super(props);
  }

  public render() {
    return <section className="CarouselLayout">CarouselLayout</section>;
  }
}
