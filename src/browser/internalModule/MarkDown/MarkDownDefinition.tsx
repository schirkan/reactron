import { IReactronComponentDefinition } from "@schirkan/reactron-interfaces";
import MarkDown from "./MarkDown";

export const markDownDefinition: IReactronComponentDefinition = {
  component: MarkDown,
  description: 'MarkDown Component',
  displayName: 'MarkDown',
  name: 'MarkDown',
  fields: [
    { displayName: 'Text', name: 'text', valueType: 'string', textRows: 10 },
    { displayName: 'Style', name: 'style', valueType: 'style' }
  ]
};