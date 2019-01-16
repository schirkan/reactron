import * as React from 'react';
import { IReactronComponentDefinition, IInputComponentProps } from "@schirkan/reactron-interfaces";
import CarouselLayout from "./CarouselLayout";
import { CarouselProps } from 'react-responsive-carousel';

export const carouselLayoutDefinition: IReactronComponentDefinition = {
  component: CarouselLayout,
  description: 'Carousel Layout',
  displayName: 'Carousel Layout',
  name: 'CarouselLayout',
  type: 'layout',
  fields: [
    {
      displayName: 'Options', name: 'options', valueType: 'object', fields: [
        { displayName: 'Interval in ms', name: 'interval', valueType: 'number', defaultValue: 5000, minValue: 1000, stepSize: 50 },
        { displayName: 'Transition Time in ms', name: 'transitionTime', valueType: 'number', defaultValue: 500, minValue: 100, stepSize: 50 },
        { displayName: 'Show Indicators', name: 'showIndicators', valueType: 'boolean', defaultValue: true },
        { displayName: 'Show Arrows', name: 'showArrows', valueType: 'boolean', defaultValue: false },
        { displayName: 'Show Status', name: 'showStatus', valueType: 'boolean', defaultValue: false },
        { displayName: 'Center Mode', name: 'centerMode', valueType: 'boolean', defaultValue: false },
        { displayName: 'Center Slide Percentage', name: 'centerSlidePercentage', valueType: 'number', defaultValue: 70, minValue: 1, maxValue: 100, stepSize: 1 },
        { displayName: 'Axis', name: 'axis', valueType: 'boolean', defaultValue: 'horizontal', values: [{ value: 'horizontal', text: 'horizontal' }, { value: 'vertical', text: 'vertical' }] },
      ],
      inputControl: (props: IInputComponentProps<CarouselProps>) => {
        const interval = props.value && props.value.interval;
        return <span>interval {interval} ms</span>;
      }
    },
    { displayName: 'Content', name: 'items', valueType: 'webComponent', isArray: true },
    { displayName: 'Carousel Style', name: 'style', valueType: 'style' },
  ]
};