import { IReactronComponentDefinition } from "@schirkan/reactron-interfaces";
import GridLayout from "./GridLayout";

export const gridLayoutDefinition: IReactronComponentDefinition = {
  component: GridLayout,
  description: 'Grid Layout',
  displayName: 'Grid Layout',
  name: 'GridLayout',
  type: 'layout',
  fields: [
    { displayName: 'Grid Style', name: 'gridStyle', valueType: 'style' },
    { displayName: 'Tile Style', name: 'tileStyle', valueType: 'style' },
    {
      displayName: 'Grid tiles',
      name: 'tiles',
      valueType: 'object',
      isArray: true,
      fields: [
        { displayName: 'Row', name: 'row', valueType: 'number', minValue: 1, defaultValue: 1 },
        { displayName: 'Column', name: 'col', valueType: 'number', minValue: 1, defaultValue: 1 },
        { displayName: 'Row span', name: 'rowspan', valueType: 'number', minValue: 1, defaultValue: 1 },
        { displayName: 'Column span', name: 'colspan', valueType: 'number', minValue: 1, defaultValue: 1 },
        { displayName: 'Content', name: 'content', valueType: 'webComponent' },
        { displayName: 'Style', name: 'style', valueType: 'style' }
      ]
    }
  ]
};