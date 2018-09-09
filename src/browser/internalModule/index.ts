import { IComponentDefinition } from "../../interfaces/IComponentDefinition";
import CarouselLayout from "./CarouselLayout/CarouselLayout";
import GridLayout from "./GridLayout/GridLayout";
import ListLayout from "./ListLayout/ListLayout";
import Welcome from "./Welcome/Welcome";

export const components: IComponentDefinition[] = [{
    component: ListLayout,
    description: 'List Layout',
    displayName: 'List Layout',
    name: 'ListLayout',
    options: [{
        displayName: 'List items',
        name: 'items',
        valueType: 'array',
        itemDefinition: [{
            displayName: 'Content',
            name: 'content',
            valueType: 'webComponent'
        }, {
            displayName: 'Style',
            name: 'style',
            valueType: 'style'
        }]
    }]
}, {
    component: GridLayout,
    description: 'Grid Layout',
    displayName: 'Grid Layout',
    name: 'GridLayout',
    options: []
}, {
    component: CarouselLayout,
    description: 'Carousel Layout',
    displayName: 'Carousel Layout',
    name: 'CarouselLayout',
    options: []
}, {
    component: Welcome,
    description: 'Welcome Component',
    displayName: 'Welcome',
    name: 'Welcome',
    options: []
}];