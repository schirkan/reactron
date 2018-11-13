declare type IOptionDefinitionValueType = 'object' | 'number' | 'boolean' | 'string' | 'style' | 'webComponent';
export interface IOptionDefinitionValue {
    value: any;
    text: string;
}
export interface IFieldDefinition {
    name: string;
    displayName: string;
    description?: string;
    valueType: IOptionDefinitionValueType;
    defaultValue?: any;
    minValue?: number;
    maxValue?: number;
    stepSize?: number;
    values?: IOptionDefinitionValue[];
    fields?: IFieldDefinition[];
    isArray?: boolean;
    textRows?: number;
}
export interface IObjectDefinition {
    name: string;
    displayName: string;
    description?: string;
    fields?: IFieldDefinition[];
}
export {};
