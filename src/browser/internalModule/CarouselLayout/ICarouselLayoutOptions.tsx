import { CarouselProps } from "react-responsive-carousel";

export interface ICarouselLayoutOptions {
  style: React.CSSProperties;
  options: CarouselProps;
  items: string[];
}