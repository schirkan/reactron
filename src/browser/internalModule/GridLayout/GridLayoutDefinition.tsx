import { IComponentDefinition } from "../../../interfaces/IComponentDefinition";
import GridLayout from "./GridLayout";

export const gridLayoutDefinition: IComponentDefinition = {
    component: GridLayout,
    description: 'Grid Layout',
    displayName: 'Grid Layout',
    name: 'GridLayout',
    fields: [
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
};