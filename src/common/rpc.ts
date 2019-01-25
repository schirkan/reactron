export interface IRpcRequest {
  moduleName: string;
  serviceName: string;
  methodName: string;
  args: any[];
}

export interface IRpcResponse {
  result?: any;
  error?: string;
}

export const rpcPath = '/service/rpc';