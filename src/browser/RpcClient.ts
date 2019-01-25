import { BrowserModuleContext } from "./BrowserModuleContext";
import { rpcPath, IRpcRequest, IRpcResponse } from "../common/rpc";

const callServiceMethod = async (data: IRpcRequest): Promise<IRpcResponse> => {
  const id = data.moduleName + '.' + data.serviceName + '.' + data.methodName;
  const urlId = id.replace('/', '@');
  const url = BrowserModuleContext.inernalModuleContext.moduleApiPath + rpcPath + '/' + urlId;
  const options: RequestInit = {
    method: 'POST',
    body: data && JSON.stringify(data),
    headers: { "Content-Type": "application/json; charset=utf-8", }
  };

  let result: IRpcResponse | undefined = undefined;
  let error: any;

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    if (response.status.toString().startsWith('2')) {
      result = text ? JSON.parse(text) : undefined;
      if (result && result.error) {
        throw new Error(result.error);
      }
      return result && result.result;
    } else {
      console.log(text);
      throw Error(text);
    }
  } catch (err) {
    error = err;
    throw err;
  } finally {
    if (error) {
      console.error('RPC ' + id, { args: data.args, result, error: error && error.message || error });
    } else {
      console.log('RPC ' + id, { args: data.args, result });
    }
  }
};

export const createRemoteService = <TService>(serviceName: string, moduleName: string): TService => {
  const proxy = new Proxy({}, {
    get: (target, prop: string) => {
      if (prop === 'then') {
        return null; // I'm not a Thenable
      }
      return (...args: any[]) => callServiceMethod({ serviceName, moduleName, methodName: prop, args });
    }
  });
  return proxy as TService;
}