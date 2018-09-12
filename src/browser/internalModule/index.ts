import { IComponentDefinition } from "../../interfaces/IComponentDefinition";
import CarouselLayout from "./CarouselLayout/CarouselLayout";
import Empty from "./Empty/Empty";
import GridLayout from "./GridLayout/GridLayout";
import IFrame from "./IFrame/IFrame";
import ListLayout from "./ListLayout/ListLayout";
import Welcome from "./Welcome/Welcome";

export const components: IComponentDefinition[] = [{
    component: ListLayout,
    description: 'List Layout',
    displayName: 'List Layout',
    name: 'ListLayout',
    options: [
        { displayName: 'List Style', name: 'listStyle', valueType: 'style' },
        { displayName: 'Item Style', name: 'itemStyle', valueType: 'style' },
        {
            displayName: 'List items',
            name: 'items',
            valueType: 'object',
            isArray: true,
            fields: [
                { displayName: 'Content', name: 'content', valueType: 'webComponent' },
                { displayName: 'Style', name: 'style', valueType: 'style' }
            ]
        }
    ]
}, {
    component: GridLayout,
    description: 'Grid Layout',
    displayName: 'Grid Layout',
    name: 'GridLayout',
    options: [
        { displayName: 'Rows', name: 'rows', valueType: 'number' },
        { displayName: 'Columns', name: 'cols', valueType: 'number' },
        { displayName: 'Grid Style', name: 'gridStyle', valueType: 'style' },
        { displayName: 'Tile Style', name: 'tileStyle', valueType: 'style' },
        {
            displayName: 'Grid tiles',
            name: 'tiles',
            valueType: 'object',
            isArray: true,
            fields: [
                { displayName: 'Row', name: 'row', valueType: 'number' },
                { displayName: 'Column', name: 'col', valueType: 'number' },
                { displayName: 'Row span', name: 'rowspan', valueType: 'number' },
                { displayName: 'Column span', name: 'colspan', valueType: 'number' },
                { displayName: 'Content', name: 'content', valueType: 'webComponent' },
                { displayName: 'Style', name: 'style', valueType: 'style' }
            ]
        }
    ]
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
}, {
    component: Empty,
    description: 'Empty Placeholder',
    displayName: 'Empty',
    name: 'Empty',
    options: []
}, {
    component: IFrame,
    description: 'IFrame Component',
    displayName: 'IFrame',
    name: 'IFrame',
    options: [
        { displayName: 'URL', name: 'url', valueType: 'string' }
    ]
}];