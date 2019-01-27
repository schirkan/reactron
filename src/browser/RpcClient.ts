import { BrowserModuleContext } from "./BrowserModuleContext";
import { rpcPath, IRpcRequest, IRpcResponse } from "../common/rpc";

interface ICacheItem {
  timestamp: number;
  result: Promise<any>;
}
const cache: { [key: string]: ICacheItem } = {};
const cacheDuration = 5000; // 5 seconds

const getOrCreate = (key: string, creator: () => Promise<any>): Promise<any> => {
  const now = Date.now();
  const validCacheTime = now - (cacheDuration);

  // check timestamp
  if (cache[key] && cache[key].timestamp < validCacheTime) {
    delete (cache[key]);
  }

  if (!cache[key]) {
    cache[key] = {
      timestamp: now,
      result: creator()
    };
  } else {
    console.log('RPC cache hit', key);
  }
  return cache[key].result;
};

const callServiceMethod = async (data: IRpcRequest): Promise<IRpcResponse> => {
  const id = data.moduleName + '.' + data.serviceName + '.' + data.methodName;
  const urlId = id.replace('/', '@');
  const url = BrowserModuleContext.inernalModuleContext.moduleApiPath + rpcPath + '/' + urlId;
  const options: RequestInit = {
    method: 'POST',
    body: data && JSON.stringify(data),
    headers: { "Content-Type": "application/json; charset=utf-8" }
  };

  let text: string | undefined = undefined;
  let result: IRpcResponse | undefined = undefined;
  let error: any;

  try {
    const response = await fetch(url, options);
    text = await response.text();
    if (response.status.toString().startsWith('2')) {
      result = text ? JSON.parse(text) : undefined;
      if (result && result.error) {
        error = new Error(result.error);
      }
    } else {
      error = new Error(text);
    }
  } catch (err) {
    error = err;
  }

  if (error) {
    if (result) {
      console.error('RPC ' + id, { args: data.args, result });
    } else {
      console.error('RPC ' + id, { args: data.args, result: text, error: error && error.message || error });
    }
    throw error;
  } else {
    console.log('RPC ' + id, { args: data.args, result });
    return result && result.result;
  }
};

export const createRemoteService = <TService>(serviceName: string, moduleName: string): TService => {
  const proxy = new Proxy({}, {
    get: (target, prop: string) => {
      if (prop === 'then') {
        return null; // I'm not a Thenable
      }

      return (...args: any[]) => {
        const request: IRpcRequest = { serviceName, moduleName, methodName: prop, args };
        return getOrCreate(JSON.stringify(request), () => callServiceMethod(request));
      };
    }
  });
  return proxy as TService;
}