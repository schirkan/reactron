import { IReactronComponentDefinition, IInputComponentProps } from "@schirkan/reactron-interfaces";
import CarouselLayout from "./CarouselLayout";

export const carouselLayoutDefinition: IReactronComponentDefinition = {
  component: CarouselLayout,
  description: 'Carousel Layout',
  displayName: 'Carousel Layout',
  name: 'CarouselLayout',
  type: 'layout',
  fields: [
    { displayName: 'Interval', name: 'interval', valueType: 'number', defaultValue: 5000, minValue: 1000, stepSize: 1 },
    { displayName: 'Transition Time', name: 'transitionTime', valueType: 'number', defaultValue: undefined },
    { displayName: 'Show Arrows', name: 'showArrows', valueType: 'boolean', defaultValue: false },
    { displayName: 'Show Status', name: 'showStatus', valueType: 'boolean', defaultValue: false },
    { displayName: 'Show Indicators', name: 'showIndicators', valueType: 'boolean', defaultValue: false },
    { displayName: 'Center Mode', name: 'centerMode', valueType: 'boolean', defaultValue: false },
    { displayName: 'Center Slide Percentage', name: 'centerSlidePercentage', valueType: 'number', defaultValue: 20 },
    { displayName: 'Axis', name: 'axis', valueType: 'boolean', defaultValue: 'horizontal', values: [{ value: 'horizontal', text: 'horizontal' }, { value: 'vertical', text: 'vertical' }] },
    { displayName: 'Content', name: 'items', valueType: 'webComponent', isArray: true },
    { displayName: 'Carousel Style', name: 'carouselStyle', valueType: 'style' },
  ]
};