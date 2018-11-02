import { IFieldDefinition } from '../interfaces/IObjectDefinition';

export const getDefaultFieldValue = (field: IFieldDefinition) => {
  const defaultValue = field.defaultValue;

  if (field.isArray) {
    if (defaultValue && Array.isArray(defaultValue)) {
      return defaultValue;
    }
    return [];
  }

  switch (field.valueType) {
    case 'object':
      let result: any = defaultValue;

      if (result === undefined) {
        result = {};
        if (field.fields) {
          field.fields.forEach(f => {
            result[f.name] = getDefaultFieldValue(f);
          });
        }
      }

      return result;
    case 'number':
      return defaultValue || 0;
    case 'boolean':
      return defaultValue || false;
    case 'string':
      return defaultValue || '';
    case 'style':
      return defaultValue || {};
    case 'webComponent':
      return undefined;
  }
  return undefined;
};