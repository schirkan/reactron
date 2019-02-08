import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IReactronComponentContext, ILogWriter, IWebComponentOptions } from '@schirkan/reactron-interfaces';
import React from 'react';
import { BrowserModuleContext } from "./BrowserModuleContext";
import { componentLoader } from './ComponentLoader';
import Loading from "./components/Loading/Loading";
import WebComponent, { IWebComponentProps } from "./components/WebComponent/WebComponent";
import { LogWriter } from '../common/LogWriter';

export class WebComponentContext extends BrowserModuleContext implements IReactronComponentContext {
  public readonly renderLoading: (text?: string, iconSize?: SizeProp, style?: React.CSSProperties) => any;
  public readonly renderComponent: (props: IWebComponentProps) => any;
  public readonly componentLoader = componentLoader;
  public readonly log: ILogWriter;
  public readonly componentName: string;

  constructor(props: IWebComponentOptions) {
    super(props.moduleName);

    const logSource = props.id || (props.moduleName + '.' + props.componentName);
    this.log = new LogWriter(this.topics, logSource);
    this.componentName = props.componentName;

    this.renderComponent = (props: IWebComponentProps) => {
      const key = props.id + '.' + props.moduleName + '.' + props.componentName;
      return <WebComponent {...props} key={key} />;
    };

    this.renderLoading = (text?: string, iconSize?: SizeProp, style?: React.CSSProperties) => {
      return <Loading text={text} iconSize={iconSize} style={style} />;
    };
  }
}

export const WebComponentContextType = React.createContext<IReactronComponentContext>(new WebComponentContext({ moduleName: '', parentId: '', componentName: '', id: '' }));