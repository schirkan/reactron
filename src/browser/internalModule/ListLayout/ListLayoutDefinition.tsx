import { IReactronComponentDefinition } from "@schirkan/reactron-interfaces";
import ListLayout from "./ListLayout";

export const listLayoutDefinition: IReactronComponentDefinition = {
  component: ListLayout,
  description: 'List Layout',
  displayName: 'List Layout',
  name: 'ListLayout',
  type: 'layout',
  fields: [
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
      ],
      inputControl: { module: 'reactron', component: 'ListLayoutItemHeader' }
    }
  ]
};