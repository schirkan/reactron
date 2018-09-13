import { IComponentDefinition } from "../../../interfaces/IComponentDefinition";
import { IDynamicReactComponentProps } from "../../../interfaces/IDynamicReactComponentClass";
import { IWebComponentOptions } from "../../../interfaces/IWebComponentOptions";

export interface IWebComponentState {
    componentFound?: boolean;
    componentProps?: IDynamicReactComponentProps;
    componentDefinition?: IComponentDefinition;
    componentOptions?: IWebComponentOptions;
  }