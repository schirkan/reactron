type IOptionDefinitionValueType = 'array' | 'object' | 'number' | 'boolean' | 'string' | 'style' | 'webComponent';

export interface IOptionDefinitionValue {
    value: any;
    text: string;
}

export interface IOptionDefinition {
    name: string;
    displayName: string;
    description?: string;
    valueType: IOptionDefinitionValueType;
    defaultValue?: number | boolean | string;
    minValue?: number;
    maxValue?: number;
    stepSize?: number;
    values?: IOptionDefinitionValue[];
    itemDefinition?: IOptionDefinition[];
}

export interface IObjectDefinition {
    name: string;
    displayName: string;
    description?: string;
    options: IOptionDefinition[];
}