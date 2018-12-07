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
        { displayName: 'Row', name: 'row', valueType: 'number', defaultValue: 1, stepSize: 1, minValue: 1, maxValue: 20 },
        { displayName: 'Column', name: 'col', valueType: 'number', defaultValue: 1, stepSize: 1, minValue: 1, maxValue: 20 },
        { displayName: 'Row span', name: 'rowspan', valueType: 'number', defaultValue: 1, stepSize: 1, minValue: 1, maxValue: 20 },
        { displayName: 'Column span', name: 'colspan', valueType: 'number', defaultValue: 1, stepSize: 1, minValue: 1, maxValue: 20 },
        { displayName: 'Content', name: 'content', valueType: 'webComponent' },
        { displayName: 'Style', name: 'style', valueType: 'style' }
      ],
      inputControl: { module: 'reactron', component: 'GridLayoutTileHeader' }
    }
  ]
};