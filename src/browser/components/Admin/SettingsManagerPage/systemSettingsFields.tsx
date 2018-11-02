import { IFieldDefinition } from 'src/interfaces/IObjectDefinition';

export const systemSettingsFields: IFieldDefinition[] = [{
  description: 'Language',
  displayName: 'Language',
  name: 'lang',
  valueType: 'string',
  values: [
    { value: 'de-DE', text: 'German' },
    { value: 'en-GB', text: 'English' },
    { value: 'fr-FR', text: 'French' },
  ]
}, {
  description: 'Location',
  displayName: 'Location',
  name: 'location',
  valueType: 'string'
}, {
  description: 'Timezone',
  displayName: 'Timezone',
  name: 'timezone',
  valueType: 'string',
  values: [
    { value: 'Europe/Berlin', text: 'Europe/Berlin' },
    { value: 'Europe/London', text: 'Europe/London' },
    { value: 'Asia/Tokyo', text: 'Asia/Tokyo' },
    { value: 'America/New_York', text: 'America/New York' },
  ]
}, {
  description: 'Path of page to show on startup',
  displayName: 'Startup Path',
  name: 'startupPath',
  valueType: 'string'
}, {
  description: 'Sample Checkbox',
  displayName: 'Checkbox',
  name: 'cb1',
  valueType: 'boolean'
}, {
  description: 'Sample Object',
  displayName: 'Object',
  fields: [
    {
      description: 'Sample Text',
      displayName: 'Text',
      name: 'stringValue',
      valueType: 'string'
    },
    {
      description: 'Sample Number',
      displayName: 'Number',
      minValue: 0,
      maxValue: 50,
      stepSize: 5,
      name: 'numericValue',
      valueType: 'number'
    },
    {
      description: 'Sample Checkbox',
      displayName: 'Checkbox',
      name: 'booleanValue',
      valueType: 'boolean'
    }, {
      description: 'Sample DropDown',
      displayName: 'DropDown',
      name: 'value',
      valueType: 'string',
      values: [
        { value: '111', text: '1st Item' },
        { value: '222', text: '2nd Item' },
        { value: '333', text: '3rd Item' },
      ]
    }
  ],
  name: 'obj1',
  valueType: 'object'
}, {
  description: 'Sample Array',
  displayName: 'Array',
  isArray: true,
  name: 'arr1',
  valueType: 'string'
}];