import { IComponentDefinition } from "../../../interfaces/IComponentDefinition";
import MarkDown from "./MarkDown";

export const markDownDefinition: IComponentDefinition = {
  component: MarkDown,
  description: 'MarkDown Component',
  displayName: 'MarkDown',
  name: 'MarkDown',
  options: [
    { displayName: 'Text', name: 'text', valueType: 'string' }
  ]
};