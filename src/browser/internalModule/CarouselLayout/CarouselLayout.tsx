import * as React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { ICarouselLayoutOptions } from './ICarouselLayoutOptions';
import { IReactronComponentContext } from '@schirkan/reactron-interfaces';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import './CarouselLayout.css';

export default class CarouselLayout extends React.Component<ICarouselLayoutOptions> {
  public context!: IReactronComponentContext;

  constructor(props: ICarouselLayoutOptions) {
    super(props);
  }

  public render() {
    return (
      <section className="CarouselLayout" style={this.props.carouselStyle}>
        <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} showArrows={false} showStatus={false} {...this.props}>
          {this.props.items.map(id => (
            <React.Fragment key={id}>{this.context.renderComponent({ id })}</React.Fragment>
          ))}
        </Carousel>
      </section>
    );
  }
}