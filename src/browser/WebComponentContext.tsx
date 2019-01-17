import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IReactronComponentContext, ILogWriter } from '@schirkan/reactron-interfaces';
import React from 'react';
import { BrowserModuleContext } from "./BrowserModuleContext";
import { componentLoader } from './ComponentLoader';
import Loading from "./components/Loading/Loading";
import WebComponent, { IWebComponentProps } from "./components/WebComponent/WebComponent";
import { LogWriter } from '../common/LogWriter';

export class WebComponentContext extends BrowserModuleContext implements IReactronComponentContext {
  public renderLoading: (text?: string, iconSize?: SizeProp) => any;
  public renderComponent: (props: IWebComponentProps) => any;
  public readonly componentLoader = componentLoader;
  public readonly log: ILogWriter;

  constructor(moduleName: string, public readonly componentName: string) {
    super(moduleName);

    this.renderComponent = (props: IWebComponentProps) => {
      const key = props.id + '.' + props.moduleName + '.' + props.componentName;
      return <WebComponent {...props} key={key} />;
    };

    this.renderLoading = (text?: string, iconSize?: SizeProp) => {
      return <Loading text={text} iconSize={iconSize} />;
    };

    this.log = new LogWriter(this.backendService && this.backendService.topics, moduleName + '.' + componentName);
  }
}

export const WebComponentContextType = React.createContext<IReactronComponentContext>(new WebComponentContext('', ''));