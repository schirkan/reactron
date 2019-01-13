import { CarouselProps } from "react-responsive-carousel";

export interface ICarouselLayoutOptions extends CarouselProps {
  carouselStyle: React.CSSProperties;
  items: string[];
}