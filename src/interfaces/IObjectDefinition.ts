type IOptionDefinitionValueType = 'number' | 'boolean' | 'string';

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
}

export interface IObjectDefinition {
    name: string;
    displayName: string;
    description?: string;
    options: IOptionDefinition[];
}