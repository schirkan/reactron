export class ApiRoute<TParams, TBody, TResponse = void>{
  constructor(public path: string, public method: string) { }
}

export interface ICallServiceMethodRequest {
  moduleName: string;
  serviceName: string;
  methodName: string;
  args: any[];
}

export interface ICallServiceMethodResponse {
  result: any;
  error: string;
}

export const routes = {
  callServiceMethod: new ApiRoute<undefined, ICallServiceMethodRequest, ICallServiceMethodResponse>('/service/rpc', 'post'),
};