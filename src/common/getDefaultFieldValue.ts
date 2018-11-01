import { IFieldDefinition } from '../interfaces/IObjectDefinition';

export const getDefaultFieldValue = (field: IFieldDefinition) => {
  const value = field.defaultValue;
  if (field.isArray) {
    if (value && Array.isArray(value)) {
      return value;
    }
    return [];
  }
  switch (field.valueType) {
    case 'object':
      return value || {};
    case 'number':
      return value || 0;
    case 'boolean':
      return value || false;
    case 'string':
      return value || '';
    case 'style':
      return value || {};
    case 'webComponent':
      return undefined;
  }
  return undefined;
};