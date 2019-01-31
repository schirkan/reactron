import { IReactronComponentDefinition, IInputComponentProps } from "@schirkan/reactron-interfaces";
import ListLayout from "./ListLayout";
import { IListLayoutItemOptions } from "./IListLayoutItemOptions";

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
      inputControl: (props: IInputComponentProps<IListLayoutItemOptions>) => {
        const item = props.value || {};
        const definition = props.getComponentDefinition(item.content);
        return definition && definition.displayName || null;
      }
    }
  ]
};