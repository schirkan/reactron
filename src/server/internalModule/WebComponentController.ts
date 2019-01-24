import { IWebComponentController, IWebComponentOptions } from '@schirkan/reactron-interfaces';
import { BackendService } from '../BackendService';

export class WebComponentController implements IWebComponentController {
  public async start(): Promise<void> { }

  public async getWebComponentOptions(): Promise<IWebComponentOptions[]> {
    return BackendService.instance.webComponentsManager.getAll();
  }

  public async setWebComponentOptions(options: IWebComponentOptions): Promise<IWebComponentOptions> {
    return BackendService.instance.webComponentsManager.createOrUpdate(options);
  }

  public async deleteWebComponentOptions(id: string): Promise<void> {
    return BackendService.instance.webComponentsManager.remove(id);
  }
}