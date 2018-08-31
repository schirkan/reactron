import * as React from 'react';

export interface IDynamicReactComponentClassProps{
    backendService: {
        getService: (serviceName: string, moduleName: string | undefined)=>Promise<any>
    };
    options: any;
}

export interface IDynamicReactComponentClass extends React.ComponentClass<IDynamicReactComponentClassProps> {
}