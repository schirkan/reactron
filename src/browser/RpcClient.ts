import { apiClient } from "./ApiClient";

export const createRemoteService = <TService>(serviceName: string, moduleName: string): TService => {
  const proxy = new Proxy({}, {
    get: (target, prop: string) => {
      return async (...args: any[]) => {
        const response = await apiClient.callServiceMethod(undefined, { serviceName, moduleName, methodName: prop, args });
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