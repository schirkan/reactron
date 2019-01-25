import { IServiceRepositoryItem, IServiceController, IReactronServiceContext } from '@schirkan/reactron-interfaces';
import { rpcPath, IRpcRequest, IRpcResponse } from '../../common/rpc';
import { BackendService } from '../BackendService';

export class ServiceController implements IServiceController {
  constructor(private context: IReactronServiceContext) { }

  public async getAllServices(): Promise<IServiceRepositoryItem[]> {
    const result = await BackendService.instance.serviceRepository.getAll();
    const serviceInfos = result.map(item => {
      const { instance, service, context, ...serviceInfo } = item;
      return serviceInfo as IServiceRepositoryItem;
    });
    return serviceInfos
  }

  public async getServiceOptions(moduleName: string, serviceName: string): Promise<any> {
    return BackendService.instance.serviceOptionsRepository.get(moduleName, serviceName);
  }

  public async setServiceOptions(moduleName: string, serviceName: string, options: object): Promise<void> {
    return await BackendService.instance.serviceManager.setOptions(moduleName, serviceName, options);
  }

  public async start(): Promise<void> {
    this.context.log.debug('Register route: ' + rpcPath);

    this.context.moduleApiRouter.post(rpcPath + '/:id', async (req, res) => {
      let response: IRpcResponse;
      try {
        const data = req.body as IRpcRequest;
        const service = BackendService.instance.serviceManager.get(data.moduleName, data.serviceName);
        const method: Function = service && service[data.methodName];
        if (!method) {
          response = { error: 'RPC method not found' };
          this.context.log.error('RPC method not found: ' + req.params.id, data);
        } else {
          const result = await Promise.resolve(method.apply(service, data.args));
          response = { result };
        }
      } catch (error) {
        response = { error: error && error.message || error };
        // const newError = JSON.stringify(error, Object.getOwnPropertyNames(error));
        // this.context.log.error('Error in route: ' + rpcPath, newError);
      }
      res.send(response);
    });
  }
}
