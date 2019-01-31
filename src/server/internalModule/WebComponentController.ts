import { IWebComponentController, IWebComponentOptions } from '@schirkan/reactron-interfaces';
import { BackendService } from '../BackendService';

export class WebComponentController implements IWebComponentController {
  public async start(): Promise<void> { }

  public async getAll(): Promise<IWebComponentOptions[]> {
    return BackendService.instance.webComponentsManager.getAll();
  }

  public async createOrUpdate(options: IWebComponentOptions): Promise<IWebComponentOptions> {
    return BackendService.instance.webComponentsManager.createOrUpdate(options);
  }

  public async delete(id: string): Promise<void> {
    return BackendService.instance.webComponentsManager.remove(id);
  }
}