import { IReactronComponentDefinition } from "@schirkan/reactron-interfaces";
import IFrame from "./IFrame";

export const iFrameDefinition: IReactronComponentDefinition = {
    component: IFrame,
    description: 'IFrame Component',
    displayName: 'IFrame',
    name: 'IFrame',
    fields: [
        { displayName: 'URL', name: 'url', valueType: 'string' }
    ]
};