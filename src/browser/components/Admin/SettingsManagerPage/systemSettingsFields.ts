import { IFieldDefinition } from '@schirkan/reactron-interfaces';

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
}];