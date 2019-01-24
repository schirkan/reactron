import { BrowserModuleContext } from "./BrowserModuleContext";
import { routes, ICallServiceMethodRequest, ICallServiceMethodResponse } from "../common/apiRoutes";

const callServiceMethod = async (data: ICallServiceMethodRequest): Promise<ICallServiceMethodResponse> => {
  const route = routes.callServiceMethod;
  const method = route.method.toLocaleLowerCase();
  const url = BrowserModuleContext.inernalModuleContext.moduleApiPath + route.path;

  const options: RequestInit = {
    method,
    body: data && JSON.stringify(data),
    headers: { "Content-Type": "application/json; charset=utf-8", }
  };

  const response = await fetch(url, options);
  const text = await response.text();
  if (response.status.toString().startsWith('2')) {
    return text ? JSON.parse(text) : undefined;
  }
  console.log(text);
  throw Error(text);
};

export const createRemoteService = <TService>(serviceName: string, moduleName: string): TService => {
  const proxy = new Proxy({}, {
    get: (target, prop: string) => {
      if (prop === 'then') {
        return null; // I'm not a Thenable
      }

      return async (...args: any[]) => {
        const response = await callServiceMethod({ serviceName, moduleName, methodName: prop, args });
        console.log('get ' + moduleName + '.' + serviceName + '.' + prop, { args, response });
        if (response.error) {
          throw new Error(response.error);
        }
        return response.result;
      }
    }
  });
  return proxy as TService;
}