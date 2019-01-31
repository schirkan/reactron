import { IWebPageController, IWebPageOptions } from '@schirkan/reactron-interfaces';
import { BackendService } from '../BackendService';

export class WebPageController implements IWebPageController {
  public async start(): Promise<void> { }

  public async getAll(): Promise<IWebPageOptions[]> {
    return BackendService.instance.webPageManager.getAll();
  }

  public async createOrUpdate(options: IWebPageOptions): Promise<IWebPageOptions> {
    return BackendService.instance.webPageManager.createOrUpdate(options);
  }

  public async delete(id: string): Promise<void> {
    return BackendService.instance.webPageManager.remove(id);
  }
}