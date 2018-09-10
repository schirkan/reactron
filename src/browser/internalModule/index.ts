import { IComponentDefinition } from "../../interfaces/IComponentDefinition";
import CarouselLayout from "./CarouselLayout/CarouselLayout";
import GridLayout from "./GridLayout/GridLayout";
import ListLayout from "./ListLayout/ListLayout";
import WebPage from "./WebPage/WebPage";
import Welcome from "./Welcome/Welcome";

export const components: IComponentDefinition[] = [{
    component: ListLayout,
    description: 'List Layout',
    displayName: 'List Layout',
    name: 'ListLayout',
    fields: [{
        displayName: 'List items',
        name: 'items',
        valueType: 'object',
        isArray: true,
        fields: [{
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
    fields: []
}, {
    component: CarouselLayout,
    description: 'Carousel Layout',
    displayName: 'Carousel Layout',
    name: 'CarouselLayout',
    fields: []
}, {
    component: Welcome,
    description: 'Welcome Component',
    displayName: 'Welcome',
    name: 'Welcome',
    fields: []
}, {
    component: WebPage,
    description: 'WebPage Component',
    displayName: 'WebPage',
    name: 'WebPage',
    fields: [{
        displayName: 'URL',
        name: 'url',
        valueType: 'string'
    }]
}];