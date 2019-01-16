import { IReactronComponentDefinition, IInputComponentProps } from "@schirkan/reactron-interfaces";
import ListLayout from "./ListLayout";
import * as React from 'react';
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
        const style = { width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' };
        return (<div style={style}>[ {item.content} ]</div>);
      }
    }
  ]
};