import * as React from 'react';
import { BackendService } from '../server/BackendService';
// import { IObjectDefinition } from './IObjectDefinition';

export interface IDynamicReactComponentClass extends React.ComponentClass<{ backendService: BackendService, options: any }> {
    // definition: IObjectDefinition;
}