import * as React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { ICarouselLayoutOptions } from './ICarouselLayoutOptions';
import { IReactronComponentContext } from '@schirkan/reactron-interfaces';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import './CarouselLayout.css';

export default class CarouselLayout extends React.Component<ICarouselLayoutOptions> {
  public context!: IReactronComponentContext;

  public render() {
    return (
      <section className="CarouselLayout" style={this.props.style}>
        <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} showArrows={false} showStatus={false} {...this.props.options}>
          {this.props.items.map(id => this.context.renderComponent({ id }))}
        </Carousel>
      </section>
    );
  }
}