import * as React from 'react';

export class ExternalModule {
  public name: string;
  public author: string;
  public browserFile: string;
  public serverFile: string;
  public components: { [key: string]: React.ComponentType<any> };
  public services: { [key: string]: object };
}
