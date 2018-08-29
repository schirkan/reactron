import * as React from 'react';

export interface IModuleInstance {
  name: string;
  author: string;
  browserFile: string;
  serverFile: string;
  components: { [key: string]: React.ComponentType<any> };
  services: { [key: string]: object };
}
